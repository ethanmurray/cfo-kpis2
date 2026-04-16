import { Sandbox } from '@e2b/code-interpreter'
import type { SlidePlan, TemplateFillPlan, TemplateSlideInfo } from '../../types/deck.types'
import type { ClientConfig } from '../../config/clientConfig'

/**
 * The fixed Python script that renders a SlidePlan into a .pptx file using python-pptx.
 * SlidePlan JSON and client config are loaded from /tmp files to avoid quote escaping issues.
 */
const RENDER_SCRIPT = `
import json
import os
from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

# ── Load Data from Files ────────────────────────────────────────────────
SLIDE_PLAN = json.load(open('/tmp/slide_plan.json'))
CLIENT_CONFIG = json.load(open('/tmp/client_config.json'))
TEMPLATE_MODE = __TEMPLATE_MODE__

# ── Helpers ─────────────────────────────────────────────────────────────
def hex_to_rgb(h):
    h = h.lstrip('#')
    return RGBColor(int(h[0:2],16), int(h[2:4],16), int(h[4:6],16))

PRIMARY = hex_to_rgb(CLIENT_CONFIG['primaryColor'])
PRIMARY_DARK = hex_to_rgb(CLIENT_CONFIG.get('primaryDark', CLIENT_CONFIG['primaryColor']))
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
FOOTER_H = Inches(0.6)
CONTENT_TOP = Inches(1.2)
CONTENT_H = Inches(5.3)
CONTENT_W = SLIDE_WIDTH - 2 * MARGIN

def set_slide_bg(slide, color):
    bg = slide.background
    fill = bg.fill
    fill.solid()
    fill.fore_color.rgb = color

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

def add_header_bar(slide, title, subtitle=None):
    # Colored header bar
    shape = slide.shapes.add_shape(1, Inches(0), Inches(0), SLIDE_WIDTH, HEADER_H)  # 1 = rectangle
    shape.fill.solid()
    shape.fill.fore_color.rgb = PRIMARY
    shape.line.fill.background()
    # Title text
    add_textbox(slide, MARGIN, Inches(0.15), CONTENT_W, Inches(0.5),
                title, font_size=24, bold=True, color=WHITE)
    if subtitle:
        add_textbox(slide, MARGIN, Inches(0.55), CONTENT_W, Inches(0.35),
                    subtitle, font_size=14, color=WHITE)

def add_footer(slide):
    # Company name and page indicator
    add_textbox(slide, MARGIN, SLIDE_HEIGHT - FOOTER_H, Inches(4), FOOTER_H,
                CLIENT_CONFIG['companyName'], font_size=9, color=MED_GRAY)
    # Logo monogram - small colored box with initials
    logo_left = SLIDE_WIDTH - MARGIN - Inches(0.6)
    shape = slide.shapes.add_shape(1, logo_left, SLIDE_HEIGHT - Inches(0.5), Inches(0.5), Inches(0.35))
    shape.fill.solid()
    shape.fill.fore_color.rgb = PRIMARY
    shape.line.fill.background()
    # Add monogram text
    tf = shape.text_frame
    tf.paragraphs[0].text = CLIENT_CONFIG.get('monogram', 'AB')
    tf.paragraphs[0].font.size = Pt(10)
    tf.paragraphs[0].font.bold = True
    tf.paragraphs[0].font.color.rgb = WHITE
    tf.paragraphs[0].alignment = PP_ALIGN.CENTER
    tf.vertical_anchor = MSO_ANCHOR.MIDDLE

def add_speaker_notes(slide, notes_text):
    if notes_text:
        notes_slide = slide.notes_slide
        notes_slide.notes_text_frame.text = notes_text

# ── Chart Rendering (matplotlib → PNG image) ──────────────────────────
CHART_COUNTER = [0]

def get_chart_hex_colors():
    cc = CLIENT_CONFIG.get('chartColors', '')
    defaults = ['#006747', '#D4AF37', '#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6']
    if cc:
        import re
        found = re.findall(r'#[0-9a-fA-F]{6}', cc)
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

    if chart_type == 'pie' or chart_type == 'doughnut':
        values = series_list[0]['values'] if series_list else []
        wedge_colors = [colors[i % len(colors)] for i in range(len(labels))]
        if chart_type == 'doughnut':
            wedges, texts, autotexts = ax.pie(values, labels=labels, colors=wedge_colors,
                                               autopct='%1.0f%%', pctdistance=0.75, startangle=90)
            centre = plt.Circle((0, 0), 0.50, fc='white')
            ax.add_patch(centre)
        else:
            ax.pie(values, labels=labels, colors=wedge_colors, autopct='%1.0f%%', startangle=90)

    elif chart_type == 'scatter':
        for i, s in enumerate(series_list[:4]):
            ax.scatter(labels if all(isinstance(l, (int, float)) for l in labels) else range(len(s['values'])),
                       s['values'], label=s.get('name', ''), color=colors[i % len(colors)], s=60)
        ax.legend(fontsize=8)
        ax.grid(True, alpha=0.3)

    elif chart_type == 'line':
        for i, s in enumerate(series_list[:4]):
            ax.plot(range(len(s['values'])), s['values'], label=s.get('name', ''),
                    color=colors[i % len(colors)], linewidth=2, marker='o', markersize=4)
        if labels:
            step = max(1, len(labels) // 8)
            ax.set_xticks(range(0, len(labels), step))
            ax.set_xticklabels([labels[i] for i in range(0, len(labels), step)], fontsize=8, rotation=30)
        ax.legend(fontsize=8)
        ax.grid(True, alpha=0.3)

    else:  # bar (default)
        import numpy as np
        x = np.arange(len(labels))
        n_series = min(len(series_list), 4)
        bar_w = 0.7 / max(n_series, 1)
        for i, s in enumerate(series_list[:4]):
            offset = (i - n_series / 2 + 0.5) * bar_w
            ax.bar(x + offset, s['values'][:len(labels)], bar_w, label=s.get('name', ''),
                   color=colors[i % len(colors)])
        ax.set_xticks(x)
        ax.set_xticklabels(labels, fontsize=8, rotation=30 if len(labels) > 5 else 0)
        ax.legend(fontsize=8)
        ax.grid(True, axis='y', alpha=0.3)

    if title:
        ax.set_title(title, fontsize=12, fontweight='bold', pad=10)
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
        # Fallback: gray box with title if no data
        shape = slide.shapes.add_shape(1, left, top, width, height)
        shape.fill.solid()
        shape.fill.fore_color.rgb = LIGHT_GRAY
        shape.line.color.rgb = MED_GRAY
        add_textbox(slide, left + Inches(0.2), top + Inches(0.2), width - Inches(0.4), Inches(0.4),
                    chart_spec.get('title', 'Chart'), font_size=14, bold=True, color=PRIMARY)
        return

    w_in = width / Inches(1)
    h_in = height / Inches(1)
    try:
        img_path = render_chart_image(chart_spec, w_in, h_in)
        slide.shapes.add_picture(img_path, left, top, width, height)
    except Exception as e:
        shape = slide.shapes.add_shape(1, left, top, width, height)
        shape.fill.solid()
        shape.fill.fore_color.rgb = LIGHT_GRAY
        shape.line.color.rgb = MED_GRAY
        add_textbox(slide, left + Inches(0.2), top + Inches(0.2), width - Inches(0.4), Inches(0.4),
                    f"Chart error: {str(e)[:80]}", font_size=10, color=DARK_TEXT)

# ── Table Rendering ─────────────────────────────────────────────────────
def add_table_to_slide(slide, table_spec, left, top, width, height):
    headers = table_spec.get('headers', [])
    rows_data = table_spec.get('rows', [])
    if not headers:
        return

    num_rows = len(rows_data) + 1  # +1 for header
    num_cols = len(headers)
    row_h = min(Inches(0.4), height // num_rows) if num_rows > 0 else Inches(0.4)

    table_shape = slide.shapes.add_table(num_rows, num_cols, left, top, width, min(height, row_h * num_rows))
    table = table_shape.table

    # Column widths
    col_w = width // num_cols
    for i in range(num_cols):
        table.columns[i].width = col_w

    # Header row
    for i, h in enumerate(headers):
        cell = table.cell(0, i)
        cell.text = h
        for paragraph in cell.text_frame.paragraphs:
            paragraph.font.size = Pt(10)
            paragraph.font.bold = True
            paragraph.font.color.rgb = WHITE
            paragraph.font.name = 'Calibri'
        cell.fill.solid()
        cell.fill.fore_color.rgb = PRIMARY

    # Data rows
    for r_idx, row in enumerate(rows_data):
        for c_idx, val in enumerate(row):
            if c_idx >= num_cols:
                break
            cell = table.cell(r_idx + 1, c_idx)
            cell.text = str(val)
            for paragraph in cell.text_frame.paragraphs:
                paragraph.font.size = Pt(9)
                paragraph.font.color.rgb = DARK_TEXT
                paragraph.font.name = 'Calibri'
            # Alternating row shading
            if r_idx % 2 == 0:
                cell.fill.solid()
                cell.fill.fore_color.rgb = LIGHT_GRAY

# ── KPI Box ─────────────────────────────────────────────────────────────
def add_kpi_box(slide, kpi, left, top, width, height):
    # Background box
    shape = slide.shapes.add_shape(1, left, top, width, height)
    shape.fill.solid()
    shape.fill.fore_color.rgb = LIGHT_GRAY
    shape.line.color.rgb = MED_GRAY
    shape.line.width = Pt(0.5)

    # Value (large)
    add_textbox(slide, left + Inches(0.15), top + Inches(0.15), width - Inches(0.3), Inches(0.5),
                kpi.get('value', ''), font_size=22, bold=True, color=PRIMARY, alignment=PP_ALIGN.CENTER)

    # Label
    add_textbox(slide, left + Inches(0.15), top + Inches(0.6), width - Inches(0.3), Inches(0.3),
                kpi.get('label', ''), font_size=10, color=DARK_TEXT, alignment=PP_ALIGN.CENTER)

    # Change indicator
    change = kpi.get('change', '')
    if change:
        status = kpi.get('status', 'neutral')
        change_color = hex_to_rgb('#10b981') if status == 'positive' else (
            hex_to_rgb('#ef4444') if status == 'negative' else MED_GRAY)
        arrow = '\\u25b2 ' if status == 'positive' else ('\\u25bc ' if status == 'negative' else '')
        add_textbox(slide, left + Inches(0.15), top + Inches(0.85), width - Inches(0.3), Inches(0.25),
                    arrow + change, font_size=9, bold=True, color=change_color, alignment=PP_ALIGN.CENTER)

# ── Layout Functions ────────────────────────────────────────────────────
def add_title_slide(prs, spec):
    slide = prs.slides.add_slide(prs.slide_layouts[6])  # Blank layout
    set_slide_bg(slide, PRIMARY)

    # Title
    add_textbox(slide, MARGIN, Inches(2.0), CONTENT_W, Inches(1.2),
                SLIDE_PLAN.get('title', spec.get('title', '')),
                font_size=36, bold=True, color=WHITE, alignment=PP_ALIGN.CENTER, font_name='Calibri Light')
    # Subtitle
    sub = SLIDE_PLAN.get('subtitle', spec.get('subtitle', ''))
    if sub:
        add_textbox(slide, MARGIN, Inches(3.3), CONTENT_W, Inches(0.6),
                    sub, font_size=18, color=WHITE, alignment=PP_ALIGN.CENTER)
    # Company name
    add_textbox(slide, MARGIN, Inches(4.5), CONTENT_W, Inches(0.5),
                CLIENT_CONFIG['companyName'], font_size=14, color=WHITE, alignment=PP_ALIGN.CENTER)
    # Confidential notice
    add_textbox(slide, MARGIN, Inches(6.5), CONTENT_W, Inches(0.3),
                'CONFIDENTIAL', font_size=10, color=WHITE, alignment=PP_ALIGN.CENTER)
    add_speaker_notes(slide, spec.get('content', {}).get('speakerNotes', ''))

def add_section_divider(prs, spec):
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_bg(slide, PRIMARY)
    add_textbox(slide, MARGIN, Inches(2.5), CONTENT_W, Inches(1.0),
                spec['title'], font_size=32, bold=True, color=WHITE, alignment=PP_ALIGN.CENTER, font_name='Calibri Light')
    if spec.get('subtitle'):
        add_textbox(slide, MARGIN, Inches(3.6), CONTENT_W, Inches(0.5),
                    spec['subtitle'], font_size=16, color=WHITE, alignment=PP_ALIGN.CENTER)
    add_speaker_notes(slide, spec.get('content', {}).get('speakerNotes', ''))

def add_kpi_grid_slide(prs, spec):
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    add_header_bar(slide, spec['title'], spec.get('subtitle'))
    content = spec.get('content', {})
    kpis = content.get('kpis', [])

    if kpis:
        num_kpis = min(len(kpis), 6)
        kpi_w = (CONTENT_W - Inches(0.2) * (num_kpis - 1)) // num_kpis
        kpi_h = Inches(1.2)
        for i, kpi in enumerate(kpis[:num_kpis]):
            kpi_left = MARGIN + i * (kpi_w + Inches(0.2))
            add_kpi_box(slide, kpi, kpi_left, CONTENT_TOP + Inches(0.2), kpi_w, kpi_h)

    # Narrative below KPIs
    narrative = content.get('narrative', '')
    if narrative:
        add_textbox(slide, MARGIN, CONTENT_TOP + Inches(1.8), CONTENT_W, Inches(2.5),
                    narrative, font_size=12, color=DARK_TEXT)

    add_footer(slide)
    add_speaker_notes(slide, content.get('speakerNotes', ''))

def add_chart_narrative_slide(prs, spec):
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    add_header_bar(slide, spec['title'], spec.get('subtitle'))
    content = spec.get('content', {})

    chart_w = Inches(7.5)
    narrative_left = MARGIN + chart_w + Inches(0.3)
    narrative_w = CONTENT_W - chart_w - Inches(0.3)

    # Chart on left
    charts = content.get('charts', [])
    if charts:
        add_chart_to_slide(slide, charts[0], MARGIN, CONTENT_TOP + Inches(0.1), chart_w, CONTENT_H - Inches(0.2))

    # Narrative on right
    narrative = content.get('narrative', '')
    text_blocks = content.get('textBlocks', [])
    if narrative:
        add_textbox(slide, narrative_left, CONTENT_TOP + Inches(0.1), narrative_w, CONTENT_H - Inches(0.2),
                    narrative, font_size=11, color=DARK_TEXT)
    elif text_blocks:
        y = CONTENT_TOP + Inches(0.1)
        for tb in text_blocks:
            sz = 14 if tb.get('style') == 'heading' else (11 if tb.get('style') == 'body' else 10)
            bld = tb.get('style') == 'heading'
            prefix = '  \\u2022 ' if tb.get('style') == 'bullet' else ''
            box = add_textbox(slide, narrative_left, y, narrative_w, Inches(0.4),
                              prefix + tb['text'], font_size=sz, bold=bld, color=DARK_TEXT)
            y += Inches(0.45)

    add_footer(slide)
    add_speaker_notes(slide, content.get('speakerNotes', ''))

def add_two_column_slide(prs, spec):
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    add_header_bar(slide, spec['title'], spec.get('subtitle'))
    content = spec.get('content', {})

    col_w = (CONTENT_W - Inches(0.3)) / 2
    left_x = MARGIN
    right_x = MARGIN + col_w + Inches(0.3)

    charts = content.get('charts', [])
    tables = content.get('tables', [])
    text_blocks = content.get('textBlocks', [])

    # Place elements into columns based on position attribute or order
    left_items = []
    right_items = []

    for c in charts:
        if c.get('position') == 'right':
            right_items.append(('chart', c))
        else:
            left_items.append(('chart', c))
    for t in tables:
        if t.get('position') == 'right':
            right_items.append(('table', t))
        else:
            left_items.append(('table', t))
    for tb in text_blocks:
        if tb.get('position') == 'right':
            right_items.append(('text', tb))
        else:
            left_items.append(('text', tb))

    def render_items(items, x, w):
        y = CONTENT_TOP + Inches(0.1)
        item_h = CONTENT_H / max(len(items), 1) - Inches(0.1)
        for kind, item in items:
            if kind == 'chart':
                add_chart_to_slide(slide, item, x, y, w, item_h)
            elif kind == 'table':
                add_table_to_slide(slide, item, x, y, w, item_h)
            elif kind == 'text':
                sz = 14 if item.get('style') == 'heading' else 11
                bld = item.get('style') == 'heading'
                prefix = '  \\u2022 ' if item.get('style') == 'bullet' else ''
                add_textbox(slide, x, y, w, item_h, prefix + item['text'],
                            font_size=sz, bold=bld, color=DARK_TEXT)
            y += item_h + Inches(0.1)

    render_items(left_items, left_x, col_w)
    render_items(right_items, right_x, col_w)

    # Narrative at bottom if present
    narrative = content.get('narrative', '')
    if narrative:
        add_textbox(slide, MARGIN, SLIDE_HEIGHT - FOOTER_H - Inches(0.8), CONTENT_W, Inches(0.7),
                    narrative, font_size=10, color=DARK_TEXT)

    add_footer(slide)
    add_speaker_notes(slide, content.get('speakerNotes', ''))

def add_table_full_slide(prs, spec):
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    add_header_bar(slide, spec['title'], spec.get('subtitle'))
    content = spec.get('content', {})

    tables = content.get('tables', [])
    if tables:
        add_table_to_slide(slide, tables[0], MARGIN, CONTENT_TOP + Inches(0.1),
                           CONTENT_W, CONTENT_H - Inches(0.5))

    narrative = content.get('narrative', '')
    if narrative:
        add_textbox(slide, MARGIN, SLIDE_HEIGHT - FOOTER_H - Inches(0.7), CONTENT_W, Inches(0.6),
                    narrative, font_size=10, color=DARK_TEXT)

    add_footer(slide)
    add_speaker_notes(slide, content.get('speakerNotes', ''))

def add_title_content_slide(prs, spec):
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    add_header_bar(slide, spec['title'], spec.get('subtitle'))
    content = spec.get('content', {})

    y = CONTENT_TOP + Inches(0.2)
    text_blocks = content.get('textBlocks', [])
    for tb in text_blocks:
        style = tb.get('style', 'body')
        if style == 'heading':
            add_textbox(slide, MARGIN, y, CONTENT_W, Inches(0.45),
                        tb['text'], font_size=16, bold=True, color=PRIMARY)
            y += Inches(0.5)
        elif style == 'bullet':
            add_textbox(slide, MARGIN + Inches(0.3), y, CONTENT_W - Inches(0.3), Inches(0.35),
                        '\\u2022  ' + tb['text'], font_size=12, color=DARK_TEXT)
            y += Inches(0.4)
        elif style == 'callout':
            # Callout box
            shape = slide.shapes.add_shape(1, MARGIN, y, CONTENT_W, Inches(0.6))
            shape.fill.solid()
            shape.fill.fore_color.rgb = LIGHT_GRAY
            shape.line.fill.background()
            add_textbox(slide, MARGIN + Inches(0.2), y + Inches(0.1), CONTENT_W - Inches(0.4), Inches(0.4),
                        tb['text'], font_size=12, bold=True, color=PRIMARY)
            y += Inches(0.75)
        else:  # body
            add_textbox(slide, MARGIN, y, CONTENT_W, Inches(0.35),
                        tb['text'], font_size=12, color=DARK_TEXT)
            y += Inches(0.4)

    narrative = content.get('narrative', '')
    if narrative and y < SLIDE_HEIGHT - FOOTER_H - Inches(1.0):
        add_textbox(slide, MARGIN, y + Inches(0.2), CONTENT_W, Inches(1.5),
                    narrative, font_size=11, color=DARK_TEXT)

    add_footer(slide)
    add_speaker_notes(slide, content.get('speakerNotes', ''))

# ── Main ────────────────────────────────────────────────────────────────
LAYOUT_MAP = {
    'title': add_title_slide,
    'section-divider': add_section_divider,
    'kpi-grid': add_kpi_grid_slide,
    'chart-narrative': add_chart_narrative_slide,
    'two-column': add_two_column_slide,
    'table': add_table_full_slide,
    'title-content': add_title_content_slide,
}

if TEMPLATE_MODE:
    prs = Presentation('/tmp/template.pptx')
else:
    prs = Presentation()
    prs.slide_width = SLIDE_WIDTH
    prs.slide_height = SLIDE_HEIGHT

for slide_spec in SLIDE_PLAN.get('slides', []):
    layout = slide_spec.get('layout', 'title-content')
    fn = LAYOUT_MAP.get(layout, add_title_content_slide)
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

                # Fix 1: sldSz type="screen4x3" with widescreen dims → remove type attr
                if 'presentation.xml' in item.filename:
                    text = re.sub(r'(<p:sldSz[^/]*?) type="[^"]*"', r'\\1', text)

                # Fix 2: self-closing <c:scaling/> → add orientation child
                if '/charts/' in item.filename:
                    text = text.replace(
                        '<c:scaling/>',
                        '<c:scaling><c:orientation val="minMax"/></c:scaling>'
                    )
                    # Also fix <c:scaling></c:scaling> without orientation
                    text = re.sub(
                        r'<c:scaling>\s*</c:scaling>',
                        '<c:scaling><c:orientation val="minMax"/></c:scaling>',
                        text
                    )

                data = text.encode('utf-8')
            zout.writestr(item, data)
    shutil.move(tmp_path, filepath)

fix_pptx('/tmp/output.pptx')
print('SUCCESS: ' + str(len(SLIDE_PLAN.get('slides', []))) + ' slides generated')
`

