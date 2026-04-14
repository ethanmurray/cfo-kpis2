import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/Tabs'
import { BarChart, Bar, LineChart, Line, ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts'
import CompactMetricCard from '../components/CompactMetricCard'
import OverviewTab from '../components/balancesheet/OverviewTab'
import FundingTab from '../components/balancesheet/FundingTab'
import AssetsTab from '../components/balancesheet/AssetsTab'
import CapitalTab from '../components/balancesheet/CapitalTab'
import { TrendingUp, CheckCircle2, AlertCircle, Clock, Target } from 'lucide-react'

export default function Financials() {
  // P&L Data
  const plData = [
    { month: 'Jan', revenue: 445, nii: 72, fee: 285, other: 88, opex: 275, econProfit: 152 },
    { month: 'Feb', revenue: 438, nii: 70, fee: 278, other: 90, opex: 268, econProfit: 148 },
    { month: 'Mar', revenue: 452, nii: 75, fee: 288, other: 89, opex: 272, econProfit: 158 },
    { month: 'Apr', revenue: 448, nii: 73, fee: 285, other: 90, opex: 270, econProfit: 155 },
    { month: 'May', revenue: 455, nii: 74, fee: 291, other: 90, opex: 274, econProfit: 159 },
    { month: 'Jun', revenue: 460, nii: 76, fee: 294, other: 90, opex: 276, econProfit: 162 },
    { month: 'Jul', revenue: 451, nii: 74, fee: 287, other: 90, opex: 273, econProfit: 156 },
    { month: 'Aug', revenue: 458, nii: 75, fee: 293, other: 90, opex: 275, econProfit: 161 },
    { month: 'Sep', revenue: 463, nii: 76, fee: 297, other: 90, opex: 278, econProfit: 163 },
    { month: 'Oct', revenue: 456, nii: 75, fee: 291, other: 90, opex: 276, econProfit: 158 },
    { month: 'Nov', revenue: 461, nii: 76, fee: 295, other: 90, opex: 279, econProfit: 160 },
    { month: 'Dec', revenue: 468, nii: 78, fee: 300, other: 90, opex: 281, econProfit: 165 },
  ]

  // Balance Sheet
  const balanceSheet = {
    assets: {
      cash: 28500,
      securities: 45200,
      loans: 52300,
      otherAssets: 16800,
      total: 142800
    },
    liabilities: {
      deposits: 98500,
      borrowings: 22400,
      otherLiab: 8900,
      total: 129800
    },
    equity: 13000
  }

  // Capital Ratios
  const capitalTrends = [
    { quarter: 'Q1 23', cet1: 10.8, tier1: 12.2, total: 14.5, leverage: 6.5 },
    { quarter: 'Q2 23', cet1: 10.9, tier1: 12.3, total: 14.6, leverage: 6.6 },
    { quarter: 'Q3 23', cet1: 11.0, tier1: 12.4, total: 14.7, leverage: 6.7 },
    { quarter: 'Q4 23', cet1: 11.1, tier1: 12.5, total: 14.8, leverage: 6.8 },
    { quarter: 'Q1 24', cet1: 11.2, tier1: 12.6, total: 14.9, leverage: 6.8 },
  ]

  // Liquidity metrics
  const liquidityTrends = [
    { quarter: 'Q1 23', lcr: 132, nsfr: 112, hqla: 42500 },
    { quarter: 'Q2 23', lcr: 135, nsfr: 114, hqla: 43200 },
    { quarter: 'Q3 23', lcr: 138, nsfr: 115, hqla: 44100 },
    { quarter: 'Q4 23', lcr: 140, nsfr: 117, hqla: 44800 },
    { quarter: 'Q1 24', lcr: 142, nsfr: 118, hqla: 45500 },
  ]

  // NII/NIM decomposition
  const nimData = [
    { month: 'Jan', nim: 1.38, assetYield: 3.82, liabCost: 2.44, spread: 1.38 },
    { month: 'Feb', nim: 1.40, assetYield: 3.85, liabCost: 2.45, spread: 1.40 },
    { month: 'Mar', nim: 1.42, assetYield: 3.88, liabCost: 2.46, spread: 1.42 },
    { month: 'Apr', nim: 1.41, assetYield: 3.86, liabCost: 2.45, spread: 1.41 },
    { month: 'May', nim: 1.43, assetYield: 3.89, liabCost: 2.46, spread: 1.43 },
    { month: 'Jun', nim: 1.44, assetYield: 3.91, liabCost: 2.47, spread: 1.44 },
    { month: 'Jul', nim: 1.42, assetYield: 3.87, liabCost: 2.45, spread: 1.42 },
    { month: 'Aug', nim: 1.43, assetYield: 3.88, liabCost: 2.45, spread: 1.43 },
    { month: 'Sep', nim: 1.44, assetYield: 3.90, liabCost: 2.46, spread: 1.44 },
    { month: 'Oct', nim: 1.43, assetYield: 3.88, liabCost: 2.45, spread: 1.43 },
    { month: 'Nov', nim: 1.44, assetYield: 3.89, liabCost: 2.45, spread: 1.44 },
    { month: 'Dec', nim: 1.45, assetYield: 3.92, liabCost: 2.47, spread: 1.45 },
  ]

  // Profitability metrics
  const profitMetrics = [
    { segment: 'Custody & Admin', revenue: 2850, costs: 1755, econProfit: 823, raroc: 11.2, roa: 1.42 },
    { segment: 'Fund Services', revenue: 1245, costs: 748, econProfit: 385, raroc: 10.8, roa: 1.38 },
    { segment: 'Securities Lending', revenue: 485, costs: 298, econProfit: 145, raroc: 9.5, roa: 1.25 },
    { segment: 'Treasury Services', revenue: 420, costs: 268, econProfit: 115, raroc: 8.2, roa: 1.18 },
    { segment: 'Investment Mgmt', revenue: 390, costs: 248, econProfit: 105, raroc: 7.8, roa: 1.15 },
  ]


  return (
    <div className="space-y-4">
      <div className="page-header">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-nt-forest">Group Financials</h1>
          <p className="text-xs mt-1 text-gray-600">
            P&L, balance sheet, funding, assets, capital, treasury, and NIM analytics
          </p>
        </div>
        <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg shadow-md" style={{
          background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.12) 0%, rgba(212, 175, 55, 0.04) 100%)',
          border: '1px solid rgba(212, 175, 55, 0.25)'
        }}>
          <Target className="h-5 w-5 text-nt-gold" />
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wide text-gray-600">Current RAROC</div>
            <div className="flex items-baseline gap-1.5">
              <div className="text-lg font-bold text-nt-gold">9.8%</div>
              <div className="text-[10px] font-semibold text-green-600">+0.2%</div>
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
              <li>• Revenue up 8.2% YoY to $5.4B driven by fee income</li>
              <li>• Economic profit $1.85B (+12.3% YoY)</li>
              <li>• Capital ratios well above minimums (CET1: 11.2%)</li>
              <li>• Liquidity strong (LCR 142%, NSFR 118%)</li>
            </ul>
          </div>

          <div className="summary-card">
            <div className="flex items-center gap-1.5 mb-2">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <span className="font-semibold text-xs text-nt-forest">Areas of Focus</span>
            </div>
            <ul className="space-y-0.5 text-xs text-gray-600 leading-tight">
              <li>• Efficiency ratio at 60.1% vs 58.5% peer median</li>
              <li>• NIM compression risk from expected Fed rate cuts</li>
              <li>• NII declining (-2.3% YoY) offsetting fee growth</li>
              <li>• Operating leverage turning negative</li>
            </ul>
          </div>

          <div className="summary-card">
            <div className="flex items-center gap-1.5 mb-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="font-semibold text-xs text-nt-forest">Strategic Actions</span>
            </div>
            <ul className="space-y-0.5 text-xs text-gray-600 leading-tight">
              <li>• Deploy $3.2B excess capital (buybacks or M&A)</li>
              <li>• Accelerate automation to reach 95% STP rate</li>
              <li>• Review $485M tech spend for consolidation</li>
              <li>• Evaluate pricing opportunities in custody segment</li>
            </ul>
          </div>
        </div>
      </div>

      <Tabs defaultValue="pl">
        <TabsList>
          <TabsTrigger value="pl">P&L & Profitability</TabsTrigger>
          <TabsTrigger value="balancesheet">Balance Sheet</TabsTrigger>
          <TabsTrigger value="funding">Funding</TabsTrigger>
          <TabsTrigger value="assets">Assets</TabsTrigger>
          <TabsTrigger value="capital">Capital</TabsTrigger>
          <TabsTrigger value="liquidity">Treasury & Liquidity</TabsTrigger>
          <TabsTrigger value="nim">NII/NIM Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="pl">
          <div className="space-y-4">
            {/* Summary Metrics */}
            <div className="grid grid-cols-6 gap-3">
              <CompactMetricCard label="Total Revenue (YTD)" value="$5,390" unit="M" change={8.2} status="good" />
              <CompactMetricCard label="NII" value="$892" unit="M" change={-2.3} status="warning" />
              <CompactMetricCard label="Fee Income" value="$3,483" unit="M" change={6.5} status="good" />
              <CompactMetricCard label="Operating Expenses" value="$3,367" unit="M" change={-1.8} status="good" />
              <CompactMetricCard label="Economic Profit" value="$1,854" unit="M" change={12.3} status="good" />
              <CompactMetricCard label="Cost/Income" value="62.5" unit="%" change={-3.2} status="good" target="58.5" />
            </div>

            {/* Monthly P&L Trend */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold text-sm mb-3">Monthly P&L Trend</h3>
              <ResponsiveContainer width="100%" height={280}>
                <ComposedChart data={plData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="fee" stackId="a" fill="#3b82f6" name="Fee Income" />
                  <Bar dataKey="nii" stackId="a" fill="#10b981" name="NII" />
                  <Bar dataKey="other" stackId="a" fill="#f59e0b" name="Other" />
                  <Line type="monotone" dataKey="econProfit" stroke="#ef4444" strokeWidth={2} name="Economic Profit" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* Segment Profitability */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold text-sm mb-3">Segment Profitability Analysis</h3>
              <table className="min-w-full text-xs">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium text-gray-600">Segment</th>
                    <th className="px-3 py-2 text-right font-medium text-gray-600">Revenue</th>
                    <th className="px-3 py-2 text-right font-medium text-gray-600">Costs</th>
                    <th className="px-3 py-2 text-right font-medium text-gray-600">Econ Profit</th>
                    <th className="px-3 py-2 text-right font-medium text-gray-600">RAROC</th>
                    <th className="px-3 py-2 text-right font-medium text-gray-600">ROA</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-600">Performance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {profitMetrics.map((seg, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-3 py-2 font-medium text-gray-900">{seg.segment}</td>
                      <td className="px-3 py-2 text-right text-gray-900">${seg.revenue}M</td>
                      <td className="px-3 py-2 text-right text-gray-700">${seg.costs}M</td>
                      <td className="px-3 py-2 text-right font-semibold text-green-600">${seg.econProfit}M</td>
                      <td className="px-3 py-2 text-right font-semibold text-gray-900">{seg.raroc}%</td>
                      <td className="px-3 py-2 text-right text-gray-700">{seg.roa}%</td>
                      <td className="px-3 py-2">
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${(seg.raroc / 12) * 100}%` }} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-3 p-3 bg-blue-50 rounded text-xs space-y-1">
                <div className="font-medium text-blue-900">Key Insights</div>
                <div className="text-blue-800">• Custody & Admin drives 44% of economic profit with 11.2% RAROC</div>
                <div className="text-blue-800">• Investment Management below hurdle rate - requires strategic review</div>
                <div className="text-blue-800">• Combined top 3 segments generate $1,353M (73% of total economic profit)</div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="balancesheet">
          <OverviewTab />
        </TabsContent>

        <TabsContent value="funding">
          <FundingTab />
        </TabsContent>

        <TabsContent value="assets">
          <AssetsTab />
        </TabsContent>

        <TabsContent value="capital">
          <CapitalTab />
        </TabsContent>

        <TabsContent value="liquidity">
          <div className="space-y-4">
            {/* Liquidity Summary */}
            <div className="grid grid-cols-6 gap-3">
              <CompactMetricCard label="LCR" value="142" unit="%" change={2.1} status="good" target="110" />
              <CompactMetricCard label="NSFR" value="118" unit="%" change={1.2} status="good" target="100" />
              <CompactMetricCard label="HQLA" value="$45.5" unit="B" change={3.5} status="good" />
              <CompactMetricCard label="Net Outflows" value="$32.1" unit="B" change={-1.2} status="good" />
              <CompactMetricCard label="Deposit/Loan" value="188" unit="%" change={0.8} status="good" />
              <CompactMetricCard label="Loan/Assets" value="36.6" unit="%" change={0.5} status="neutral" />
            </div>

            {/* Liquidity Trends */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold text-sm mb-3">Liquidity Coverage Trends</h3>
              <ResponsiveContainer width="100%" height={240}>
                <ComposedChart data={liquidityTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="quarter" />
                  <YAxis yAxisId="left" domain={[100, 150]} />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="right" dataKey="hqla" fill="#3b82f6" name="HQLA ($M)" />
                  <Line yAxisId="left" type="monotone" dataKey="lcr" stroke="#10b981" strokeWidth={2} name="LCR (%)" />
                  <Line yAxisId="left" type="monotone" dataKey="nsfr" stroke="#f59e0b" strokeWidth={2} name="NSFR (%)" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* HQLA Composition */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold text-sm mb-3">HQLA Composition & Quality</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between p-2 bg-gray-50 rounded">
                      <span className="text-gray-700">Level 1 Assets (100% eligible)</span>
                      <span className="font-semibold">$35.2B (77%)</span>
                    </div>
                    <div className="flex justify-between p-2 bg-gray-50 rounded">
                      <span className="text-gray-700">Level 2A Assets (85% eligible)</span>
                      <span className="font-semibold">$8.5B (19%)</span>
                    </div>
                    <div className="flex justify-between p-2 bg-gray-50 rounded">
                      <span className="text-gray-700">Level 2B Assets (50% eligible)</span>
                      <span className="font-semibold">$1.8B (4%)</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="p-3 bg-green-50 rounded">
                    <div className="font-medium text-green-900 text-xs mb-1">Liquidity Strengths</div>
                    <ul className="space-y-1 text-xs text-green-800">
                      <li>• LCR 32pp above regulatory minimum</li>
                      <li>• 77% Level 1 HQLA (highest quality)</li>
                      <li>• Stable deposit base (90% retail/operational)</li>
                    </ul>
                  </div>
                  <div className="p-3 bg-blue-50 rounded">
                    <div className="font-medium text-blue-900 text-xs mb-1">Funding Mix</div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-blue-800">
                      <div>Deposits: 76%</div>
                      <div>Wholesale: 17%</div>
                      <div>Equity: 9%</div>
                      <div>Other: -2%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="nim">
          <div className="space-y-4">
            {/* NIM Summary */}
            <div className="grid grid-cols-6 gap-3">
              <CompactMetricCard label="NIM" value="1.42" unit="%" change={-0.15} status="warning" target="1.55" />
              <CompactMetricCard label="Asset Yield" value="3.88" unit="%" change={0.12} status="good" />
              <CompactMetricCard label="Funding Cost" value="2.46" unit="%" change={0.28} status="bad" />
              <CompactMetricCard label="Interest Spread" value="1.42" unit="%" change={-0.16} status="warning" />
              <CompactMetricCard label="NII (YTD)" value="$892" unit="M" change={-2.3} status="warning" />
              <CompactMetricCard label="Earning Assets" value="$128" unit="B" change={2.8} status="neutral" />
            </div>

            {/* NIM Decomposition */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold text-sm mb-3">NIM Decomposition & Trend</h3>
              <ResponsiveContainer width="100%" height={260}>
                <ComposedChart data={nimData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 4.5]} />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="assetYield" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} name="Asset Yield" />
                  <Area type="monotone" dataKey="liabCost" stackId="2" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} name="Funding Cost" />
                  <Line type="monotone" dataKey="nim" stroke="#10b981" strokeWidth={3} name="NIM" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* NIM Drivers */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold text-sm mb-3">NIM Drivers & Sensitivities</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs font-medium text-gray-700 mb-2">Asset Mix Impact</div>
                  <table className="min-w-full text-xs">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-2 py-1 text-left text-gray-600">Asset Class</th>
                        <th className="px-2 py-1 text-right text-gray-600">Balance</th>
                        <th className="px-2 py-1 text-right text-gray-600">Yield</th>
                        <th className="px-2 py-1 text-right text-gray-600">Contrib</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr><td className="px-2 py-1">Loans</td><td className="px-2 py-1 text-right">$52.3B</td><td className="px-2 py-1 text-right">4.85%</td><td className="px-2 py-1 text-right font-semibold">1.98%</td></tr>
                      <tr><td className="px-2 py-1">Securities</td><td className="px-2 py-1 text-right">$45.2B</td><td className="px-2 py-1 text-right">3.42%</td><td className="px-2 py-1 text-right font-semibold">1.21%</td></tr>
                      <tr><td className="px-2 py-1">Cash</td><td className="px-2 py-1 text-right">$28.5B</td><td className="px-2 py-1 text-right">3.15%</td><td className="px-2 py-1 text-right font-semibold">0.70%</td></tr>
                      <tr className="bg-gray-50 font-semibold"><td className="px-2 py-1">Total</td><td className="px-2 py-1 text-right">$126.0B</td><td className="px-2 py-1 text-right">3.88%</td><td className="px-2 py-1 text-right">3.88%</td></tr>
                    </tbody>
                  </table>
                </div>
                <div>
                  <div className="text-xs font-medium text-gray-700 mb-2">Funding Mix Impact</div>
                  <table className="min-w-full text-xs">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-2 py-1 text-left text-gray-600">Funding Source</th>
                        <th className="px-2 py-1 text-right text-gray-600">Balance</th>
                        <th className="px-2 py-1 text-right text-gray-600">Cost</th>
                        <th className="px-2 py-1 text-right text-gray-600">Contrib</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr><td className="px-2 py-1">Deposits</td><td className="px-2 py-1 text-right">$98.5B</td><td className="px-2 py-1 text-right">2.15%</td><td className="px-2 py-1 text-right font-semibold">1.68%</td></tr>
                      <tr><td className="px-2 py-1">Borrowings</td><td className="px-2 py-1 text-right">$22.4B</td><td className="px-2 py-1 text-right">3.85%</td><td className="px-2 py-1 text-right font-semibold">0.68%</td></tr>
                      <tr><td className="px-2 py-1">Other</td><td className="px-2 py-1 text-right">$8.9B</td><td className="px-2 py-1 text-right">1.42%</td><td className="px-2 py-1 text-right font-semibold">0.10%</td></tr>
                      <tr className="bg-gray-50 font-semibold"><td className="px-2 py-1">Total</td><td className="px-2 py-1 text-right">$129.8B</td><td className="px-2 py-1 text-right">2.46%</td><td className="px-2 py-1 text-right">2.46%</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="mt-3 p-3 bg-amber-50 rounded text-xs space-y-1">
                <div className="font-medium text-amber-900">Rate Sensitivity Analysis</div>
                <div className="grid grid-cols-3 gap-3 mt-2">
                  <div>
                    <div className="text-amber-800">+100bps Rates</div>
                    <div className="font-bold text-amber-900">NIM: +18bps | NII: +$230M</div>
                  </div>
                  <div>
                    <div className="text-amber-800">-100bps Rates</div>
                    <div className="font-bold text-amber-900">NIM: -22bps | NII: -$280M</div>
                  </div>
                  <div>
                    <div className="text-amber-800">Duration Gap</div>
                    <div className="font-bold text-amber-900">+1.8 years (asset duration longer)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
