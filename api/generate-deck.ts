import type { VercelRequest, VercelResponse } from '@vercel/node'
import Anthropic from '@anthropic-ai/sdk'
import { Sandbox } from '@e2b/code-interpreter'
import { readFileSync } from 'fs'
import { join } from 'path'

export const maxDuration = 120

const SONNET_MODEL = 'claude-sonnet-4-20250514'

// ── Client configs (self-contained for Vercel) ─────────────────────────
const CLIENT_CONFIGS: Record<string, {
  description: string; bullets: string; chartColors: string
  companyName: string; shortName: string; monogram: string
  primaryColor: string; primaryDark: string; accentColor: string
}> = {
  acme: {
    description: 'Acme Bank Corporation, a diversified financial services company',
    bullets: `- Assets Under Custody/Administration: $8.5 trillion
- Annual Revenue: ~$12 billion
- ~35,000 employees globally
- Diversified across commercial, wealth, capital markets, and retail banking
- Headquarters: New York, New York`,
    chartColors: '#006747 (green), #D4AF37 (gold), #10b981, #3b82f6, #f59e0b, #ef4444, #8b5cf6',
    companyName: 'Acme Bank Corporation',
    shortName: 'Acme Bank',
    monogram: 'AB',
    primaryColor: '#006747',
    primaryDark: '#004d35',
    accentColor: '#D4AF37',
  },
}

// ── Data loading ───────────────────────────────────────────────────────
const dataCache = new Map<string, string>()
function getDataJson(clientId?: string): string {
  const id = clientId || 'acme'
  if (dataCache.has(id)) return dataCache.get(id)!

  const filenames = [`data-${id}.json`, 'data.json']
  const basePaths = [join(process.cwd(), 'api'), process.cwd(), '/var/task/api']

  for (const base of basePaths) {
    for (const file of filenames) {
      try {
        const data = readFileSync(join(base, file), 'utf-8')
        dataCache.set(id, data)
        return data
      } catch { /* try next */ }
    }
  }
  throw new Error('Could not find data.json')
}

const DATA_SCHEMA = `The data.json contains these top-level keys:
- executiveSummary: AUC, revenue (QTD/YTD), costToIncome, preTaxMargin, EPS, alerts, strategicTargets
- revenue: timeSeries (36 months), byCategory (revenue categories with actual/budget/priorYear), topClients
- auc: total, feeEarning, change (daily/monthly/yearly), netNewBusiness (quarterly), feeMargin, byAssetClass, byRegion, byClientSegment, topClients
- operational: costToIncome (current + trend), costPerTransaction, stpRate, automationRate, expensesByCategory
- profitability: NII, nonInterestIncome, totalRevenue, opExpenses, preTaxIncome, netIncome, ROE, ROA, margins, EPS, bookValue, sharesOutstanding, timeSeries
- risk: operationalEvents, settlementFailRate, capitalRatios, liquidityRatios
- clientMetrics: retentionRate, churnRate, newClients, lostClients, avgRevenuePerClient, clientGrowth
- peerComparison: peers with AUC/revenue/ROE/efficiency/marketCap
- balanceSheet: totalAssets, loans, securities, deposits, equity, leverageRatio, RWA, capitalAllocation
- segmentPnL: segments with revenue/expenses/ROE/efficiency
- capital: CET1 (ratio/capital/RWA/headroom), Tier1, totalCapital, SLR, AOCI
- liquidity: LCR, NSFR, liquidityBuffer, unencumberedAssets, depositStability
- interestRate: NII, NIM, sensitivity, depositBeta, duration, repricingGaps
- forecasts: deposits7D, deposits12W, loans12W, nii8Q, lcr7D, cet18Q
- peers: bank peers with marketData, valuation, fundamentals, creditMarket, news`