/**
 * Python script to analyze an existing .pptx template's structure.
 */
const ANALYZE_TEMPLATE_SCRIPT = `
import json
from pptx import Presentation

prs = Presentation('/tmp/template.pptx')
structure = []
for i, slide in enumerate(prs.slides):
    slide_info = {'index': i, 'title': '', 'placeholders': []}
    for shape in slide.shapes:
        if shape.has_text_frame:
            text = shape.text_frame.text[:200].strip()
            slide_info['placeholders'].append({
                'name': shape.name,
                'text': text,
                'type': 'text'
            })
            # First text shape with content is likely the title
            if text and not slide_info['title']:
                slide_info['title'] = text
        if shape.has_table:
            slide_info['placeholders'].append({
                'name': shape.name,
                'type': 'table',
                'rows': len(shape.table.rows),
                'cols': len(shape.table.columns)
            })
        if shape.has_chart:
            slide_info['placeholders'].append({
                'name': shape.name,
                'type': 'chart'
            })
    structure.append(slide_info)

print(json.dumps(structure))
`

/**
 * Python script to fill an existing template with new content.
 * The fill plan JSON is injected.
 */
const FILL_TEMPLATE_SCRIPT = `
import json
from pptx import Presentation
from pptx.util import Pt
from pptx.dml.color import RGBColor

FILL_PLAN = json.load(open('/tmp/fill_plan.json'))
CLIENT_CONFIG = json.load(open('/tmp/client_config.json'))

prs = Presentation('/tmp/template.pptx')

def hex_to_rgb(h):
    h = h.lstrip('#')
    return RGBColor(int(h[0:2],16), int(h[2:4],16), int(h[4:6],16))

for slide_fill in FILL_PLAN.get('slides', []):
    idx = slide_fill['index']
    if idx >= len(prs.slides):
        continue
    slide = prs.slides[idx]

    # Build a name → shape lookup
    shape_map = {}
    for shape in slide.shapes:
        shape_map[shape.name] = shape

    # Fill text placeholders
    for fill in slide_fill.get('fills', []):
        name = fill['placeholderName']
        shape = shape_map.get(name)
        if shape and shape.has_text_frame:
            # Preserve first paragraph's formatting
            if shape.text_frame.paragraphs:
                p = shape.text_frame.paragraphs[0]
                old_font_size = p.font.size
                old_bold = p.font.bold
                old_color = p.font.color.rgb if p.font.color and p.font.color.rgb else None
                p.text = fill['newContent']
                if old_font_size:
                    p.font.size = old_font_size
                if old_bold is not None:
                    p.font.bold = old_bold
                if old_color:
                    p.font.color.rgb = old_color
            else:
                shape.text_frame.text = fill['newContent']

    # Fill tables
    for table_fill in slide_fill.get('tableFills', []):
        name = table_fill['placeholderName']
        shape = shape_map.get(name)
        if shape and shape.has_table:
            table = shape.table
            headers = table_fill.get('headers', [])
            rows = table_fill.get('rows', [])

            # Fill header row if provided
            if headers:
                for c, h in enumerate(headers):
                    if c < len(table.columns) and 0 < len(table.rows):
                        table.cell(0, c).text = h

            # Fill data rows
            for r, row in enumerate(rows):
                row_idx = r + (1 if headers else 0)
                if row_idx >= len(table.rows):
                    break
                for c, val in enumerate(row):
                    if c < len(table.columns):
                        table.cell(row_idx, c).text = str(val)

prs.save('/tmp/output.pptx')
print('SUCCESS: template filled')
`

