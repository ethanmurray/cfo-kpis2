import { formatCurrency, formatPercent } from '../../utils/dataGenerators'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Line, Area } from 'recharts'

export default function NIMDecomposition() {
  // NIM waterfall components
  const nimWaterfall = [
    { component: 'Prior Period NIM', value: 2.08, cumulative: 2.08, color: '#9ca3af' },
    { component: 'Asset Yield Change', value: 0.15, cumulative: 2.23, color: '#10b981' },
    { component: 'Funding Cost Change', value: -0.22, cumulative: 2.01, color: '#ef4444' },
    { component: 'Asset Mix Shift', value: 0.06, cumulative: 2.07, color: '#3b82f6' },
    { component: 'Liability Mix Shift', value: 0.04, cumulative: 2.11, color: '#8b5cf6' },
    { component: 'Current Period NIM', value: 2.11, cumulative: 2.11, color: '#1f2937' }
  ]

  // Asset yield by category
  const assetYields = [
    {
      category: 'Commercial Loans',
      balance: 125000,
      yield: 6.2,
      contribution: 0.97,
      duration: 3.2,
      repricing: 'Floating (75%)'
    },
    {
      category: 'CRE Loans',
      balance: 48000,
      yield: 6.8,
      contribution: 0.41,
      duration: 4.5,
      repricing: 'Fixed (65%)'
    },
    {
      category: 'Consumer Loans',
      balance: 35000,
      yield: 8.5,
      contribution: 0.37,
      duration: 2.8,
      repricing: 'Fixed (90%)'
    },
    {
      category: 'Mortgages',
      balance: 42000,
      yield: 5.8,
      contribution: 0.30,
      duration: 6.2,
      repricing: 'Fixed (95%)'
    },
    {
      category: 'Securities',
      balance: 105000,
      yield: 4.5,
      contribution: 0.59,
      duration: 5.5,
      repricing: 'Fixed (100%)'
    },
    {
      category: 'Cash & Fed Funds',
      balance: 45000,
      yield: 5.3,
      contribution: 0.30,
      duration: 0.0,
      repricing: 'Floating (100%)'
    }
  ]

  const totalAssets = assetYields.reduce((sum, item) => sum + item.balance, 0)
  const weightedAssetYield = assetYields.reduce((sum, item) =>
    sum + (item.balance / totalAssets) * item.yield, 0
  )

  // Funding cost by source
  const fundingCosts = [
    {
      source: 'Non-Interest Bearing DDA',
      balance: 195000,
      cost: 0.0,
      contribution: 0.0,
      beta: 0,
      stable: 'High'
    },
    {
      source: 'Interest Bearing DDA',
      balance: 88000,
      cost: 1.8,
      contribution: -0.32,
      beta: 45,
      stable: 'High'
    },
    {
      source: 'Savings',
      balance: 45000,
      cost: 2.2,
      contribution: -0.20,
      beta: 55,
      stable: 'Medium'
    },
    {
      source: 'Money Market',
      balance: 62000,
      cost: 4.5,
      contribution: -0.56,
      beta: 85,
      stable: 'Low'
    },
    {
      source: 'Time Deposits',
      balance: 25000,
      cost: 4.8,
      contribution: -0.24,
      beta: 95,
      stable: 'Low'
    },
    {
      source: 'Wholesale/Other',
      balance: 60000,
      cost: 5.2,
      contribution: -0.62,
      beta: 100,
      stable: 'Low'
    }
  ]

  const totalLiabilities = fundingCosts.reduce((sum, item) => sum + item.balance, 0)
  const weightedFundingCost = fundingCosts.reduce((sum, item) =>
    sum + (item.balance / totalLiabilities) * item.cost, 0
  )

  const currentNIM = weightedAssetYield - weightedFundingCost

  // Rate scenario impact
  const rateScenarios = [
    {
      scenario: 'Base Case',
      fedFunds: 5.25,
      assetYield: 5.86,
      fundingCost: 3.24,
      nim: 2.62,
      nii: 13200
    },
    {
      scenario: '+100 bps Parallel',
      fedFunds: 6.25,
      assetYield: 6.68,
      fundingCost: 4.12,
      nim: 2.56,
      nii: 13850
    },
    {
      scenario: '+200 bps Parallel',
      fedFunds: 7.25,
      assetYield: 7.48,
      fundingCost: 5.18,
      nim: 2.30,
      nii: 14100
    },
    {
      scenario: '-100 bps Parallel',
      fedFunds: 4.25,
      assetYield: 5.12,
      fundingCost: 2.45,
      nim: 2.67,
      nii: 12450
    },
    {
      scenario: 'Flattener (Short -50, Long +50)',
      fedFunds: 4.75,
      assetYield: 6.05,
      fundingCost: 2.98,
      nim: 3.07,
      nii: 14850
    },
    {
      scenario: 'Steepener (Short +50, Long -50)',
      fedFunds: 5.75,
      assetYield: 5.68,
      fundingCost: 3.62,
      nim: 2.06,
      nii: 11650
    }
  ]

  // Historical NIM trend with decomposition
  const nimTrend = [
    { quarter: 'Q1 23', nim: 1.85, assetYield: 4.88, fundingCost: 3.03, spread: 1.85 },
    { quarter: 'Q2 23', nim: 1.92, assetYield: 5.12, fundingCost: 3.20, spread: 1.92 },
    { quarter: 'Q3 23', nim: 2.01, assetYield: 5.38, fundingCost: 3.37, spread: 2.01 },
    { quarter: 'Q4 23', nim: 2.08, assetYield: 5.58, fundingCost: 3.50, spread: 2.08 },
    { quarter: 'Q1 24', nim: 2.11, assetYield: 5.86, fundingCost: 3.75, spread: 2.11 },
    { quarter: 'Q2 24E', nim: 2.15, assetYield: 6.08, fundingCost: 3.93, spread: 2.15 }
  ]

  // Optimization opportunities
  const optimizations = [
    {
      action: 'Reallocate $10B from Securities (4.5%) to Commercial Loans (6.2%)',
      nimImpact: 0.02,
      niiImpact: 110,
      rwaImpact: 5500,
      timeframe: '6-9 months',
      risk: 'Medium'
    },
    {
      action: 'Shift $7B from Money Market (4.5%) to DDA (1.8%)',
      nimImpact: 0.03,
      niiImpact: 126,
      rwaImpact: 0,
      timeframe: '12 months',
      risk: 'Low'
    },
    {
      action: 'Reduce Time Deposits by $5B, increase NIB DDA',
      nimImpact: 0.04,
      niiImpact: 144,
      rwaImpact: 0,
      timeframe: '12-18 months',
      risk: 'Medium'
    },
    {
      action: 'Increase floating rate loan mix from 35% to 45%',
      nimImpact: 0.08,
      niiImpact: 320,
      rwaImpact: 3000,
      timeframe: '18-24 months',
      risk: 'Medium-High'
    }
  ]

  const totalOptimizationImpact = optimizations.reduce((sum, opp) => sum + opp.niiImpact, 0)

  return (
    <div className="space-y-6">
      {/* Header Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="metric-card">
          <div className="text-sm text-gray-600 mb-1">Current NIM</div>
          <div className="text-2xl font-bold text-gray-900">{currentNIM.toFixed(2)}%</div>
          <div className="text-xs text-green-500 mt-1">+3 bps QoQ</div>
        </div>
        <div className="metric-card">
          <div className="text-sm text-gray-600 mb-1">Asset Yield</div>
          <div className="text-2xl font-bold text-blue-600">{weightedAssetYield.toFixed(2)}%</div>
          <div className="text-xs text-gray-500 mt-1">Blended average</div>
        </div>
        <div className="metric-card">
          <div className="text-sm text-gray-600 mb-1">Funding Cost</div>
          <div className="text-2xl font-bold text-red-600">{weightedFundingCost.toFixed(2)}%</div>
          <div className="text-xs text-gray-500 mt-1">Cost of deposits</div>
        </div>
        <div className="metric-card">
          <div className="text-sm text-gray-600 mb-1">Optimization Potential</div>
          <div className="text-2xl font-bold text-green-600">+{formatCurrency(totalOptimizationImpact, 0)}M</div>
          <div className="text-xs text-green-500 mt-1">Incremental NII</div>
        </div>
      </div>

      {/* NIM Waterfall */}
      <div className="metric-card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">NIM Waterfall Analysis - QoQ Change</h3>
        <div className="h-80 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={nimWaterfall} margin={{ top: 20, right: 30, left: 60, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="component"
                angle={-15}
                textAnchor="end"
                height={80}
                interval={0}
              />
              <YAxis
                label={{ value: 'NIM (%)', angle: -90, position: 'insideLeft' }}
                domain={[1.9, 2.3]}
              />
              <Tooltip
                formatter={(value: number) => `${value.toFixed(2)}%`}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload
                    return (
                      <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
                        <p className="font-semibold text-gray-900">{data.component}</p>
                        <p className="text-sm text-gray-600">Change: {data.value > 0 ? '+' : ''}{data.value.toFixed(2)}%</p>
                        <p className="text-sm text-blue-600">Cumulative: {data.cumulative.toFixed(2)}%</p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Bar dataKey="cumulative" fill="#3b82f6">
                {nimWaterfall.map((entry, index) => (
                  <rect key={`bar-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-6 gap-2">
          {nimWaterfall.map((item, idx) => (
            <div key={idx} className="p-3 rounded-lg border border-gray-200">
              <div className="text-xs text-gray-600 mb-1">{item.component}</div>
              <div className={`text-lg font-bold ${
                item.value > 0 ? 'text-green-600' :
                item.value < 0 ? 'text-red-600' :
                'text-gray-900'
              }`}>
                {item.value > 0 && item.component !== 'Current Period NIM' ? '+' : ''}
                {item.component.includes('Prior') || item.component.includes('Current') ? item.value.toFixed(2) : item.value.toFixed(2)}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Asset Yield Decomposition */}
      <div className="metric-card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Asset Yield Decomposition</h3>
        <div className="overflow-x-auto mb-4">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Asset Category</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Balance</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">% of Total</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Yield</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">NIM Contrib</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Duration</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Repricing</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {assetYields.map((asset, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{asset.category}</td>
                  <td className="px-4 py-3 text-sm text-right">{formatCurrency(asset.balance / 1000, 1)}B</td>
                  <td className="px-4 py-3 text-sm text-right">{((asset.balance / totalAssets) * 100).toFixed(1)}%</td>
                  <td className="px-4 py-3 text-sm text-right font-medium text-blue-600">{asset.yield.toFixed(2)}%</td>
                  <td className="px-4 py-3 text-sm text-right font-semibold">{asset.contribution.toFixed(2)}%</td>
                  <td className="px-4 py-3 text-sm text-right">{asset.duration.toFixed(1)} yrs</td>
                  <td className="px-4 py-3 text-sm">{asset.repricing}</td>
                </tr>
              ))}
              <tr className="bg-gray-50 font-semibold">
                <td className="px-4 py-3 text-sm">Total / Weighted Avg</td>
                <td className="px-4 py-3 text-sm text-right">{formatCurrency(totalAssets / 1000, 1)}B</td>
                <td className="px-4 py-3 text-sm text-right">100.0%</td>
                <td className="px-4 py-3 text-sm text-right text-blue-600">{weightedAssetYield.toFixed(2)}%</td>
                <td className="px-4 py-3 text-sm text-right">{weightedAssetYield.toFixed(2)}%</td>
                <td className="px-4 py-3 text-sm text-right">-</td>
                <td className="px-4 py-3 text-sm">-</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-900">
            <strong>Analysis:</strong> Consumer loans (8.5% yield) and CRE (6.8%) deliver highest yields but are predominantly fixed-rate.
            Commercial loans (6.2%) with 75% floating rate exposure provide best rate sensitivity. Securities portfolio (4.5%) creates yield drag
            but essential for liquidity.
          </p>
        </div>
      </div>

      {/* Funding Cost Decomposition */}
      <div className="metric-card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Funding Cost Decomposition</h3>
        <div className="overflow-x-auto mb-4">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Funding Source</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Balance</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">% of Total</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Cost</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">NIM Impact</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Beta</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stability</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {fundingCosts.map((funding, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{funding.source}</td>
                  <td className="px-4 py-3 text-sm text-right">{formatCurrency(funding.balance / 1000, 1)}B</td>
                  <td className="px-4 py-3 text-sm text-right">{((funding.balance / totalLiabilities) * 100).toFixed(1)}%</td>
                  <td className="px-4 py-3 text-sm text-right font-medium text-red-600">{funding.cost.toFixed(2)}%</td>
                  <td className="px-4 py-3 text-sm text-right font-semibold">{funding.contribution.toFixed(2)}%</td>
                  <td className="px-4 py-3 text-sm text-right">{funding.beta}%</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                      funding.stable === 'High' ? 'bg-green-100 text-green-800' :
                      funding.stable === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {funding.stable}
                    </span>
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-50 font-semibold">
                <td className="px-4 py-3 text-sm">Total / Weighted Avg</td>
                <td className="px-4 py-3 text-sm text-right">{formatCurrency(totalLiabilities / 1000, 1)}B</td>
                <td className="px-4 py-3 text-sm text-right">100.0%</td>
                <td className="px-4 py-3 text-sm text-right text-red-600">{weightedFundingCost.toFixed(2)}%</td>
                <td className="px-4 py-3 text-sm text-right">-{weightedFundingCost.toFixed(2)}%</td>
                <td className="px-4 py-3 text-sm text-right">-</td>
                <td className="px-4 py-3 text-sm">-</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
          <p className="text-sm text-amber-900">
            <strong>Concern:</strong> 47% of deposits (NIB DDA) have zero cost but remaining mix skews toward high-cost Money Market (4.5%) and
            Time Deposits (4.8%). High beta deposits (85-95%) will reprice quickly in rising rates. Strategy should prioritize growing
            low-cost, sticky DDA relationships.
          </p>
        </div>
      </div>

      {/* Rate Scenario Analysis */}
      <div className="metric-card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Rate Scenario Impact on NIM & NII</h3>
        <div className="overflow-x-auto mb-4">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Scenario</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Fed Funds</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Asset Yield</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Funding Cost</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">NIM</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">NII ($M)</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">vs Base</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rateScenarios.map((scenario, idx) => (
                <tr key={idx} className={`hover:bg-gray-50 ${scenario.scenario === 'Base Case' ? 'bg-blue-50 font-semibold' : ''}`}>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{scenario.scenario}</td>
                  <td className="px-4 py-3 text-sm text-right">{scenario.fedFunds.toFixed(2)}%</td>
                  <td className="px-4 py-3 text-sm text-right text-blue-600">{scenario.assetYield.toFixed(2)}%</td>
                  <td className="px-4 py-3 text-sm text-right text-red-600">{scenario.fundingCost.toFixed(2)}%</td>
                  <td className="px-4 py-3 text-sm text-right font-semibold">{scenario.nim.toFixed(2)}%</td>
                  <td className="px-4 py-3 text-sm text-right font-medium">{formatCurrency(scenario.nii, 0)}M</td>
                  <td className="px-4 py-3 text-sm text-right">
                    <span className={`font-semibold ${
                      scenario.nii > 13200 ? 'text-green-600' :
                      scenario.nii < 13200 ? 'text-red-600' :
                      'text-gray-600'
                    }`}>
                      {scenario.nii > 13200 ? '+' : ''}{formatCurrency(scenario.nii - 13200, 0)}M
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h4 className="text-sm font-semibold text-green-900 mb-2">Best Case: Flattener</h4>
            <p className="text-sm text-green-800">
              Short rates down 50bps, long rates up 50bps. Funding cost falls faster than asset yield due to deposit beta lag.
              NIM expands to 3.07% (+46bps), NII up $1.65B (+12.5%).
            </p>
          </div>
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <h4 className="text-sm font-semibold text-red-900 mb-2">Worst Case: Steepener</h4>
            <p className="text-sm text-red-800">
              Short rates up 50bps, long rates down 50bps. Funding cost rises immediately while asset yield compressed.
              NIM contracts to 2.06% (-56bps), NII down $1.55B (-11.7%). Hedge with rate floors/swaps.
            </p>
          </div>
        </div>
      </div>

      {/* Optimization Actions */}
      <div className="metric-card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">NIM Optimization Action Plan</h3>
        <div className="space-y-3">
          {optimizations.map((opp, idx) => (
            <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-gray-900">{opp.action}</h4>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  opp.risk === 'Low' ? 'bg-green-100 text-green-800' :
                  opp.risk === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-orange-100 text-orange-800'
                }`}>
                  {opp.risk} Risk
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-xs text-gray-600">NIM Impact</div>
                  <div className="font-semibold text-green-600">+{(opp.nimImpact * 100).toFixed(0)} bps</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600">NII Impact</div>
                  <div className="font-semibold text-green-600">+{formatCurrency(opp.niiImpact, 0)}M</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600">RWA Change</div>
                  <div className={`font-semibold ${opp.rwaImpact > 0 ? 'text-red-600' : 'text-gray-600'}`}>
                    {opp.rwaImpact > 0 ? '+' : ''}{formatCurrency(opp.rwaImpact / 1000, 1)}B
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-600">Timeframe</div>
                  <div className="font-medium text-gray-900">{opp.timeframe}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
          <h4 className="text-sm font-semibold text-green-900 mb-2">Combined Impact</h4>
          <p className="text-sm text-green-800">
            Executing all four initiatives would generate <strong>+{formatCurrency(totalOptimizationImpact, 0)}M incremental NII</strong>
            (+4.9%) with manageable RWA increase. Priority: Deposit mix shift (lowest risk, immediate impact).
          </p>
        </div>
      </div>
    </div>
  )
}