// ── Prompts ────────────────────────────────────────────────────────────
function getDeckSystemPrompt(clientId?: string): string {
  const c = CLIENT_CONFIGS[clientId || 'acme'] || CLIENT_CONFIGS.acme
  return `You are a presentation strategist creating executive PowerPoint decks for ${c.description}.

## Company Context
${c.bullets}

## Your Task
Given a user prompt describing the story to tell, create a structured slide plan as JSON. You will be given the full financial dataset — every number in your plan MUST come from this data.

## Output Format
Respond with ONLY valid JSON matching this schema. No text before or after.

{
  "title": "Deck title",
  "subtitle": "Subtitle or date line",
  "slides": [
    {
      "layout": "title|section-divider|kpi-grid|chart-narrative|two-column|table|title-content",
      "title": "Slide title",
      "subtitle": "Optional subtitle",
      "content": {
        "textBlocks": [{"text": "...", "style": "heading|body|bullet|callout", "position": "left|right|full"}],
        "charts": [{"type": "bar|line|pie|doughnut|scatter", "title": "Chart title", "data": {"labels": [...], "series": [{"name": "...", "values": [...]}]}, "position": "left|right|full"}],
        "tables": [{"headers": ["Col1","Col2"], "rows": [["val1","val2"]], "position": "left|right|full"}],
        "kpis": [{"label": "CET1 Ratio", "value": "12.8%", "change": "+30bps QoQ", "status": "positive|negative|neutral"}],
        "narrative": "Executive commentary for this slide",
        "speakerNotes": "Additional context for the presenter"
      }
    }
  ]
}

## Layout Types
- **title**: Opening slide only. Deck title, subtitle, company name, date.
- **section-divider**: Between major sections. Title + optional subtitle only.
- **kpi-grid**: 3-6 headline KPI metrics with values, changes, and status. Include narrative below.
- **chart-narrative**: Chart (left ~60%) with narrative text (right ~40%).
- **two-column**: Two content areas side by side.
- **table**: Full-width data table. 4-8 rows max.
- **title-content**: Title with full-width text/bullets below.

## Chart Types
- **bar**: Comparisons across categories. Budget vs actual, YoY.
- **line**: Trends over time. 2-4 series max.
- **pie/doughnut**: Composition or mix. Max 6 slices.
- **scatter**: Correlation (P/E vs ROE, etc.).

## Story Arc
1. Title slide → 2. Executive summary (kpi-grid) → 3. Deep-dive slides → 4. Peer positioning → 5. Outlook/closing

## Critical Rules
- ONLY use numbers from the provided dataset.
- Chart data arrays must contain actual numbers.
- Format currency as "$X.XB" or "$XXXM". Percentages to 1 decimal.
- No emoji.

${DATA_SCHEMA}`
}