// ── Public API ─────────────────────────────────────────────────────────

function buildClientConfigJson(config: ClientConfig): string {
  return JSON.stringify({
    companyName: config.name,
    shortName: config.shortName,
    monogram: config.logo.monogram,
    primaryColor: config.colors.primary,
    primaryDark: config.colors.primaryDark,
    accentColor: config.colors.accent,
    chartColors: config.aiContext.chartColorsCSS,
  })
}

export async function renderDeck(
  plan: SlidePlan,
  config: ClientConfig,
  templateBase64?: string
): Promise<Buffer> {
  const isTemplate = !!templateBase64

  const script = RENDER_SCRIPT
    .replace('__TEMPLATE_MODE__', isTemplate ? 'True' : 'False')

  const sandbox = await Sandbox.create({
    apiKey: process.env.E2B_API_KEY,
  })

  try {
    // Install python-pptx
    const installResult = await sandbox.runCode(
      'import subprocess; subprocess.check_call(["pip", "install", "-q", "python-pptx"])'
    )
    if (installResult.error) {
      throw new Error(`pip install failed: ${installResult.error.value}`)
    }

    // Write JSON data as files (avoids quote escaping issues)
    await sandbox.files.write('/tmp/slide_plan.json', JSON.stringify(plan))
    await sandbox.files.write('/tmp/client_config.json', buildClientConfigJson(config))

    // Write template if provided
    if (templateBase64) {
      const templateBuf = Buffer.from(templateBase64, 'base64')
      await sandbox.files.write('/tmp/template.pptx', templateBuf.buffer.slice(templateBuf.byteOffset, templateBuf.byteOffset + templateBuf.byteLength) as ArrayBuffer)
    }

    // Execute the rendering script
    const result = await sandbox.runCode(script)

    const stdout = result.logs.stdout.join('\n')
    const stderr = result.logs.stderr.join('\n')

    if (result.error) {
      throw new Error(
        `Python error: ${result.error.name}: ${result.error.value}\n${result.error.traceback}\nstdout: ${stdout}\nstderr: ${stderr}`
      )
    }

    // Read back the generated PPTX as binary
    const pptxBytes = await sandbox.files.read('/tmp/output.pptx', { format: 'bytes' })
    if (!pptxBytes || pptxBytes.length === 0) {
      throw new Error('No output.pptx generated')
    }

    return Buffer.from(pptxBytes)
  } finally {
    await sandbox.kill()
  }
}

