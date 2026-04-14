import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/Tabs'
import CompactMetricCard from '../components/CompactMetricCard'
import { TrendingUp, CheckCircle2, AlertCircle, Clock, Building2, TrendingDown } from 'lucide-react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Area, Cell } from 'recharts'

export default function BusinessEconomics() {
  // Business Segment Performance Data (Based on Northern Trust's two main segments)
  const segmentPerformance = [
    {
      segment: 'Corporate & Institutional Services',
      abbrev: 'C&IS',
      revenue: 3250,
      revenuePlan: 3180,
      revenueVar: 70,
      revenueVarPct: 2.2,
      opIncome: 982,
      opIncomePlan: 945,
      opIncomeVar: 37,
      opIncomeVarPct: 3.9,
      roe: 18.5,
      roePlan: 17.8,
      roeVar: 0.7,
      sva: 285,
      svaPlan: 265,
      svaVar: 20,
      assets: 5850,
      equity: 5300,
      efficiency: 69.8,
      efficiencyPlan: 70.3,
      clients: 168,
      clientsPlan: 165
    },
    {
      segment: 'Wealth Management',
      abbrev: 'WM',
      revenue: 2140,
      revenuePlan: 2095,
      revenueVar: 45,
      revenueVarPct: 2.1,
      opIncome: 628,
      opIncomePlan: 605,
      opIncomeVar: 23,
      opIncomeVarPct: 3.8,
      roe: 16.2,
      roePlan: 15.8,
      roeVar: 0.4,
      sva: 182,
      svaPlan: 168,
      svaVar: 14,
      assets: 3950,
      equity: 3870,
      efficiency: 70.6,
      efficiencyPlan: 71.1,
      clients: 117,
      clientsPlan: 115
    }
  ]

  // Monthly Trend Data by Segment
  const monthlyTrends = [
    { month: 'Jan', cis: 265, wm: 172, cisPlan: 260, wmPlan: 168 },
    { month: 'Feb', cis: 268, wm: 175, cisPlan: 262, wmPlan: 170 },
    { month: 'Mar', cis: 272, wm: 178, cisPlan: 265, wmPlan: 172 },
    { month: 'Apr', cis: 270, wm: 176, cisPlan: 266, wmPlan: 173 },
    { month: 'May', cis: 275, wm: 180, cisPlan: 268, wmPlan: 175 },
    { month: 'Jun', cis: 278, wm: 182, cisPlan: 270, wmPlan: 176 },
    { month: 'Jul', cis: 271, wm: 177, cisPlan: 267, wmPlan: 174 },
    { month: 'Aug', cis: 276, wm: 181, cisPlan: 269, wmPlan: 175 },
    { month: 'Sep', cis: 280, wm: 184, cisPlan: 271, wmPlan: 176 },
    { month: 'Oct', cis: 273, wm: 179, cisPlan: 268, wmPlan: 174 },
    { month: 'Nov', cis: 277, wm: 181, cisPlan: 270, wmPlan: 175 },
    { month: 'Dec', cis: 282, wm: 185, cisPlan: 272, wmPlan: 177 },
  ]

  // ROE Trends by Segment
  const roeTrends = [
    { quarter: 'Q1 23', cis: 17.2, wm: 15.1, target: 17.0 },
    { quarter: 'Q2 23', cis: 17.5, wm: 15.4, target: 17.2 },
    { quarter: 'Q3 23', cis: 17.8, wm: 15.7, target: 17.4 },
    { quarter: 'Q4 23', cis: 18.1, wm: 15.9, target: 17.6 },
    { quarter: 'Q1 24', cis: 18.5, wm: 16.2, target: 17.8 },
  ]

  // SVA (Shareholder Value Added) Trends
  const svaTrends = [
    { quarter: 'Q1 23', cis: 245, wm: 158, hurdle: 220 },
    { quarter: 'Q2 23', cis: 255, wm: 165, hurdle: 228 },
    { quarter: 'Q3 23', cis: 268, wm: 172, hurdle: 235 },
    { quarter: 'Q4 23', cis: 275, wm: 178, hurdle: 242 },
    { quarter: 'Q1 24', cis: 285, wm: 182, hurdle: 250 },
  ]

  // Product Line Detail for C&IS
  const cisProducts = [
    { product: 'Asset Servicing', revenue: 1850, revenuePlan: 1820, margin: 32.5, marginPlan: 31.8, growth: 8.5 },
    { product: 'Asset Management', revenue: 685, revenuePlan: 670, margin: 28.2, marginPlan: 28.5, growth: 6.2 },
    { product: 'Treasury Services', revenue: 420, revenuePlan: 410, margin: 25.8, marginPlan: 26.2, growth: 4.8 },
    { product: 'Investment Management', revenue: 295, revenuePlan: 280, margin: 22.1, marginPlan: 21.5, growth: 12.5 },
  ]

  // Product Line Detail for Wealth Management
  const wmProducts = [
    { product: 'Private Banking', revenue: 985, revenuePlan: 965, margin: 35.2, marginPlan: 34.8, growth: 7.2 },
    { product: 'Investment Advisory', revenue: 625, revenuePlan: 610, margin: 31.5, marginPlan: 31.2, growth: 6.8 },
    { product: 'Trust & Estate', revenue: 385, revenuePlan: 375, margin: 28.8, marginPlan: 28.5, growth: 5.5 },
    { product: 'Family Office', revenue: 145, revenuePlan: 145, margin: 26.5, marginPlan: 27.0, growth: 3.2 },
  ]

  // Variance Analysis
  const keyVariances = [
    {
      item: 'C&IS Revenue Beat',
      variance: 70,
      driver: 'Higher AUM-based fees (+$45M) and new client wins (+$25M)',
      status: 'positive',
      impact: 'Raises full-year revenue guidance by $180M'
    },
    {
      item: 'WM Revenue Beat',
      variance: 45,
      driver: 'Market performance (+$28M) and net new assets (+$17M)',
      status: 'positive',
      impact: 'On track to exceed annual plan by 2.5%'
    },
    {
      item: 'C&IS Efficiency',
      variance: -0.5,
      driver: 'Automation savings and scale benefits',
      status: 'positive',
      impact: 'Best-in-class vs peer efficiency ratios'
    },
    {
      item: 'WM Efficiency',
      variance: -0.5,
      driver: 'Technology investment and operational leverage',
      status: 'positive',
      impact: 'Margin expansion opportunity in H2'
    },
  ]

  const getStatusColor = (status: string) => {
    return status === 'positive' ? '#10b981' : status === 'negative' ? '#ef4444' : '#f59e0b'
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-nt-forest">Business Economics</h1>
          <p className="text-xs mt-1 text-gray-600">
            Business segment performance, SVA analysis, ROE by segment, and variance to plan
          </p>
        </div>
        <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg shadow-md" style={{
          background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.12) 0%, rgba(212, 175, 55, 0.04) 100%)',
          border: '1px solid rgba(212, 175, 55, 0.25)'
        }}>
          <Building2 className="h-5 w-5 text-nt-gold" />
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wide text-gray-600">Total SVA</div>
            <div className="flex items-baseline gap-1.5">
              <div className="text-lg font-bold text-nt-gold">$467M</div>
              <div className="text-[10px] font-semibold text-green-600">+7.8%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="executive-summary">
        <div className="flex items-center gap-2.5 mb-3.5">
          <div className="p-1.5 rounded-lg bg-nt-gold bg-opacity-20">
            <TrendingUp className="h-5 w-5 text-nt-gold" />
          </div>
          <h2 className="text-base font-bold text-nt-forest">Executive Summary</h2>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="summary-card">
            <div className="flex items-center gap-1.5 mb-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span className="font-semibold text-xs text-nt-forest">Strong Performance</span>
            </div>
            <ul className="space-y-0.5 text-xs text-gray-600 leading-tight">
              <li>• Both segments beating plan (C&IS +2.2%, WM +2.1%)</li>
              <li>• Combined SVA $467M vs $433M plan (+7.8%)</li>
              <li>• C&IS ROE 18.5% (70bps above plan)</li>
              <li>• WM ROE 16.2% (40bps above plan)</li>
            </ul>
          </div>

          <div className="summary-card">
            <div className="flex items-center gap-1.5 mb-2">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <span className="font-semibold text-xs text-nt-forest">Areas of Focus</span>
            </div>
            <ul className="space-y-0.5 text-xs text-gray-600 leading-tight">
              <li>• WM efficiency gap vs best-in-class (70.6% vs 68%)</li>
              <li>• Investment Management margins below target</li>
              <li>• Client acquisition pace slower in WM segment</li>
              <li>• Cross-segment collaboration opportunities untapped</li>
            </ul>
          </div>

          <div className="summary-card">
            <div className="flex items-center gap-1.5 mb-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="font-semibold text-xs text-nt-forest">Strategic Actions</span>
            </div>
            <ul className="space-y-0.5 text-xs text-gray-600 leading-tight">
              <li>• Accelerate WM efficiency initiatives (target: -200bps)</li>
              <li>• Expand C&IS asset servicing platform ($180M upside)</li>
              <li>• Cross-sell WM services to C&IS clients ($85M opportunity)</li>
              <li>• Review Investment Mgmt business model (margin improvement)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-6 gap-3">
        <CompactMetricCard label="C&IS Revenue" value="$3,250" unit="M" change={2.2} status="good" target="$3,180M" />
        <CompactMetricCard label="WM Revenue" value="$2,140" unit="M" change={2.1} status="good" target="$2,095M" />
        <CompactMetricCard label="C&IS ROE" value="18.5" unit="%" change={3.9} status="good" target="17.8%" />
        <CompactMetricCard label="WM ROE" value="16.2" unit="%" change={2.5} status="good" target="15.8%" />
        <CompactMetricCard label="C&IS SVA" value="$285" unit="M" change={7.5} status="good" target="$265M" />
        <CompactMetricCard label="WM SVA" value="$182" unit="M" change={8.3} status="good" target="$168M" />
      </div>

      <Tabs defaultValue="segment-pl">
        <TabsList>
          <TabsTrigger value="segment-pl">Segment P&L</TabsTrigger>
          <TabsTrigger value="roe-sva">ROE & SVA Analysis</TabsTrigger>
          <TabsTrigger value="variance">Variance Analysis</TabsTrigger>
          <TabsTrigger value="products">Product Line Detail</TabsTrigger>
        </TabsList>

        {/* Segment P&L Tab */}
        <TabsContent value="segment-pl">
          <div className="space-y-6">
            {/* Segment Comparison Table */}
            <div className="rounded-2xl p-6 shadow-lg" style={{
              background: 'linear-gradient(135deg, #ffffff 0%, rgba(248, 249, 250, 0.5) 100%)',
              border: '1px solid rgba(0, 77, 53, 0.08)'
            }}>
              <h3 className="text-lg font-bold mb-4" style={{ color: '#006747' }}>Business Segment Performance vs. Plan</h3>
              <table className="min-w-full text-xs">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-bold text-gray-700">Segment</th>
                    <th className="px-4 py-3 text-right font-bold text-gray-700">Revenue</th>
                    <th className="px-4 py-3 text-right font-bold text-gray-700">Plan</th>
                    <th className="px-4 py-3 text-right font-bold text-gray-700">Var $</th>
                    <th className="px-4 py-3 text-right font-bold text-gray-700">Var %</th>
                    <th className="px-4 py-3 text-right font-bold text-gray-700">Op Income</th>
                    <th className="px-4 py-3 text-right font-bold text-gray-700">Plan</th>
                    <th className="px-4 py-3 text-right font-bold text-gray-700">Var $</th>
                    <th className="px-4 py-3 text-right font-bold text-gray-700">ROE</th>
                    <th className="px-4 py-3 text-right font-bold text-gray-700">Efficiency</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {segmentPerformance.map((seg, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-semibold text-nt-forest">{seg.segment}</td>
                      <td className="px-4 py-3 text-right font-bold text-gray-900">${seg.revenue}M</td>
                      <td className="px-4 py-3 text-right text-gray-600">${seg.revenuePlan}M</td>
                      <td className="px-4 py-3 text-right font-semibold text-green-600">+${seg.revenueVar}M</td>
                      <td className="px-4 py-3 text-right font-semibold text-green-600">+{seg.revenueVarPct}%</td>
                      <td className="px-4 py-3 text-right font-bold text-gray-900">${seg.opIncome}M</td>
                      <td className="px-4 py-3 text-right text-gray-600">${seg.opIncomePlan}M</td>
                      <td className="px-4 py-3 text-right font-semibold text-green-600">+${seg.opIncomeVar}M</td>
                      <td className="px-4 py-3 text-right font-bold text-nt-gold">{seg.roe}%</td>
                      <td className="px-4 py-3 text-right text-gray-900">{seg.efficiency}%</td>
                    </tr>
                  ))}
                  <tr className="bg-gray-100 font-bold">
                    <td className="px-4 py-3 text-nt-forest">Total / Consolidated</td>
                    <td className="px-4 py-3 text-right text-gray-900">$5,390M</td>
                    <td className="px-4 py-3 text-right text-gray-600">$5,275M</td>
                    <td className="px-4 py-3 text-right text-green-600">+$115M</td>
                    <td className="px-4 py-3 text-right text-green-600">+2.2%</td>
                    <td className="px-4 py-3 text-right text-gray-900">$1,610M</td>
                    <td className="px-4 py-3 text-right text-gray-600">$1,550M</td>
                    <td className="px-4 py-3 text-right text-green-600">+$60M</td>
                    <td className="px-4 py-3 text-right text-nt-gold">17.5%</td>
                    <td className="px-4 py-3 text-right text-gray-900">70.1%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Revenue Trends by Segment */}
            <div className="rounded-2xl p-6 shadow-lg" style={{
              background: 'linear-gradient(135deg, #ffffff 0%, rgba(248, 249, 250, 0.5) 100%)',
              border: '1px solid rgba(0, 77, 53, 0.08)'
            }}>
              <h3 className="text-lg font-bold mb-4" style={{ color: '#006747' }}>Monthly Revenue Trends: Actual vs. Plan</h3>
              <ResponsiveContainer width="100%" height={320}>
                <ComposedChart data={monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} label={{ value: 'Revenue ($M)', angle: -90, position: 'insideLeft', style: { fontSize: 11 } }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="cis" fill="#3b82f6" name="C&IS Actual" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="wm" fill="#10b981" name="WM Actual" radius={[4, 4, 0, 0]} />
                  <Line type="monotone" dataKey="cisPlan" stroke="#1e40af" strokeWidth={2} strokeDasharray="5 5" name="C&IS Plan" dot={false} />
                  <Line type="monotone" dataKey="wmPlan" stroke="#059669" strokeWidth={2} strokeDasharray="5 5" name="WM Plan" dot={false} />
                </ComposedChart>
              </ResponsiveContainer>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-blue-50">
                  <div className="text-xs font-semibold text-blue-900 mb-1">C&IS Performance</div>
                  <div className="text-xs text-blue-800">Consistently beating plan by 2-3% monthly. Strong momentum in Asset Servicing and new client onboarding.</div>
                </div>
                <div className="p-3 rounded-lg bg-green-50">
                  <div className="text-xs font-semibold text-green-900 mb-1">WM Performance</div>
                  <div className="text-xs text-green-800">Exceeding plan driven by market performance and net new assets. Q4 seasonal strength visible.</div>
                </div>
              </div>
            </div>

            {/* Segment Mix */}
            <div className="grid grid-cols-2 gap-6">
              <div className="rounded-2xl p-6 shadow-lg" style={{
                background: 'linear-gradient(135deg, #ffffff 0%, rgba(248, 249, 250, 0.5) 100%)',
                border: '1px solid rgba(0, 77, 53, 0.08)'
              }}>
                <h3 className="text-base font-bold mb-4" style={{ color: '#006747' }}>Revenue Mix</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-gray-700">Corporate & Institutional Services</span>
                      <span className="font-bold text-gray-900">60.3%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-blue-600 h-3 rounded-full" style={{ width: '60.3%' }} />
                    </div>
                    <div className="text-xs text-gray-600 mt-1">$3,250M • +2.2% vs plan</div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-gray-700">Wealth Management</span>
                      <span className="font-bold text-gray-900">39.7%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-green-600 h-3 rounded-full" style={{ width: '39.7%' }} />
                    </div>
                    <div className="text-xs text-gray-600 mt-1">$2,140M • +2.1% vs plan</div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl p-6 shadow-lg" style={{
                background: 'linear-gradient(135deg, #ffffff 0%, rgba(248, 249, 250, 0.5) 100%)',
                border: '1px solid rgba(0, 77, 53, 0.08)'
              }}>
                <h3 className="text-base font-bold mb-4" style={{ color: '#006747' }}>Operating Income Mix</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-gray-700">Corporate & Institutional Services</span>
                      <span className="font-bold text-gray-900">61.0%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-blue-600 h-3 rounded-full" style={{ width: '61.0%' }} />
                    </div>
                    <div className="text-xs text-gray-600 mt-1">$982M • +3.9% vs plan</div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-gray-700">Wealth Management</span>
                      <span className="font-bold text-gray-900">39.0%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-green-600 h-3 rounded-full" style={{ width: '39.0%' }} />
                    </div>
                    <div className="text-xs text-gray-600 mt-1">$628M • +3.8% vs plan</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ROE & SVA Analysis Tab */}
        <TabsContent value="roe-sva">
          <div className="space-y-6">
            {/* ROE Trends */}
            <div className="rounded-2xl p-6 shadow-lg" style={{
              background: 'linear-gradient(135deg, #ffffff 0%, rgba(248, 249, 250, 0.5) 100%)',
              border: '1px solid rgba(0, 77, 53, 0.08)'
            }}>
              <h3 className="text-lg font-bold mb-4" style={{ color: '#006747' }}>Return on Equity (ROE) by Segment</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={roeTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="quarter" tick={{ fontSize: 11 }} />
                  <YAxis domain={[14, 20]} tick={{ fontSize: 11 }} label={{ value: 'ROE (%)', angle: -90, position: 'insideLeft', style: { fontSize: 11 } }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="cis" stroke="#3b82f6" strokeWidth={3} name="C&IS ROE" dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="wm" stroke="#10b981" strokeWidth={3} name="WM ROE" dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="target" stroke="#D4AF37" strokeWidth={2} strokeDasharray="5 5" name="Target ROE" dot={false} />
                </LineChart>
              </ResponsiveContainer>
              <div className="mt-4 grid grid-cols-3 gap-4 text-xs">
                <div className="p-3 rounded-lg bg-blue-50">
                  <div className="font-bold text-blue-900 mb-1">C&IS ROE: 18.5%</div>
                  <div className="text-blue-800">70bps above plan (17.8%). Industry-leading performance driven by scale and efficiency.</div>
                </div>
                <div className="p-3 rounded-lg bg-green-50">
                  <div className="font-bold text-green-900 mb-1">WM ROE: 16.2%</div>
                  <div className="text-green-800">40bps above plan (15.8%). Strong margin performance and capital efficiency.</div>
                </div>
                <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(212, 175, 55, 0.1)' }}>
                  <div className="font-bold mb-1" style={{ color: '#D4AF37' }}>Target: 17.8%</div>
                  <div style={{ color: '#6b7280' }}>Both segments exceeding hurdle rates. C&IS significantly outperforming.</div>
                </div>
              </div>
            </div>

            {/* SVA Analysis */}
            <div className="rounded-2xl p-6 shadow-lg" style={{
              background: 'linear-gradient(135deg, #ffffff 0%, rgba(248, 249, 250, 0.5) 100%)',
              border: '1px solid rgba(0, 77, 53, 0.08)'
            }}>
              <h3 className="text-lg font-bold mb-4" style={{ color: '#006747' }}>Shareholder Value Added (SVA) by Segment</h3>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={svaTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="quarter" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} label={{ value: 'SVA ($M)', angle: -90, position: 'insideLeft', style: { fontSize: 11 } }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="cis" fill="#3b82f6" name="C&IS SVA" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="wm" fill="#10b981" name="WM SVA" radius={[4, 4, 0, 0]} />
                  <Line type="monotone" dataKey="hurdle" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" name="Hurdle (Cost of Capital)" dot={false} />
                </ComposedChart>
              </ResponsiveContainer>
              <div className="mt-4 p-4 rounded-lg" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
                <div className="text-sm font-bold text-green-900 mb-2">Strong Value Creation</div>
                <div className="grid grid-cols-3 gap-4 text-xs text-green-800">
                  <div>
                    <div className="font-semibold">C&IS SVA: $285M</div>
                    <div>+$20M vs plan (+7.5%)</div>
                    <div className="mt-1">Economic profit above cost of capital driven by RAROC expansion</div>
                  </div>
                  <div>
                    <div className="font-semibold">WM SVA: $182M</div>
                    <div>+$14M vs plan (+8.3%)</div>
                    <div className="mt-1">Margin improvement and efficiency gains driving outperformance</div>
                  </div>
                  <div>
                    <div className="font-semibold">Total SVA: $467M</div>
                    <div>+$34M vs plan (+7.8%)</div>
                    <div className="mt-1">Both segments well above hurdle rates, creating significant shareholder value</div>
                  </div>
                </div>
              </div>
            </div>

            {/* ROE vs SVA Matrix */}
            <div className="rounded-2xl p-6 shadow-lg" style={{
              background: 'linear-gradient(135deg, #ffffff 0%, rgba(248, 249, 250, 0.5) 100%)',
              border: '1px solid rgba(0, 77, 53, 0.08)'
            }}>
              <h3 className="text-lg font-bold mb-4" style={{ color: '#006747' }}>Segment Performance Matrix</h3>
              <div className="grid grid-cols-2 gap-6">
                {segmentPerformance.map((seg, idx) => (
                  <div key={idx} className="p-5 rounded-xl bg-white border-2 border-green-200">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-base font-bold" style={{ color: '#006747' }}>{seg.segment}</h4>
                      <div className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                        Outperforming
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs text-gray-600 mb-1">Return on Equity</div>
                        <div className="text-2xl font-bold text-nt-gold">{seg.roe}%</div>
                        <div className="text-xs text-green-600 font-semibold">+{seg.roeVar}pp vs plan</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600 mb-1">Shareholder Value Added</div>
                        <div className="text-2xl font-bold text-nt-gold">${seg.sva}M</div>
                        <div className="text-xs text-green-600 font-semibold">+${seg.svaVar}M vs plan</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600 mb-1">Revenue</div>
                        <div className="text-lg font-bold text-gray-900">${seg.revenue}M</div>
                        <div className="text-xs text-green-600 font-semibold">+{seg.revenueVarPct}% vs plan</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600 mb-1">Efficiency Ratio</div>
                        <div className="text-lg font-bold text-gray-900">{seg.efficiency}%</div>
                        <div className="text-xs text-green-600 font-semibold">{seg.efficiencyPlan - seg.efficiency > 0 ? '-' : '+'}{Math.abs(seg.efficiencyPlan - seg.efficiency).toFixed(1)}pp vs plan</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Variance Analysis Tab */}
        <TabsContent value="variance">
          <div className="space-y-6">
            {/* Key Variances */}
            <div className="rounded-2xl p-6 shadow-lg" style={{
              background: 'linear-gradient(135deg, #ffffff 0%, rgba(248, 249, 250, 0.5) 100%)',
              border: '1px solid rgba(0, 77, 53, 0.08)'
            }}>
              <h3 className="text-lg font-bold mb-4" style={{ color: '#006747' }}>Key Variance Drivers vs. Plan</h3>
              <div className="space-y-3">
                {keyVariances.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-white border-l-4" style={{
                    borderLeftColor: getStatusColor(item.status)
                  }}>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-bold text-sm text-gray-900">{item.item}</div>
                        <div className="text-xs text-gray-600 mt-1">{item.driver}</div>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${item.status === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                          {item.variance > 0 ? '+' : ''}{item.variance}{typeof item.variance === 'number' && item.variance > 10 ? 'M' : 'pp'}
                        </div>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-gray-100">
                      <div className="text-xs font-medium text-gray-700">Impact: {item.impact}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Detailed Variance Waterfall */}
            <div className="rounded-2xl p-6 shadow-lg" style={{
              background: 'linear-gradient(135deg, #ffffff 0%, rgba(248, 249, 250, 0.5) 100%)',
              border: '1px solid rgba(0, 77, 53, 0.08)'
            }}>
              <h3 className="text-lg font-bold mb-4" style={{ color: '#006747' }}>Revenue Variance Bridge: Plan to Actual</h3>
              <div className="grid grid-cols-2 gap-6">
                {/* C&IS Variance Bridge */}
                <div>
                  <h4 className="text-sm font-semibold mb-3 text-blue-900">Corporate & Institutional Services</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between p-2 bg-gray-50 rounded">
                      <span className="font-semibold">Plan Revenue</span>
                      <span className="font-bold">$3,180M</span>
                    </div>
                    <div className="flex justify-between p-2 bg-green-50 rounded">
                      <span>AUM-based fees (market performance)</span>
                      <span className="font-semibold text-green-600">+$45M</span>
                    </div>
                    <div className="flex justify-between p-2 bg-green-50 rounded">
                      <span>New client wins (8 mandates)</span>
                      <span className="font-semibold text-green-600">+$25M</span>
                    </div>
                    <div className="flex justify-between p-2 bg-green-50 rounded">
                      <span>Fee optimization & repricing</span>
                      <span className="font-semibold text-green-600">+$12M</span>
                    </div>
                    <div className="flex justify-between p-2 bg-red-50 rounded">
                      <span>Client departures</span>
                      <span className="font-semibold text-red-600">-$8M</span>
                    </div>
                    <div className="flex justify-between p-2 bg-red-50 rounded">
                      <span>Fee compression / waivers</span>
                      <span className="font-semibold text-red-600">-$4M</span>
                    </div>
                    <div className="flex justify-between p-2 bg-blue-100 rounded">
                      <span className="font-bold">Actual Revenue</span>
                      <span className="font-bold text-blue-900">$3,250M</span>
                    </div>
                    <div className="flex justify-between p-2 bg-blue-50 rounded">
                      <span className="font-semibold">Total Variance</span>
                      <span className="font-bold text-green-600">+$70M (+2.2%)</span>
                    </div>
                  </div>
                </div>

                {/* WM Variance Bridge */}
                <div>
                  <h4 className="text-sm font-semibold mb-3 text-green-900">Wealth Management</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between p-2 bg-gray-50 rounded">
                      <span className="font-semibold">Plan Revenue</span>
                      <span className="font-bold">$2,095M</span>
                    </div>
                    <div className="flex justify-between p-2 bg-green-50 rounded">
                      <span>Market performance (AUM growth)</span>
                      <span className="font-semibold text-green-600">+$28M</span>
                    </div>
                    <div className="flex justify-between p-2 bg-green-50 rounded">
                      <span>Net new assets</span>
                      <span className="font-semibold text-green-600">+$17M</span>
                    </div>
                    <div className="flex justify-between p-2 bg-green-50 rounded">
                      <span>Trust & estate activity</span>
                      <span className="font-semibold text-green-600">+$8M</span>
                    </div>
                    <div className="flex justify-between p-2 bg-red-50 rounded">
                      <span>Client attrition</span>
                      <span className="font-semibold text-red-600">-$5M</span>
                    </div>
                    <div className="flex justify-between p-2 bg-red-50 rounded">
                      <span>Fee pressure / negotiations</span>
                      <span className="font-semibold text-red-600">-$3M</span>
                    </div>
                    <div className="flex justify-between p-2 bg-green-100 rounded">
                      <span className="font-bold">Actual Revenue</span>
                      <span className="font-bold text-green-900">$2,140M</span>
                    </div>
                    <div className="flex justify-between p-2 bg-green-50 rounded">
                      <span className="font-semibold">Total Variance</span>
                      <span className="font-bold text-green-600">+$45M (+2.1%)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Alerts */}
            <div className="rounded-2xl p-6 shadow-lg" style={{
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(245, 158, 11, 0.02) 100%)',
              border: '1px solid rgba(245, 158, 11, 0.25)'
            }}>
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="h-5 w-5 text-amber-600" />
                <h3 className="text-base font-bold text-amber-900">Items Requiring Management Attention</h3>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-lg bg-white">
                  <div className="font-semibold text-amber-900 mb-2">WM Efficiency Gap</div>
                  <div className="text-gray-700 mb-2">Current: 70.6% vs Best-in-class: 68% vs Plan: 71.1%</div>
                  <div className="text-amber-800">Action: Deploy technology platform upgrades by Q3. Target -200bps improvement by year-end.</div>
                </div>
                <div className="p-3 rounded-lg bg-white">
                  <div className="font-semibold text-amber-900 mb-2">Investment Management Margins</div>
                  <div className="text-gray-700 mb-2">Current margin: 22.1% vs target: 24.5%</div>
                  <div className="text-amber-800">Action: Strategic review of business model. Consider scale partnerships or fee structure changes.</div>
                </div>
                <div className="p-3 rounded-lg bg-white">
                  <div className="font-semibold text-amber-900 mb-2">Cross-Segment Collaboration</div>
                  <div className="text-gray-700 mb-2">Limited referrals between C&IS and WM segments</div>
                  <div className="text-amber-800">Action: Pilot program to cross-sell WM services to C&IS institutional clients. Potential $85M revenue opportunity.</div>
                </div>
                <div className="p-3 rounded-lg bg-white">
                  <div className="font-semibold text-amber-900 mb-2">Client Acquisition Pace</div>
                  <div className="text-gray-700 mb-2">WM new client acquisition 12% below target</div>
                  <div className="text-amber-800">Action: Accelerate advisor hiring and digital marketing campaigns. Monitor Q2 pipeline conversion closely.</div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Product Line Detail Tab */}
        <TabsContent value="products">
          <div className="space-y-6">
            {/* C&IS Product Lines */}
            <div className="rounded-2xl p-6 shadow-lg" style={{
              background: 'linear-gradient(135deg, #ffffff 0%, rgba(248, 249, 250, 0.5) 100%)',
              border: '1px solid rgba(0, 77, 53, 0.08)'
            }}>
              <h3 className="text-lg font-bold mb-4" style={{ color: '#006747' }}>Corporate & Institutional Services - Product Line Performance</h3>
              <table className="min-w-full text-xs">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-bold text-gray-700">Product Line</th>
                    <th className="px-4 py-3 text-right font-bold text-gray-700">Revenue</th>
                    <th className="px-4 py-3 text-right font-bold text-gray-700">Plan</th>
                    <th className="px-4 py-3 text-right font-bold text-gray-700">Variance</th>
                    <th className="px-4 py-3 text-right font-bold text-gray-700">Op Margin</th>
                    <th className="px-4 py-3 text-right font-bold text-gray-700">Margin Plan</th>
                    <th className="px-4 py-3 text-right font-bold text-gray-700">YoY Growth</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {cisProducts.map((prod, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-semibold text-gray-900">{prod.product}</td>
                      <td className="px-4 py-3 text-right font-bold text-gray-900">${prod.revenue}M</td>
                      <td className="px-4 py-3 text-right text-gray-600">${prod.revenuePlan}M</td>
                      <td className="px-4 py-3 text-right font-semibold text-green-600">+${prod.revenue - prod.revenuePlan}M</td>
                      <td className="px-4 py-3 text-right font-bold text-nt-gold">{prod.margin}%</td>
                      <td className="px-4 py-3 text-right text-gray-600">{prod.marginPlan}%</td>
                      <td className="px-4 py-3 text-right font-semibold text-green-600">+{prod.growth}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-4 grid grid-cols-3 gap-4 text-xs">
                <div className="p-3 rounded-lg bg-blue-50">
                  <div className="font-semibold text-blue-900 mb-1">Asset Servicing (57% of C&IS)</div>
                  <div className="text-blue-800">Largest product line. Strong margin expansion (+70bps vs plan) driven by scale and automation.</div>
                </div>
                <div className="p-3 rounded-lg bg-green-50">
                  <div className="font-semibold text-green-900 mb-1">Investment Management (9% of C&IS)</div>
                  <div className="text-green-800">Fastest growth (+12.5% YoY). Small base but high momentum. Margin improvement opportunity.</div>
                </div>
                <div className="p-3 rounded-lg bg-amber-50">
                  <div className="font-semibold text-amber-900 mb-1">Treasury Services (13% of C&IS)</div>
                  <div className="text-amber-800">Solid performance but margin compression (-40bps). NIM pressure affecting profitability.</div>
                </div>
              </div>
            </div>

            {/* WM Product Lines */}
            <div className="rounded-2xl p-6 shadow-lg" style={{
              background: 'linear-gradient(135deg, #ffffff 0%, rgba(248, 249, 250, 0.5) 100%)',
              border: '1px solid rgba(0, 77, 53, 0.08)'
            }}>
              <h3 className="text-lg font-bold mb-4" style={{ color: '#006747' }}>Wealth Management - Product Line Performance</h3>
              <table className="min-w-full text-xs">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-bold text-gray-700">Product Line</th>
                    <th className="px-4 py-3 text-right font-bold text-gray-700">Revenue</th>
                    <th className="px-4 py-3 text-right font-bold text-gray-700">Plan</th>
                    <th className="px-4 py-3 text-right font-bold text-gray-700">Variance</th>
                    <th className="px-4 py-3 text-right font-bold text-gray-700">Op Margin</th>
                    <th className="px-4 py-3 text-right font-bold text-gray-700">Margin Plan</th>
                    <th className="px-4 py-3 text-right font-bold text-gray-700">YoY Growth</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {wmProducts.map((prod, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-semibold text-gray-900">{prod.product}</td>
                      <td className="px-4 py-3 text-right font-bold text-gray-900">${prod.revenue}M</td>
                      <td className="px-4 py-3 text-right text-gray-600">${prod.revenuePlan}M</td>
                      <td className="px-4 py-3 text-right font-semibold text-green-600">+${prod.revenue - prod.revenuePlan}M</td>
                      <td className="px-4 py-3 text-right font-bold text-nt-gold">{prod.margin}%</td>
                      <td className="px-4 py-3 text-right text-gray-600">{prod.marginPlan}%</td>
                      <td className="px-4 py-3 text-right font-semibold text-green-600">+{prod.growth}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-4 grid grid-cols-3 gap-4 text-xs">
                <div className="p-3 rounded-lg bg-green-50">
                  <div className="font-semibold text-green-900 mb-1">Private Banking (46% of WM)</div>
                  <div className="text-green-800">Strongest margins (35.2%) and solid growth. Core high-net-worth franchise performing well.</div>
                </div>
                <div className="p-3 rounded-lg bg-blue-50">
                  <div className="font-semibold text-blue-900 mb-1">Investment Advisory (29% of WM)</div>
                  <div className="text-blue-800">Market-driven strength. AUM growth driving revenue beat. Fee capture opportunities remain.</div>
                </div>
                <div className="p-3 rounded-lg bg-amber-50">
                  <div className="font-semibold text-amber-900 mb-1">Family Office (7% of WM)</div>
                  <div className="text-amber-800">Smallest line but strategic. Margin below plan (-50bps). Scaling challenges but high potential.</div>
                </div>
              </div>
            </div>

            {/* Product Line Growth Comparison */}
            <div className="rounded-2xl p-6 shadow-lg" style={{
              background: 'linear-gradient(135deg, #ffffff 0%, rgba(248, 249, 250, 0.5) 100%)',
              border: '1px solid rgba(0, 77, 53, 0.08)'
            }}>
              <h3 className="text-lg font-bold mb-4" style={{ color: '#006747' }}>YoY Revenue Growth by Product Line</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={[...cisProducts, ...wmProducts].sort((a, b) => b.growth - a.growth)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="product" tick={{ fontSize: 10 }} angle={-15} textAnchor="end" height={80} />
                  <YAxis tick={{ fontSize: 11 }} label={{ value: 'YoY Growth (%)', angle: -90, position: 'insideLeft', style: { fontSize: 11 } }} />
                  <Tooltip />
                  <Bar dataKey="growth" name="YoY Growth %" radius={[8, 8, 0, 0]}>
                    {[...cisProducts, ...wmProducts].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.growth > 10 ? '#10b981' : entry.growth > 6 ? '#3b82f6' : '#f59e0b'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