// ── Python render script ───────────────────────────────────────────────
// Uses a function to properly inject JSON data into the Python script
function buildRenderScript(planJson: string, configJson: string): string {
  // Write JSON to files in /tmp so Python can load them cleanly (avoids quote escaping issues)
  return `
import json
from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

SLIDE_PLAN = json.load(open('/tmp/slide_plan.json'))
CLIENT_CONFIG = json.load(open('/tmp/client_config.json'))

def hex_to_rgb(h):
    h = h.lstrip('#')
    return RGBColor(int(h[0:2],16), int(h[2:4],16), int(h[4:6],16))

PRIMARY = hex_to_rgb(CLIENT_CONFIG['primaryColor'])
ACCENT = hex_to_rgb(CLIENT_CONFIG.get('accentColor', '#D4AF37'))
WHITE = RGBColor(0xFF, 0xFF, 0xFF)
DARK_TEXT = RGBColor(0x33, 0x33, 0x33)
LIGHT_GRAY = RGBColor(0xF5, 0xF5, 0xF5)
MED_GRAY = RGBColor(0xCC, 0xCC, 0xCC)
CHART_COLORS = [PRIMARY, ACCENT, hex_to_rgb('#10b981'), hex_to_rgb('#3b82f6'),
                hex_to_rgb('#f59e0b'), hex_to_rgb('#ef4444'), hex_to_rgb('#8b5cf6')]

SLIDE_WIDTH = Inches(13.33)
SLIDE_HEIGHT = Inches(7.5)
MARGIN = Inches(0.5)
HEADER_H = Inches(1.0)
CONTENT_TOP = Inches(1.2)
CONTENT_H = Inches(5.3)
CONTENT_W = SLIDE_WIDTH - 2 * MARGIN
FOOTER_H = Inches(0.6)

def add_textbox(slide, left, top, width, height, text, font_size=12, bold=False,
                color=DARK_TEXT, alignment=PP_ALIGN.LEFT, font_name='Calibri'):
    txBox = slide.shapes.add_textbox(left, top, width, height)
    tf = txBox.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = text
    p.font.size = Pt(font_size)
    p.font.bold = bold
    p.font.color.rgb = color
    p.font.name = font_name
    p.alignment = alignment
    return txBox

def set_slide_bg(slide, color):
    fill = slide.background.fill
    fill.solid()
    fill.fore_color.rgb = color

def add_header_bar(slide, title, subtitle=None):
    shape = slide.shapes.add_shape(1, Inches(0), Inches(0), SLIDE_WIDTH, HEADER_H)
    shape.fill.solid()
    shape.fill.fore_color.rgb = PRIMARY
    shape.line.fill.background()
    add_textbox(slide, MARGIN, Inches(0.15), CONTENT_W, Inches(0.5),
                title, font_size=24, bold=True, color=WHITE)
    if subtitle:
        add_textbox(slide, MARGIN, Inches(0.55), CONTENT_W, Inches(0.35),
                    subtitle, font_size=14, color=WHITE)

def add_footer(slide):
    add_textbox(slide, MARGIN, SLIDE_HEIGHT - FOOTER_H, Inches(4), FOOTER_H,
                CLIENT_CONFIG['companyName'], font_size=9, color=MED_GRAY)

def add_speaker_notes(slide, notes_text):
    if notes_text:
        notes_slide = slide.notes_slide
        notes_slide.notes_text_frame.text = notes_text

CHART_COUNTER = [0]

def get_chart_hex_colors():
    cc = CLIENT_CONFIG.get('chartColors', '')
    defaults = ['#006747', '#D4AF37', '#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6']
    if cc:
        import re as _re
        found = _re.findall(r'#[0-9a-fA-F]{6}', cc)
        if found:
            return found
    return defaults

def render_chart_image(chart_spec, w_inches, h_inches):
    chart_type = chart_spec.get('type', 'bar')
    title = chart_spec.get('title', '')
    data_spec = chart_spec.get('data', {})
    labels = data_spec.get('labels', [])
    series_list = data_spec.get('series', [])
    colors = get_chart_hex_colors()
    fig, ax = plt.subplots(figsize=(w_inches, h_inches))
    fig.patch.set_facecolor('white')
    ax.set_facecolor('white')
    if chart_type in ('pie', 'doughnut'):
        values = series_list[0]['values'] if series_list else []
        wc = [colors[i % len(colors)] for i in range(len(labels))]
        if chart_type == 'doughnut':
            wedges, texts, autotexts = ax.pie(values, labels=labels, colors=wc, autopct='%1.0f%%', pctdistance=0.75, startangle=90)
            ax.add_patch(plt.Circle((0,0), 0.50, fc='white'))
        else:
            ax.pie(values, labels=labels, colors=wc, autopct='%1.0f%%', startangle=90)
    elif chart_type == 'scatter':
        for i, s in enumerate(series_list[:4]):
            ax.scatter(range(len(s['values'])), s['values'], label=s.get('name',''), color=colors[i%len(colors)], s=60)
        ax.legend(fontsize=8); ax.grid(True, alpha=0.3)
    elif chart_type == 'line':
        for i, s in enumerate(series_list[:4]):
            ax.plot(range(len(s['values'])), s['values'], label=s.get('name',''), color=colors[i%len(colors)], linewidth=2, marker='o', markersize=4)
        if labels:
            step = max(1, len(labels)//8)
            ax.set_xticks(range(0, len(labels), step))
            ax.set_xticklabels([labels[i] for i in range(0, len(labels), step)], fontsize=8, rotation=30)
        ax.legend(fontsize=8); ax.grid(True, alpha=0.3)
    else:
        import numpy as np
        x = np.arange(len(labels))
        n = min(len(series_list), 4)
        bw = 0.7 / max(n, 1)
        for i, s in enumerate(series_list[:4]):
            ax.bar(x + (i - n/2 + 0.5)*bw, s['values'][:len(labels)], bw, label=s.get('name',''), color=colors[i%len(colors)])
        ax.set_xticks(x); ax.set_xticklabels(labels, fontsize=8, rotation=30 if len(labels)>5 else 0)
        ax.legend(fontsize=8); ax.grid(True, axis='y', alpha=0.3)
    if title: ax.set_title(title, fontsize=12, fontweight='bold', pad=10)
    plt.tight_layout()
    CHART_COUNTER[0] += 1
    path = f'/tmp/chart_{CHART_COUNTER[0]}.png'
    fig.savefig(path, dpi=150, bbox_inches='tight', facecolor='white')
    plt.close(fig)
    return path

def add_chart_to_slide(slide, chart_spec, left, top, width, height):
    data_spec = chart_spec.get('data', {})
    labels = data_spec.get('labels', [])
    series_list = data_spec.get('series', [])
    if not labels or not series_list:
        shape = slide.shapes.add_shape(1, left, top, width, height)
        shape.fill.solid(); shape.fill.fore_color.rgb = LIGHT_GRAY
        shape.line.color.rgb = MED_GRAY
        add_textbox(slide, left+Inches(0.2), top+Inches(0.2), width-Inches(0.4), Inches(0.4),
                    chart_spec.get('title','Chart'), font_size=14, bold=True, color=PRIMARY)
        return
    w_in = width / Inches(1)
    h_in = height / Inches(1)
    try:
        img_path = render_chart_image(chart_spec, w_in, h_in)
        slide.shapes.add_picture(img_path, left, top, width, height)
    except Exception as e:
        shape = slide.shapes.add_shape(1, left, top, width, height)
        shape.fill.solid(); shape.fill.fore_color.rgb = LIGHT_GRAY
        shape.line.color.rgb = MED_GRAY
        add_textbox(slide, left+Inches(0.2), top+Inches(0.2), width-Inches(0.4), Inches(0.4),
                    f"Chart error: {str(e)[:80]}", font_size=10, color=DARK_TEXT)

def add_table_to_slide(slide, table_spec, left, top, width, height):
    headers = table_spec.get('headers', [])
    rows_data = table_spec.get('rows', [])
    if not headers: return
    num_rows = len(rows_data) + 1
    num_cols = len(headers)
    table_shape = slide.shapes.add_table(num_rows, num_cols, left, top, width, min(height, Inches(0.4) * num_rows))
    table = table_shape.table
    col_w = width // num_cols
    for i in range(num_cols):
        table.columns[i].width = col_w
    for i, h in enumerate(headers):
        cell = table.cell(0, i)
        cell.text = h
        for p in cell.text_frame.paragraphs:
            p.font.size = Pt(10); p.font.bold = True; p.font.color.rgb = WHITE
        cell.fill.solid(); cell.fill.fore_color.rgb = PRIMARY
    for r, row in enumerate(rows_data):
        for c, val in enumerate(row):
            if c >= num_cols: break
            cell = table.cell(r+1, c)
            cell.text = str(val)
            for p in cell.text_frame.paragraphs:
                p.font.size = Pt(9); p.font.color.rgb = DARK_TEXT
            if r % 2 == 0:
                cell.fill.solid(); cell.fill.fore_color.rgb = LIGHT_GRAY

def add_kpi_box(slide, kpi, left, top, width, height):
    shape = slide.shapes.add_shape(1, left, top, width, height)
    shape.fill.solid(); shape.fill.fore_color.rgb = LIGHT_GRAY
    shape.line.color.rgb = MED_GRAY; shape.line.width = Pt(0.5)
    add_textbox(slide, left+Inches(0.15), top+Inches(0.15), width-Inches(0.3), Inches(0.5),
                kpi.get('value',''), font_size=22, bold=True, color=PRIMARY, alignment=PP_ALIGN.CENTER)
    add_textbox(slide, left+Inches(0.15), top+Inches(0.6), width-Inches(0.3), Inches(0.3),
                kpi.get('label',''), font_size=10, color=DARK_TEXT, alignment=PP_ALIGN.CENTER)
    change = kpi.get('change','')
    if change:
        status = kpi.get('status','neutral')
        cc = hex_to_rgb('#10b981') if status=='positive' else (hex_to_rgb('#ef4444') if status=='negative' else MED_GRAY)
        arrow = '\\u25b2 ' if status=='positive' else ('\\u25bc ' if status=='negative' else '')
        add_textbox(slide, left+Inches(0.15), top+Inches(0.85), width-Inches(0.3), Inches(0.25),
                    arrow+change, font_size=9, bold=True, color=cc, alignment=PP_ALIGN.CENTER)

# Layout functions
def layout_title(prs, spec):
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_bg(slide, PRIMARY)
    add_textbox(slide, MARGIN, Inches(2.0), CONTENT_W, Inches(1.2),
                SLIDE_PLAN.get('title', spec.get('title','')), font_size=36, bold=True, color=WHITE,
                alignment=PP_ALIGN.CENTER, font_name='Calibri Light')
    sub = SLIDE_PLAN.get('subtitle', spec.get('subtitle',''))
    if sub:
        add_textbox(slide, MARGIN, Inches(3.3), CONTENT_W, Inches(0.6), sub, font_size=18, color=WHITE, alignment=PP_ALIGN.CENTER)
    add_textbox(slide, MARGIN, Inches(4.5), CONTENT_W, Inches(0.5),
                CLIENT_CONFIG['companyName'], font_size=14, color=WHITE, alignment=PP_ALIGN.CENTER)
    add_textbox(slide, MARGIN, Inches(6.5), CONTENT_W, Inches(0.3),
                'CONFIDENTIAL', font_size=10, color=WHITE, alignment=PP_ALIGN.CENTER)
    add_speaker_notes(slide, spec.get('content',{}).get('speakerNotes',''))

def layout_section_divider(prs, spec):
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_bg(slide, PRIMARY)
    add_textbox(slide, MARGIN, Inches(2.5), CONTENT_W, Inches(1.0), spec['title'],
                font_size=32, bold=True, color=WHITE, alignment=PP_ALIGN.CENTER, font_name='Calibri Light')
    if spec.get('subtitle'):
        add_textbox(slide, MARGIN, Inches(3.6), CONTENT_W, Inches(0.5), spec['subtitle'],
                    font_size=16, color=WHITE, alignment=PP_ALIGN.CENTER)
    add_speaker_notes(slide, spec.get('content',{}).get('speakerNotes',''))

def layout_kpi_grid(prs, spec):
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    add_header_bar(slide, spec['title'], spec.get('subtitle'))
    content = spec.get('content',{})
    kpis = content.get('kpis',[])
    if kpis:
        n = min(len(kpis), 6)
        kw = (CONTENT_W - Inches(0.2)*(n-1)) // n
        for i, kpi in enumerate(kpis[:n]):
            add_kpi_box(slide, kpi, MARGIN + i*(kw+Inches(0.2)), CONTENT_TOP+Inches(0.2), kw, Inches(1.2))
    narrative = content.get('narrative','')
    if narrative:
        add_textbox(slide, MARGIN, CONTENT_TOP+Inches(1.8), CONTENT_W, Inches(2.5), narrative, font_size=12)
    add_footer(slide)
    add_speaker_notes(slide, content.get('speakerNotes',''))

def layout_chart_narrative(prs, spec):
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    add_header_bar(slide, spec['title'], spec.get('subtitle'))
    content = spec.get('content',{})
    cw = Inches(7.5)
    charts = content.get('charts',[])
    if charts:
        add_chart_to_slide(slide, charts[0], MARGIN, CONTENT_TOP+Inches(0.1), cw, CONTENT_H-Inches(0.2))
    nl = MARGIN + cw + Inches(0.3)
    nw = CONTENT_W - cw - Inches(0.3)
    narrative = content.get('narrative','')
    if narrative:
        add_textbox(slide, nl, CONTENT_TOP+Inches(0.1), nw, CONTENT_H-Inches(0.2), narrative, font_size=11)
    add_footer(slide)
    add_speaker_notes(slide, content.get('speakerNotes',''))

def layout_two_column(prs, spec):
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    add_header_bar(slide, spec['title'], spec.get('subtitle'))
    content = spec.get('content',{})
    cw = (CONTENT_W - Inches(0.3)) / 2
    charts = content.get('charts',[])
    tables = content.get('tables',[])
    left_items, right_items = [], []
    for c in charts:
        (right_items if c.get('position')=='right' else left_items).append(('chart', c))
    for t in tables:
        (right_items if t.get('position')=='right' else left_items).append(('table', t))
    def render(items, x, w):
        y = CONTENT_TOP + Inches(0.1)
        ih = CONTENT_H / max(len(items),1) - Inches(0.1)
        for kind, item in items:
            if kind == 'chart': add_chart_to_slide(slide, item, x, y, w, ih)
            elif kind == 'table': add_table_to_slide(slide, item, x, y, w, ih)
            y += ih + Inches(0.1)
    render(left_items, MARGIN, cw)
    render(right_items, MARGIN + cw + Inches(0.3), cw)
    add_footer(slide)
    add_speaker_notes(slide, content.get('speakerNotes',''))

def layout_table(prs, spec):
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    add_header_bar(slide, spec['title'], spec.get('subtitle'))
    content = spec.get('content',{})
    tables = content.get('tables',[])
    if tables:
        add_table_to_slide(slide, tables[0], MARGIN, CONTENT_TOP+Inches(0.1), CONTENT_W, CONTENT_H-Inches(0.5))
    narrative = content.get('narrative','')
    if narrative:
        add_textbox(slide, MARGIN, SLIDE_HEIGHT-FOOTER_H-Inches(0.7), CONTENT_W, Inches(0.6), narrative, font_size=10)
    add_footer(slide)
    add_speaker_notes(slide, content.get('speakerNotes',''))

def layout_title_content(prs, spec):
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    add_header_bar(slide, spec['title'], spec.get('subtitle'))
    content = spec.get('content',{})
    y = CONTENT_TOP + Inches(0.2)
    for tb in content.get('textBlocks',[]):
        style = tb.get('style','body')
        if style == 'heading':
            add_textbox(slide, MARGIN, y, CONTENT_W, Inches(0.45), tb['text'], font_size=16, bold=True, color=PRIMARY)
            y += Inches(0.5)
        elif style == 'bullet':
            add_textbox(slide, MARGIN+Inches(0.3), y, CONTENT_W-Inches(0.3), Inches(0.35),
                        '\\u2022  '+tb['text'], font_size=12)
            y += Inches(0.4)
        else:
            add_textbox(slide, MARGIN, y, CONTENT_W, Inches(0.35), tb['text'], font_size=12)
            y += Inches(0.4)
    narrative = content.get('narrative','')
    if narrative and y < SLIDE_HEIGHT - FOOTER_H - Inches(1.0):
        add_textbox(slide, MARGIN, y+Inches(0.2), CONTENT_W, Inches(1.5), narrative, font_size=11)
    add_footer(slide)
    add_speaker_notes(slide, content.get('speakerNotes',''))

LAYOUT_MAP = {
    'title': layout_title, 'section-divider': layout_section_divider,
    'kpi-grid': layout_kpi_grid, 'chart-narrative': layout_chart_narrative,
    'two-column': layout_two_column, 'table': layout_table, 'title-content': layout_title_content,
}

prs = Presentation()
prs.slide_width = SLIDE_WIDTH
prs.slide_height = SLIDE_HEIGHT

for slide_spec in SLIDE_PLAN.get('slides', []):
    fn = LAYOUT_MAP.get(slide_spec.get('layout','title-content'), layout_title_content)
    fn(prs, slide_spec)

prs.save('/tmp/output.pptx')

# ── Post-process: fix known OOXML compliance issues ────────────────────
import zipfile
import re
import shutil

def fix_pptx(filepath):
    tmp_path = filepath + '.tmp'
    with zipfile.ZipFile(filepath, 'r') as zin, zipfile.ZipFile(tmp_path, 'w', zipfile.ZIP_DEFLATED) as zout:
        for item in zin.infolist():
            data = zin.read(item.filename)
            if item.filename.endswith('.xml') or item.filename.endswith('.rels'):
                text = data.decode('utf-8')
                if 'presentation.xml' in item.filename:
                    text = re.sub(r'(<p:sldSz[^/]*?) type="[^"]*"', r'\\1', text)
                if '/charts/' in item.filename:
                    text = text.replace('<c:scaling/>', '<c:scaling><c:orientation val="minMax"/></c:scaling>')
                    text = re.sub(r'<c:scaling>\\s*</c:scaling>', '<c:scaling><c:orientation val="minMax"/></c:scaling>', text)
                data = text.encode('utf-8')
            zout.writestr(item, data)
    shutil.move(tmp_path, filepath)

fix_pptx('/tmp/output.pptx')
print('SUCCESS: ' + str(len(SLIDE_PLAN.get('slides', []))) + ' slides generated')
`
}