export async function analyzeTemplate(
  templateBase64: string
): Promise<TemplateSlideInfo[]> {
  const sandbox = await Sandbox.create({
    apiKey: process.env.E2B_API_KEY,
  })

  try {
    await sandbox.runCode(
      'import subprocess; subprocess.check_call(["pip", "install", "-q", "python-pptx"])'
    )
    const templateBuf = Buffer.from(templateBase64, 'base64')
      await sandbox.files.write('/tmp/template.pptx', templateBuf.buffer.slice(templateBuf.byteOffset, templateBuf.byteOffset + templateBuf.byteLength) as ArrayBuffer)

    const result = await sandbox.runCode(ANALYZE_TEMPLATE_SCRIPT)

    if (result.error) {
      throw new Error(`Template analysis error: ${result.error.value}`)
    }

    const stdout = result.logs.stdout.join('\n')
    return JSON.parse(stdout)
  } finally {
    await sandbox.kill()
  }
}

export async function fillTemplate(
  fillPlan: TemplateFillPlan,
  config: ClientConfig,
  templateBase64: string
): Promise<Buffer> {
  const sandbox = await Sandbox.create({
    apiKey: process.env.E2B_API_KEY,
  })

  try {
    await sandbox.runCode(
      'import subprocess; subprocess.check_call(["pip", "install", "-q", "python-pptx"])'
    )

    // Write data files
    await sandbox.files.write('/tmp/fill_plan.json', JSON.stringify(fillPlan))
    await sandbox.files.write('/tmp/client_config.json', buildClientConfigJson(config))
    const templateBuf = Buffer.from(templateBase64, 'base64')
      await sandbox.files.write('/tmp/template.pptx', templateBuf.buffer.slice(templateBuf.byteOffset, templateBuf.byteOffset + templateBuf.byteLength) as ArrayBuffer)

    const result = await sandbox.runCode(FILL_TEMPLATE_SCRIPT)

    const stdout = result.logs.stdout.join('\n')
    const stderr = result.logs.stderr.join('\n')

    if (result.error) {
      throw new Error(
        `Python error: ${result.error.name}: ${result.error.value}\n${result.error.traceback}\nstdout: ${stdout}\nstderr: ${stderr}`
      )
    }

    const pptxBytes = await sandbox.files.read('/tmp/output.pptx', { format: 'bytes' })
    if (!pptxBytes || pptxBytes.length === 0) {
      throw new Error('No output.pptx generated')
    }

    return Buffer.from(pptxBytes)
  } finally {
    await sandbox.kill()
  }
}
