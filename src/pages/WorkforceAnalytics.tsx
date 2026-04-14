import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/Tabs'
import CompactMetricCard from '../components/CompactMetricCard'
import { TrendingUp, CheckCircle2, AlertCircle, Clock, Users, TrendingDown } from 'lucide-react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Area, AreaChart, Cell, PieChart, Pie } from 'recharts'

export default function WorkforceAnalytics() {
  // Headcount by Segment
  const headcountBySegment = [
    { segment: 'C&IS', fte: 6850, contractors: 425, total: 7275, mom: 45, yoy: 285 },
    { segment: 'WM', fte: 4280, contractors: 195, total: 4475, mom: 18, yoy: 165 },
    { segment: 'Corporate', fte: 980, contractors: 85, total: 1065, mom: -5, yoy: 25 },
  ]

  // Headcount Trends
  const headcountTrends = [
    { month: 'Jul', cis: 6720, wm: 4185, corporate: 965, contractors: 655 },
    { month: 'Aug', cis: 6755, wm: 4205, corporate: 972, contractors: 665 },
    { month: 'Sep', cis: 6790, wm: 4230, corporate: 978, contractors: 685 },
    { month: 'Oct', cis: 6805, wm: 4250, corporate: 982, contractors: 695 },
    { month: 'Nov', cis: 6825, wm: 4268, corporate: 985, contractors: 702 },
    { month: 'Dec', cis: 6840, wm: 4275, corporate: 980, contractors: 708 },
    { month: 'Jan', cis: 6850, wm: 4280, corporate: 980, contractors: 705 },
  ]

  // Compensation & Benefits
  const compBySegment = [
    {
      segment: 'C&IS',
      fte: 6850,
      totalComp: 1255,
      avgComp: 183,
      salaries: 820,
      bonus: 285,
      benefits: 150,
      compRevenue: 38.6
    },
    {
      segment: 'WM',
      fte: 4280,
      totalComp: 885,
      avgComp: 207,
      salaries: 575,
      bonus: 225,
      benefits: 85,
      compRevenue: 41.4
    },
    {
      segment: 'Corporate',
      fte: 980,
      totalComp: 227,
      avgComp: 232,
      salaries: 145,
      bonus: 58,
      benefits: 24,
      compRevenue: null
    },
  ]

  const compTrends = [
    { month: 'Jul', salaries: 1445, bonus: 498, benefits: 248, contractors: 82 },
    { month: 'Aug', salaries: 1458, bonus: 505, benefits: 250, contractors: 85 },
    { month: 'Sep', salaries: 1475, bonus: 515, benefits: 252, contractors: 88 },
    { month: 'Oct', salaries: 1485, bonus: 525, benefits: 254, contractors: 90 },
    { month: 'Nov', salaries: 1498, bonus: 538, benefits: 257, contractors: 92 },
    { month: 'Dec', salaries: 1510, bonus: 545, benefits: 258, contractors: 95 },
    { month: 'Jan', salaries: 1540, bonus: 568, benefits: 259, contractors: 88 },
  ]

  // Productivity Metrics
  const productivityBySegment = [
    {
      segment: 'C&IS',
      fte: 6850,
      revenue: 3250,
      revenuePerFTE: 474,
      costPerFTE: 256,
      profitPerFTE: 143,
      spanOfControl: 8.2
    },
    {
      segment: 'WM',
      fte: 4280,
      revenue: 2140,
      revenuePerFTE: 500,
      costPerFTE: 265,
      profitPerFTE: 147,
      spanOfControl: 6.8
    },
  ]

  // Attrition Analysis
  const attritionData = [
    { month: 'Jul', voluntary: 42, involuntary: 12, total: 54, rate: 4.8 },
    { month: 'Aug', voluntary: 38, involuntary: 8, total: 46, rate: 4.1 },
    { month: 'Sep', voluntary: 45, involuntary: 15, total: 60, rate: 5.3 },
    { month: 'Oct', voluntary: 35, involuntary: 10, total: 45, rate: 4.0 },
    { month: 'Nov', voluntary: 40, involuntary: 12, total: 52, rate: 4.6 },
    { month: 'Dec', voluntary: 48, involuntary: 14, total: 62, rate: 5.5 },
    { month: 'Jan', voluntary: 32, involuntary: 8, total: 40, rate: 3.5 },
  ]

  const attritionByReason = [
    { reason: 'Better opportunity', count: 125, percentage: 42.5 },
    { reason: 'Compensation', count: 68, percentage: 23.1 },
    { reason: 'Career growth', count: 52, percentage: 17.7 },
    { reason: 'Relocation', count: 28, percentage: 9.5 },
    { reason: 'Performance', count: 21, percentage: 7.1 },
  ]

  // Hiring Pipeline
  const hiringPipeline = [
    { stage: 'Open Positions', count: 285, target: 250 },
    { stage: 'In Process', count: 425, target: 400 },
    { stage: 'Offers Extended', count: 95, target: 80 },
    { stage: 'Offers Accepted', count: 68, target: 60 },
    { stage: 'Start Pending', count: 52, target: 45 },
  ]

  // Headcount by Department
  const headcountByDept = [
    { dept: 'Operations', fte: 4250, contractors: 285, pctOfTotal: 35.8 },
    { dept: 'Technology', fte: 2850, contractors: 320, pctOfTotal: 24.0 },
    { dept: 'Sales & Relationship Mgmt', fte: 2180, contractors: 45, pctOfTotal: 18.3 },
    { dept: 'Finance & Risk', fte: 1450, contractors: 55, pctOfTotal: 12.2 },
    { dept: 'Legal & Compliance', fte: 685, contractors: 0, pctOfTotal: 5.8 },
    { dept: 'HR & Admin', fte: 485, contractors: 0, pctOfTotal: 4.1 },
  ]

  // Headcount by Location
  const headcountByLocation = [
    { location: 'Chicago', fte: 3850, pctOfTotal: 32.4 },
    { location: 'London', fte: 2250, pctOfTotal: 18.9 },
    { location: 'APAC Hubs', fte: 1850, pctOfTotal: 15.6 },
    { location: 'Other US', fte: 1950, pctOfTotal: 16.4 },
    { location: 'India (Offshore)', fte: 1500, pctOfTotal: 12.6 },
    { location: 'EMEA (Other)', fte: 490, pctOfTotal: 4.1 },
  ]

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-nt-forest">Workforce Analytics</h1>
          <p className="text-xs mt-1 text-gray-600">
            Headcount, compensation, productivity metrics, attrition analysis, and workforce planning
          </p>
        </div>
        <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg shadow-md" style={{
          background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.12) 0%, rgba(212, 175, 55, 0.04) 100%)',
          border: '1px solid rgba(212, 175, 55, 0.25)'
        }}>
          <Users className="h-5 w-5 text-nt-gold" />
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wide text-gray-600">Total Workforce</div>
            <div className="flex items-baseline gap-1.5">
              <div className="text-lg font-bold text-nt-gold">12,815</div>
              <div className="text-[10px] font-semibold text-green-600">+58</div>
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
              <span className="font-semibold text-xs text-nt-forest">Workforce Overview</span>
            </div>
            <ul className="space-y-0.5 text-xs text-gray-600 leading-tight">
              <li>• Total headcount: 12,815 (12,110 FTE + 705 contractors)</li>
              <li>• Growing +58 MoM, +475 YoY (+3.9%)</li>
              <li>• Revenue per FTE: $485K (up 6.2% YoY)</li>
              <li>• Comp/Revenue ratio: 40.1% (within target 38-42%)</li>
            </ul>
          </div>

          <div className="summary-card">
            <div className="flex items-center gap-1.5 mb-2">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <span className="font-semibold text-xs text-nt-forest">Attrition & Hiring</span>
            </div>
            <ul className="space-y-0.5 text-xs text-gray-600 leading-tight">
              <li>• Voluntary attrition: 4.5% (40 exits/month avg)</li>
              <li>• Top reasons: Better opportunity (43%), comp (23%)</li>
              <li>• Hiring pipeline: 285 open positions, 68 accepted offers</li>
              <li>• Time to fill: 62 days avg (target: 45 days)</li>
            </ul>
          </div>

          <div className="summary-card">
            <div className="flex items-center gap-1.5 mb-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="font-semibold text-xs text-nt-forest">Strategic Actions</span>
            </div>
            <ul className="space-y-0.5 text-xs text-gray-600 leading-tight">
              <li>• Accelerate offshore hiring (target +200 FTE in India)</li>
              <li>• Compensation review for high-attrition roles</li>
              <li>• Reduce contractor spend 10% through FTE conversion</li>
              <li>• Improve span of control in WM (6.8 → 8.0 target)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-6 gap-3">
        <CompactMetricCard label="Total FTE" value="12,110" change={0.5} status="neutral" />
        <CompactMetricCard label="Contractors" value="705" change={-0.4} status="good" />
        <CompactMetricCard label="Revenue/FTE" value="$485" unit="K" change={6.2} status="good" />
        <CompactMetricCard label="Avg Comp" value="$197" unit="K" change={4.8} status="neutral" />
        <CompactMetricCard label="Attrition Rate" value="4.5" unit="%" change={0.2} status="warning" />
        <CompactMetricCard label="Open Positions" value="285" status="neutral" />
      </div>

      <Tabs defaultValue="headcount">
        <TabsList>
          <TabsTrigger value="headcount">Headcount Analytics</TabsTrigger>
          <TabsTrigger value="compensation">Compensation & Benefits</TabsTrigger>
          <TabsTrigger value="productivity">Productivity Metrics</TabsTrigger>
          <TabsTrigger value="attrition">Attrition & Retention</TabsTrigger>
        </TabsList>

        {/* Headcount Analytics Tab */}
        <TabsContent value="headcount">
          <div className="space-y-6">
            {/* Headcount Trends */}
            <div className="rounded-2xl p-6 shadow-lg" style={{
              background: 'linear-gradient(135deg, #ffffff 0%, rgba(248, 249, 250, 0.5) 100%)',
              border: '1px solid rgba(0, 77, 53, 0.08)'
            }}>
              <h3 className="text-lg font-bold mb-4" style={{ color: '#006747' }}>Headcount Trends by Segment (Last 7 Months)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={headcountTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} label={{ value: 'Headcount', angle: -90, position: 'insideLeft', style: { fontSize: 11 } }} />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="cis" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} name="C&IS" />
                  <Area type="monotone" dataKey="wm" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} name="WM" />
                  <Area type="monotone" dataKey="corporate" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} name="Corporate" />
                  <Line type="monotone" dataKey="contractors" stroke="#ef4444" strokeWidth={3} name="Contractors" dot={{ r: 3 }} />
                </AreaChart>
              </ResponsiveContainer>
              <div className="mt-4 grid grid-cols-3 gap-4 text-xs">
                <div className="p-3 rounded-lg bg-blue-50">
                  <div className="font-bold text-blue-900 mb-1">C&IS: 6,850 FTE (+45 MoM)</div>
                  <div className="text-blue-800">Hiring for new client onboarding and technology upgrades. 57% of total workforce.</div>
                </div>
                <div className="p-3 rounded-lg bg-green-50">
                  <div className="font-bold text-green-900 mb-1">WM: 4,280 FTE (+18 MoM)</div>
                  <div className="text-green-800">Steady growth in advisors and client service roles. 35% of total workforce.</div>
                </div>
                <div className="p-3 rounded-lg bg-amber-50">
                  <div className="font-bold text-amber-900 mb-1">Corporate: 980 FTE (flat)</div>
                  <div className="text-amber-800">Support functions stable. Focus on efficiency through technology.</div>
                </div>
              </div>
            </div>

            {/* Headcount by Segment Table */}
            <div className="rounded-2xl p-6 shadow-lg" style={{
              background: 'linear-gradient(135deg, #ffffff 0%, rgba(248, 249, 250, 0.5) 100%)',
              border: '1px solid rgba(0, 77, 53, 0.08)'
            }}>
              <h3 className="text-lg font-bold mb-4" style={{ color: '#006747' }}>Headcount by Business Segment</h3>
              <table className="min-w-full text-xs">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-bold text-gray-700">Segment</th>
                    <th className="px-4 py-3 text-right font-bold text-gray-700">FTE</th>
                    <th className="px-4 py-3 text-right font-bold text-gray-700">Contractors</th>
                    <th className="px-4 py-3 text-right font-bold text-gray-700">Total</th>
                    <th className="px-4 py-3 text-right font-bold text-gray-700">MoM Change</th>
                    <th className="px-4 py-3 text-right font-bold text-gray-700">YoY Change</th>
                    <th className="px-4 py-3 text-right font-bold text-gray-700">% of Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {headcountBySegment.map((seg, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-semibold text-gray-900">{seg.segment}</td>
                      <td className="px-4 py-3 text-right font-bold text-gray-900">{seg.fte.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right text-gray-700">{seg.contractors.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right font-bold text-gray-900">{seg.total.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right">
                        <span className={`font-semibold ${seg.mom > 0 ? 'text-green-600' : seg.mom < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                          {seg.mom > 0 ? '+' : ''}{seg.mom}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className={`font-semibold ${seg.yoy > 0 ? 'text-green-600' : 'text-gray-600'}`}>
                          {seg.yoy > 0 ? '+' : ''}{seg.yoy}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-gray-700">
                        {((seg.total / headcountBySegment.reduce((sum, s) => sum + s.total, 0)) * 100).toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Headcount by Department */}
            <div className="grid grid-cols-2 gap-6">
              <div className="rounded-2xl p-6 shadow-lg" style={{
                background: 'linear-gradient(135deg, #ffffff 0%, rgba(248, 249, 250, 0.5) 100%)',
                border: '1px solid rgba(0, 77, 53, 0.08)'
              }}>
                <h3 className="text-base font-bold mb-4" style={{ color: '#006747' }}>Headcount by Department</h3>
                <div className="space-y-3">
                  {headcountByDept.map((dept, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-white border border-gray-100">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-semibold text-gray-900">{dept.dept}</span>
                        <span className="text-sm font-bold text-gray-900">{dept.fte.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-blue-600"
                            style={{ width: `${dept.pctOfTotal}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-600 w-12 text-right">{dept.pctOfTotal.toFixed(1)}%</span>
                      </div>
                      {dept.contractors > 0 && (
                        <div className="text-xs text-gray-600 mt-1">+ {dept.contractors} contractors</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl p-6 shadow-lg" style={{
                background: 'linear-gradient(135deg, #ffffff 0%, rgba(248, 249, 250, 0.5) 100%)',
                border: '1px solid rgba(0, 77, 53, 0.08)'
              }}>
                <h3 className="text-base font-bold mb-4" style={{ color: '#006747' }}>Headcount by Location</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={headcountByLocation}
                      dataKey="fte"
                      nameKey="location"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      label={(entry) => `${entry.location}: ${entry.pctOfTotal.toFixed(1)}%`}
                      labelLine={true}
                    >
                      {headcountByLocation.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Compensation & Benefits Tab */}
        <TabsContent value="compensation">
          <div className="space-y-6">
            {/* Compensation by Segment */}
            <div className="rounded-2xl p-6 shadow-lg" style={{
              background: 'linear-gradient(135deg, #ffffff 0%, rgba(248, 249, 250, 0.5) 100%)',
              border: '1px solid rgba(0, 77, 53, 0.08)'
            }}>
              <h3 className="text-lg font-bold mb-4" style={{ color: '#006747' }}>Compensation & Benefits by Segment (YTD)</h3>
              <table className="min-w-full text-xs">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-bold text-gray-700">Segment</th>
                    <th className="px-4 py-3 text-right font-bold text-gray-700">FTE</th>
                    <th className="px-4 py-3 text-right font-bold text-gray-700">Total Comp</th>
                    <th className="px-4 py-3 text-right font-bold text-gray-700">Avg Comp/FTE</th>
                    <th className="px-4 py-3 text-right font-bold text-gray-700">Salaries</th>
                    <th className="px-4 py-3 text-right font-bold text-gray-700">Bonus/Incentive</th>
                    <th className="px-4 py-3 text-right font-bold text-gray-700">Benefits</th>
                    <th className="px-4 py-3 text-right font-bold text-gray-700">Comp/Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {compBySegment.map((seg, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-semibold text-gray-900">{seg.segment}</td>
                      <td className="px-4 py-3 text-right text-gray-900">{seg.fte.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right font-bold text-gray-900">${seg.totalComp}M</td>
                      <td className="px-4 py-3 text-right font-bold text-nt-gold">${seg.avgComp}K</td>
                      <td className="px-4 py-3 text-right text-gray-700">${seg.salaries}M</td>
                      <td className="px-4 py-3 text-right text-gray-700">${seg.bonus}M</td>
                      <td className="px-4 py-3 text-right text-gray-700">${seg.benefits}M</td>
                      <td className="px-4 py-3 text-right font-semibold text-gray-900">
                        {seg.compRevenue ? `${seg.compRevenue}%` : 'N/A'}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-gray-100 font-bold">
                    <td className="px-4 py-3 text-gray-900">Total</td>
                    <td className="px-4 py-3 text-right text-gray-900">12,110</td>
                    <td className="px-4 py-3 text-right text-gray-900">$2,367M</td>
                    <td className="px-4 py-3 text-right text-nt-gold">$197K</td>
                    <td className="px-4 py-3 text-right text-gray-900">$1,540M</td>
                    <td className="px-4 py-3 text-right text-gray-900">$568M</td>
                    <td className="px-4 py-3 text-right text-gray-900">$259M</td>
                    <td className="px-4 py-3 text-right text-gray-900">40.1%</td>
                  </tr>
                </tbody>
              </table>
              <div className="mt-4 grid grid-cols-3 gap-4 text-xs">
                <div className="p-3 rounded-lg bg-blue-50">
                  <div className="font-bold text-blue-900 mb-1">C&IS Compensation</div>
                  <div className="text-blue-800">Avg $183K/FTE. Lower than WM due to larger ops/tech workforce. Comp/Revenue 38.6% (efficient).</div>
                </div>
                <div className="p-3 rounded-lg bg-green-50">
                  <div className="font-bold text-green-900 mb-1">WM Compensation</div>
                  <div className="text-green-800">Avg $207K/FTE. Higher due to client-facing roles and incentive comp. Comp/Revenue 41.4%.</div>
                </div>
                <div className="p-3 rounded-lg bg-amber-50">
                  <div className="font-bold text-amber-900 mb-1">Corporate Functions</div>
                  <div className="text-amber-800">Avg $232K/FTE. Senior leadership, legal, risk functions command premium compensation.</div>
                </div>
              </div>
            </div>

            {/* Compensation Trends */}
            <div className="rounded-2xl p-6 shadow-lg" style={{
              background: 'linear-gradient(135deg, #ffffff 0%, rgba(248, 249, 250, 0.5) 100%)',
              border: '1px solid rgba(0, 77, 53, 0.08)'
            }}>
              <h3 className="text-lg font-bold mb-4" style={{ color: '#006747' }}>Monthly Compensation Trends</h3>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={compTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} label={{ value: 'Expense ($M)', angle: -90, position: 'insideLeft', style: { fontSize: 11 } }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="salaries" stackId="a" fill="#3b82f6" name="Salaries" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="bonus" stackId="a" fill="#10b981" name="Bonus/Incentive" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="benefits" stackId="a" fill="#f59e0b" name="Benefits" radius={[4, 4, 0, 0]} />
                  <Line type="monotone" dataKey="contractors" stroke="#ef4444" strokeWidth={3} name="Contractor Expense" dot={{ r: 3 }} />
                </ComposedChart>
              </ResponsiveContainer>
              <div className="mt-4 p-4 rounded-lg bg-green-50">
                <div className="text-sm font-bold text-green-900 mb-2">Compensation Trends Analysis</div>
                <div className="grid grid-cols-3 gap-4 text-xs text-green-800">
                  <div>
                    <div className="font-semibold">Salaries: +6.6% YoY</div>
                    <div>Growing with headcount. Base comp increases 3-4% annually + new hires.</div>
                  </div>
                  <div>
                    <div className="font-semibold">Bonus: +14.0% YoY</div>
                    <div>Strong performance driving higher incentive payouts. Variable comp working as designed.</div>
                  </div>
                  <div>
                    <div className="font-semibold">Contractors: Declining</div>
                    <div>Converting high-value contractors to FTE. -5% vs prior year. Cost savings opportunity.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Productivity Metrics Tab */}
        <TabsContent value="productivity">
          <div className="space-y-6">
            {/* Productivity by Segment */}
            <div className="rounded-2xl p-6 shadow-lg" style={{
              background: 'linear-gradient(135deg, #ffffff 0%, rgba(248, 249, 250, 0.5) 100%)',
              border: '1px solid rgba(0, 77, 53, 0.08)'
            }}>
              <h3 className="text-lg font-bold mb-4" style={{ color: '#006747' }}>Productivity Metrics by Business Segment</h3>
              <table className="min-w-full text-xs">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-bold text-gray-700">Segment</th>
                    <th className="px-4 py-3 text-right font-bold text-gray-700">FTE</th>
                    <th className="px-4 py-3 text-right font-bold text-gray-700">Revenue</th>
                    <th className="px-4 py-3 text-right font-bold text-gray-700">Revenue/FTE</th>
                    <th className="px-4 py-3 text-right font-bold text-gray-700">Cost/FTE</th>
                    <th className="px-4 py-3 text-right font-bold text-gray-700">Profit/FTE</th>
                    <th className="px-4 py-3 text-right font-bold text-gray-700">Span of Control</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {productivityBySegment.map((seg, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-semibold text-gray-900">{seg.segment}</td>
                      <td className="px-4 py-3 text-right text-gray-900">{seg.fte.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right text-gray-900">${seg.revenue}M</td>
                      <td className="px-4 py-3 text-right font-bold text-green-600">${seg.revenuePerFTE}K</td>
                      <td className="px-4 py-3 text-right text-gray-700">${seg.costPerFTE}K</td>
                      <td className="px-4 py-3 text-right font-bold text-nt-gold">${seg.profitPerFTE}K</td>
                      <td className="px-4 py-3 text-right text-gray-900">{seg.spanOfControl.toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-6 grid grid-cols-2 gap-6">
                <div className="p-4 rounded-lg bg-white border border-gray-200">
                  <div className="text-sm font-bold mb-3" style={{ color: '#006747' }}>Revenue per FTE</div>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={productivityBySegment} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis type="number" tick={{ fontSize: 11 }} label={{ value: 'Revenue/FTE ($K)', position: 'insideBottom', offset: -5, style: { fontSize: 11 } }} />
                      <YAxis type="category" dataKey="segment" tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Bar dataKey="revenuePerFTE" fill="#10b981" radius={[0, 8, 8, 0]}>
                        {productivityBySegment.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.revenuePerFTE > 490 ? '#10b981' : '#3b82f6'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="text-xs text-gray-700 mt-2">
                    WM leads at $500K/FTE due to asset-based fee model. C&IS at $474K/FTE driven by transaction volumes.
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-white border border-gray-200">
                  <div className="text-sm font-bold mb-3" style={{ color: '#006747' }}>Profit per FTE</div>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={productivityBySegment} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis type="number" tick={{ fontSize: 11 }} label={{ value: 'Profit/FTE ($K)', position: 'insideBottom', offset: -5, style: { fontSize: 11 } }} />
                      <YAxis type="category" dataKey="segment" tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Bar dataKey="profitPerFTE" fill="#D4AF37" radius={[0, 8, 8, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="text-xs text-gray-700 mt-2">
                    WM: $147K profit/FTE. C&IS: $143K profit/FTE. Relatively balanced despite different business models.
                  </div>
                </div>
              </div>
            </div>

            {/* Span of Control Analysis */}
            <div className="rounded-2xl p-6 shadow-lg" style={{
              background: 'linear-gradient(135deg, #ffffff 0%, rgba(248, 249, 250, 0.5) 100%)',
              border: '1px solid rgba(0, 77, 53, 0.08)'
            }}>
              <h3 className="text-lg font-bold mb-4" style={{ color: '#006747' }}>Span of Control & Organizational Efficiency</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-blue-50">
                    <div className="text-sm font-bold text-blue-900 mb-2">C&IS: 8.2 Direct Reports/Manager</div>
                    <div className="text-xs text-blue-800 space-y-1">
                      <div>• 835 managers overseeing 6,850 FTE</div>
                      <div>• Above industry benchmark (7-8 typical)</div>
                      <div>• Efficient structure for scale operations</div>
                      <div>• Opportunity to further optimize in tech teams</div>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-green-50">
                    <div className="text-sm font-bold text-green-900 mb-2">WM: 6.8 Direct Reports/Manager</div>
                    <div className="text-xs text-green-800 space-y-1">
                      <div>• 630 managers overseeing 4,280 FTE</div>
                      <div>• Below optimal range (improvement opportunity)</div>
                      <div>• Client-facing roles require closer management</div>
                      <div>• Target: Increase to 8.0 by year-end (-80 mgmt roles)</div>
                    </div>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-white border border-gray-200">
                  <div className="text-sm font-bold mb-3" style={{ color: '#006747' }}>Improvement Opportunities</div>
                  <div className="space-y-3 text-xs text-gray-700">
                    <div className="p-3 rounded-lg bg-amber-50">
                      <div className="font-semibold text-amber-900 mb-1">WM Organizational Redesign</div>
                      <div className="text-amber-800">
                        Flattening hierarchy from 6.8 to 8.0 span = 80 fewer managers. Annual savings: $18M (avg manager comp $225K).
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-blue-50">
                      <div className="font-semibold text-blue-900 mb-1">Technology Enablement</div>
                      <div className="text-blue-800">
                        Deploy performance management tools to enable wider spans. Self-service analytics reduce management burden.
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-green-50">
                      <div className="font-semibold text-green-900 mb-1">Peer Benchmarking</div>
                      <div className="text-green-800">
                        Industry leaders achieve 9-10 span in similar businesses. Opportunity for further efficiency gains.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Attrition & Retention Tab */}
        <TabsContent value="attrition">
          <div className="space-y-6">
            {/* Attrition Trends */}
            <div className="rounded-2xl p-6 shadow-lg" style={{
              background: 'linear-gradient(135deg, #ffffff 0%, rgba(248, 249, 250, 0.5) 100%)',
              border: '1px solid rgba(0, 77, 53, 0.08)'
            }}>
              <h3 className="text-lg font-bold mb-4" style={{ color: '#006747' }}>Monthly Attrition Trends</h3>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={attritionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis yAxisId="left" tick={{ fontSize: 11 }} label={{ value: 'Exits', angle: -90, position: 'insideLeft', style: { fontSize: 11 } }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} label={{ value: 'Rate (%)', angle: 90, position: 'insideRight', style: { fontSize: 11 } }} />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="voluntary" stackId="a" fill="#f59e0b" name="Voluntary" radius={[0, 0, 0, 0]} />
                  <Bar yAxisId="left" dataKey="involuntary" stackId="a" fill="#ef4444" name="Involuntary" radius={[4, 4, 0, 0]} />
                  <Line yAxisId="right" type="monotone" dataKey="rate" stroke="#1f2937" strokeWidth={3} name="Attrition Rate %" dot={{ r: 4 }} />
                </ComposedChart>
              </ResponsiveContainer>
              <div className="mt-4 grid grid-cols-3 gap-4 text-xs">
                <div className="p-3 rounded-lg bg-amber-50">
                  <div className="font-bold text-amber-900 mb-1">Voluntary Attrition: 4.5% avg</div>
                  <div className="text-amber-800">40 voluntary exits/month avg. Peaked in December (48) due to year-end departures. Within industry norms but room for improvement.</div>
                </div>
                <div className="p-3 rounded-lg bg-red-50">
                  <div className="font-bold text-red-900 mb-1">Involuntary: 1.1% avg</div>
                  <div className="text-red-800">11 terminations/month avg. Performance management functioning appropriately. Spike in Sep related to restructuring.</div>
                </div>
                <div className="p-3 rounded-lg bg-green-50">
                  <div className="font-bold text-green-900 mb-1">January Improvement</div>
                  <div className="text-green-800">Rate dropped to 3.5% in January (40 exits). New retention initiatives showing early results. Monitor through Q1.</div>
                </div>
              </div>
            </div>

            {/* Attrition by Reason */}
            <div className="rounded-2xl p-6 shadow-lg" style={{
              background: 'linear-gradient(135deg, #ffffff 0%, rgba(248, 249, 250, 0.5) 100%)',
              border: '1px solid rgba(0, 77, 53, 0.08)'
            }}>
              <h3 className="text-lg font-bold mb-4" style={{ color: '#006747' }}>Voluntary Attrition by Reason (Last 7 Months)</h3>
              <div className="grid grid-cols-2 gap-6">
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={attritionByReason}
                      dataKey="count"
                      nameKey="reason"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      label={(entry) => `${entry.percentage.toFixed(1)}%`}
                    >
                      {attritionByReason.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-3">
                  {attritionByReason.map((reason, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-white border border-gray-100">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-semibold text-gray-900">{reason.reason}</span>
                        <span className="text-sm font-bold text-gray-900">{reason.count}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full"
                            style={{
                              width: `${reason.percentage}%`,
                              backgroundColor: COLORS[idx % COLORS.length]
                            }}
                          />
                        </div>
                        <span className="text-xs text-gray-600 w-12 text-right">{reason.percentage.toFixed(1)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-4 p-4 rounded-lg" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
                <div className="text-sm font-bold text-red-900 mb-2">Retention Action Plan</div>
                <div className="grid grid-cols-2 gap-4 text-xs text-red-800">
                  <div>
                    <div className="font-semibold mb-1">Competitive Opportunity (42.5%)</div>
                    <div>• Enhanced retention bonuses for high performers • Accelerated promotion cycles • Executive stay interviews for flight risks</div>
                  </div>
                  <div>
                    <div className="font-semibold mb-1">Compensation Issues (23.1%)</div>
                    <div>• Market comp study in progress • Selective off-cycle adjustments • Long-term incentive refresh for key talent</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Hiring Pipeline */}
            <div className="rounded-2xl p-6 shadow-lg" style={{
              background: 'linear-gradient(135deg, #ffffff 0%, rgba(248, 249, 250, 0.5) 100%)',
              border: '1px solid rgba(0, 77, 53, 0.08)'
            }}>
              <h3 className="text-lg font-bold mb-4" style={{ color: '#006747' }}>Hiring Pipeline Status</h3>
              <div className="space-y-3">
                {hiringPipeline.map((stage, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-white border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-sm text-gray-900">{stage.stage}</span>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-xs text-gray-600">Current</div>
                          <div className="text-lg font-bold text-gray-900">{stage.count}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-600">Target</div>
                          <div className="text-sm font-semibold text-gray-700">{stage.target}</div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                          stage.count >= stage.target ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {stage.count >= stage.target ? 'On Track' : 'Below Target'}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width: `${Math.min((stage.count / stage.target) * 100, 100)}%`,
                            backgroundColor: stage.count >= stage.target ? '#10b981' : '#f59e0b'
                          }}
                        />
                      </div>
                      <span className="text-xs text-gray-600">
                        {((stage.count / stage.target) * 100).toFixed(0)}% of target
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-lg bg-green-50">
                  <div className="font-bold text-green-900 mb-1">Strong Pipeline</div>
                  <div className="text-green-800">68 accepted offers vs 60 target. 52 pending starts. Healthy funnel for Q1 growth targets.</div>
                </div>
                <div className="p-3 rounded-lg bg-amber-50">
                  <div className="font-bold text-amber-900 mb-1">Velocity Concern</div>
                  <div className="text-amber-800">Time to fill: 62 days avg (target 45). Bottleneck in technical interview stage. Adding interviewers.</div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
