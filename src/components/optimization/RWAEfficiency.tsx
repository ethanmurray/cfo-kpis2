import { formatCurrency, formatPercent } from '../../utils/dataGenerators'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, Cell } from 'recharts'

export default function RWAEfficiency() {
  // Business line RWA efficiency data
  const businessLineData = [
    {
      line: 'Corporate & Institutional Services',
      revenue: 5200,
      rwa: 85000,
      revenuePerRWA: 6.12,
      roe: 15.2,
      category: 'high'
    },
    {
      line: 'Wealth Management',
      revenue: 1850,
      rwa: 42000,
      revenuePerRWA: 4.40,
      roe: 12.8,
      category: 'medium'
    },
    {
      line: 'Asset Management',
      revenue: 950,
      rwa: 28000,
      revenuePerRWA: 3.39,
      roe: 8.5,
      category: 'low'
    },
    {
      line: 'Commercial Lending',
      revenue: 680,
      rwa: 95000,
      revenuePerRWA: 0.72,
      roe: 6.2,
      category: 'low'
    },
    {
      line: 'Securities Services',
      revenue: 1120,
      rwa: 18000,
      revenuePerRWA: 6.22,
      roe: 18.5,
      category: 'high'
    }
  ]

  // Asset class RWA density
  const assetClassData = [
    { class: 'US Treasuries', balance: 45000, rwaWeight: 0, rwa: 0, yield: 4.2 },
    { class: 'Agency MBS', balance: 32000, rwaWeight: 20, rwa: 6400, yield: 4.8 },
    { class: 'Corporate Bonds', balance: 28000, rwaWeight: 20, rwa: 5600, yield: 5.4 },
    { class: 'Commercial Loans', balance: 125000, rwaWeight: 75, rwa: 93750, yield: 6.2 },
    { class: 'CRE Loans', balance: 48000, rwaWeight: 100, rwa: 48000, yield: 6.8 },
    { class: 'Consumer Loans', balance: 35000, rwaWeight: 75, rwa: 26250, yield: 8.5 },
    { class: 'Mortgages', balance: 42000, rwaWeight: 35, rwa: 14700, yield: 5.8 }
  ]

  // Basel IV impact
  const baselIVImpact = [
    { category: 'Credit Risk - Corporate', currentRWA: 95000, baselIVRWA: 105000, change: 10.5 },
    { category: 'Credit Risk - Retail', currentRWA: 26250, baselIVRWA: 29500, change: 12.4 },
    { category: 'Market Risk', currentRWA: 15000, baselIVRWA: 18500, change: 23.3 },
    { category: 'Operational Risk', currentRWA: 45000, baselIVRWA: 52000, change: 15.6 },
    { category: 'CVA Risk', currentRWA: 8200, baselIVRWA: 11800, change: 43.9 }
  ]

  const totalCurrentRWA = baselIVImpact.reduce((sum, item) => sum + item.currentRWA, 0)
  const totalBaselIVRWA = baselIVImpact.reduce((sum, item) => sum + item.baselIVRWA, 0)
  const overallIncrease = ((totalBaselIVRWA - totalCurrentRWA) / totalCurrentRWA) * 100

  // Optimization opportunities
  const optimizationOpps = [
    {
      opportunity: 'Exit Low-ROE Commercial Lending',
      rwaReduction: 30000,
      revenueImpact: -250,
      netIncomeImpact: -75,
      cet1Impact: 0.45,
      roicImprovement: 0.3,
      timeframe: '12-18 months'
    },
    {
      opportunity: 'Shift to Agency MBS from Corporates',
      rwaReduction: 5000,
      revenueImpact: -35,
      netIncomeImpact: -20,
      cet1Impact: 0.08,
      roicImprovement: 0.05,
      timeframe: '6 months'
    },
    {
      opportunity: 'Securitize Mortgage Portfolio',
      rwaReduction: 12000,
      revenueImpact: 45,
      netIncomeImpact: 28,
      cet1Impact: 0.18,
      roicImprovement: 0.15,
      timeframe: '9 months'
    },
    {
      opportunity: 'Expand Securities Services (Low RWA)',
      rwaReduction: -8000,
      revenueImpact: 420,
      netIncomeImpact: 185,
      cet1Impact: -0.12,
      roicImprovement: 0.6,
      timeframe: '18-24 months'
    }
  ]

  const getColorByCategory = (category: string) => {
    switch (category) {
      case 'high': return '#10b981'
      case 'medium': return '#f59e0b'
      case 'low': return '#ef4444'
      default: return '#6b7280'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="metric-card">
          <div className="text-sm text-gray-600 mb-1">Total RWA</div>
          <div className="text-2xl font-bold text-gray-900">{formatCurrency(totalCurrentRWA / 1000, 1)}B</div>
          <div className="text-xs text-gray-500 mt-1">Current Basel III</div>
        </div>
        <div className="metric-card">
          <div className="text-sm text-gray-600 mb-1">Basel IV Impact</div>
          <div className="text-2xl font-bold text-red-600">+{formatCurrency((totalBaselIVRWA - totalCurrentRWA) / 1000, 1)}B</div>
          <div className="text-xs text-red-500 mt-1">+{overallIncrease.toFixed(1)}% increase</div>
        </div>
        <div className="metric-card">
          <div className="text-sm text-gray-600 mb-1">Avg Revenue / RWA</div>
          <div className="text-2xl font-bold text-blue-600">3.85%</div>
          <div className="text-xs text-gray-500 mt-1">Blended across all lines</div>
        </div>
        <div className="metric-card">
          <div className="text-sm text-gray-600 mb-1">Optimization Potential</div>
          <div className="text-2xl font-bold text-green-600">+1.1%</div>
          <div className="text-xs text-green-500 mt-1">ROE improvement available</div>
        </div>
      </div>

      {/* Business Line RWA Efficiency */}
      <div className="metric-card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Line RWA Efficiency</h3>
        <div className="h-80 mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 30, bottom: 60, left: 60 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                type="number"
                dataKey="revenuePerRWA"
                name="Revenue per $1 RWA"
                label={{ value: 'Revenue per $1 RWA (%)', position: 'bottom', offset: 40 }}
                domain={[0, 7]}
              />
              <YAxis
                type="number"
                dataKey="roe"
                name="ROE"
                label={{ value: 'ROE (%)', angle: -90, position: 'left', offset: 40 }}
                domain={[0, 20]}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload
                    return (
                      <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
                        <p className="font-semibold text-gray-900">{data.line}</p>
                        <p className="text-sm text-gray-600">Revenue: {formatCurrency(data.revenue, 0)}M</p>
                        <p className="text-sm text-gray-600">RWA: {formatCurrency(data.rwa / 1000, 1)}B</p>
                        <p className="text-sm text-blue-600">Revenue/RWA: {data.revenuePerRWA.toFixed(2)}%</p>
                        <p className="text-sm text-green-600">ROE: {data.roe.toFixed(1)}%</p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Scatter data={businessLineData} fill="#8884d8">
                {businessLineData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getColorByCategory(entry.category)} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {businessLineData.map((line, idx) => (
            <div key={idx} className={`p-4 rounded-lg border-l-4 ${
              line.category === 'high' ? 'border-green-500 bg-green-50' :
              line.category === 'medium' ? 'border-yellow-500 bg-yellow-50' :
              'border-red-500 bg-red-50'
            }`}>
              <div className="text-sm font-semibold text-gray-900 mb-2">{line.line}</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <div className="text-gray-600">Revenue</div>
                  <div className="font-medium">{formatCurrency(line.revenue, 0)}M</div>
                </div>
                <div>
                  <div className="text-gray-600">RWA</div>
                  <div className="font-medium">{formatCurrency(line.rwa / 1000, 1)}B</div>
                </div>
                <div>
                  <div className="text-gray-600">Rev/RWA</div>
                  <div className={`font-bold ${
                    line.category === 'high' ? 'text-green-600' :
                    line.category === 'medium' ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>{line.revenuePerRWA.toFixed(2)}%</div>
                </div>
                <div>
                  <div className="text-gray-600">ROE</div>
                  <div className="font-medium">{line.roe.toFixed(1)}%</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Asset Class RWA Density */}
      <div className="metric-card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Asset Class RWA Density Analysis</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Asset Class</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Balance</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">RWA Weight</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">RWA</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Yield</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">RWA Efficiency</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {assetClassData.map((asset, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{asset.class}</td>
                  <td className="px-4 py-3 text-sm text-right">{formatCurrency(asset.balance / 1000, 1)}B</td>
                  <td className="px-4 py-3 text-sm text-right">{asset.rwaWeight}%</td>
                  <td className="px-4 py-3 text-sm text-right font-medium">{formatCurrency(asset.rwa / 1000, 1)}B</td>
                  <td className="px-4 py-3 text-sm text-right">{asset.yield.toFixed(2)}%</td>
                  <td className="px-4 py-3 text-sm text-right">
                    <span className={`font-semibold ${
                      asset.rwaWeight === 0 ? 'text-green-600' :
                      asset.rwaWeight < 50 ? 'text-blue-600' :
                      'text-orange-600'
                    }`}>
                      {asset.rwaWeight === 0 ? 'Optimal' : asset.rwaWeight < 50 ? 'Good' : 'High Density'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-900">
            <strong>Insight:</strong> Shifting $10B from Commercial Loans (75% RWA) to Agency MBS (20% RWA)
            would reduce RWA by $5.5B while sacrificing only ~70bps yield (6.2% → 5.5%), improving capital efficiency.
          </p>
        </div>
      </div>

      {/* Basel IV Impact */}
      <div className="metric-card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Basel IV Impact Analysis</h3>
        <div className="h-80 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={baselIVImpact} margin={{ top: 20, right: 30, left: 60, bottom: 80 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="category"
                angle={-45}
                textAnchor="end"
                height={100}
                interval={0}
              />
              <YAxis label={{ value: 'RWA ($M)', angle: -90, position: 'insideLeft' }} />
              <Tooltip formatter={(value: number) => formatCurrency(value / 1000, 1) + 'B'} />
              <Legend />
              <Bar dataKey="currentRWA" name="Current (Basel III)" fill="#3b82f6" />
              <Bar dataKey="baselIVRWA" name="Basel IV" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-red-900 mb-1">Basel IV Impact: +{overallIncrease.toFixed(1)}% RWA Increase</h4>
              <p className="text-sm text-red-800">
                Implementation expected 2025-2027. RWA will increase by {formatCurrency((totalBaselIVRWA - totalCurrentRWA) / 1000, 1)}B,
                requiring either {formatCurrency((totalBaselIVRWA - totalCurrentRWA) * 0.105 / 1000, 2)}B additional capital (at 10.5% CET1)
                or strategic reductions in high-RWA density assets.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Optimization Opportunities */}
      <div className="metric-card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Strategic RWA Optimization Opportunities</h3>
        <div className="space-y-3">
          {optimizationOpps.map((opp, idx) => (
            <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-gray-900">{opp.opportunity}</h4>
                  <div className="text-xs text-gray-500 mt-1">Timeframe: {opp.timeframe}</div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  opp.roicImprovement > 0.4 ? 'bg-green-100 text-green-800' :
                  opp.roicImprovement > 0.1 ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  ROIC +{opp.roicImprovement.toFixed(1)}%
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                <div>
                  <div className="text-xs text-gray-600">RWA Impact</div>
                  <div className={`font-semibold ${opp.rwaReduction > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {opp.rwaReduction > 0 ? '-' : '+'}{formatCurrency(Math.abs(opp.rwaReduction) / 1000, 1)}B
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-600">Revenue Impact</div>
                  <div className={`font-semibold ${opp.revenueImpact > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {opp.revenueImpact > 0 ? '+' : ''}{formatCurrency(opp.revenueImpact, 0)}M
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-600">Net Income Impact</div>
                  <div className={`font-semibold ${opp.netIncomeImpact > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {opp.netIncomeImpact > 0 ? '+' : ''}{formatCurrency(opp.netIncomeImpact, 0)}M
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-600">CET1 Impact</div>
                  <div className={`font-semibold ${opp.cet1Impact > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {opp.cet1Impact > 0 ? '+' : ''}{opp.cet1Impact.toFixed(2)}%
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-600">ROIC Improvement</div>
                  <div className="font-semibold text-blue-600">+{opp.roicImprovement.toFixed(2)}%</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
          <h4 className="text-sm font-semibold text-green-900 mb-2">Recommended Action</h4>
          <p className="text-sm text-green-800">
            Implement portfolio rebalancing: (1) Exit bottom-quartile commercial lending relationships over 18 months,
            (2) Accelerate securities services growth, and (3) Securitize eligible mortgage assets. Combined impact:
            <strong> -$34B RWA, +$193M net income, +1.1% ROE, +0.51% CET1</strong>.
          </p>
        </div>
      </div>
    </div>
  )
}