// ── Helpers ────────────────────────────────────────────────────────────
function extractText(content: Array<{ type: string; text?: string }>): string {
  return content.filter((b) => b.type === 'text' && b.text).map((b) => b.text!).join('\n')
}

// ── Handler ────────────────────────────────────────────────────────────
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { prompt, clientId, focusAreas, audience, slideCount } = req.body
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ success: false, error: 'Missing prompt' })
    }

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY,
    })

    const cfg = CLIENT_CONFIGS[clientId || 'acme'] || CLIENT_CONFIGS.acme
    const dataJson = getDataJson(clientId)
    const truncatedData = dataJson.length > 100000
      ? dataJson.substring(0, 100000) + '...(truncated)'
      : dataJson

    // Build user prompt
    let userPrompt = `Story/Focus: ${prompt}\n`
    if (audience) userPrompt += `Audience: ${audience}\n`
    if (focusAreas?.length) userPrompt += `Focus areas: ${focusAreas.join(', ')}\n`
    if (slideCount) userPrompt += `Target slide count: ${slideCount}\n`
    userPrompt += `\nFinancial dataset:\n${truncatedData}\n\nRespond with ONLY valid JSON matching the SlidePlan schema.`

    // Step 1: Claude generates slide plan
    const response = await anthropic.messages.create({
      model: SONNET_MODEL,
      max_tokens: 16384,
      system: getDeckSystemPrompt(clientId),
      messages: [{ role: 'user', content: userPrompt }],
    })

    const rawText = extractText(response.content).trim()
    const jsonMatch = rawText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return res.status(500).json({ success: false, error: 'Failed to parse slide plan from AI' })
    }

    const slidePlan = JSON.parse(jsonMatch[0])
    if (!slidePlan.slides?.length) {
      return res.status(500).json({ success: false, error: 'AI returned empty slide plan' })
    }

    // Step 2: Render in E2B sandbox
    const planJsonStr = JSON.stringify(slidePlan)
    const configJsonStr = JSON.stringify({
      companyName: cfg.companyName,
      shortName: cfg.shortName,
      monogram: cfg.monogram,
      primaryColor: cfg.primaryColor,
      primaryDark: cfg.primaryDark,
      accentColor: cfg.accentColor,
    })

    const script = buildRenderScript(planJsonStr, configJsonStr)

    const sandbox = await Sandbox.create({ apiKey: process.env.E2B_API_KEY })
    try {
      await sandbox.runCode('import subprocess; subprocess.check_call(["pip", "install", "-q", "python-pptx"])')
      // Write JSON data as files to avoid quote escaping issues
      await sandbox.files.write('/tmp/slide_plan.json', planJsonStr)
      await sandbox.files.write('/tmp/client_config.json', configJsonStr)
      const result = await sandbox.runCode(script)

      if (result.error) {
        return res.status(500).json({
          success: false,
          error: `Python error: ${result.error.name}: ${result.error.value}`,
        })
      }

      const pptxBytes = await sandbox.files.read('/tmp/output.pptx', { format: 'bytes' })
      const buffer = Buffer.from(pptxBytes)
      const date = new Date().toISOString().split('T')[0]
      const filename = `${cfg.shortName.replace(/\s+/g, '_')}_Presentation_${date}.pptx`

      return res.status(200).json({
        success: true,
        filename,
        data: buffer.toString('base64'),
        slideCount: slidePlan.slides.length,
      })
    } finally {
      await sandbox.kill()
    }
  } catch (err: unknown) {
    console.error('Deck generation error:', err)
    const message = err instanceof Error ? err.message : 'Internal server error'
    return res.status(500).json({ success: false, error: message })
  }
}
