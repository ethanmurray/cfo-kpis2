import { formatCurrency, formatPercent } from '../../utils/dataGenerators'
import { BarChart, Bar, LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Area } from 'recharts'

export default function LiquidityOptimization() {
  // Current HQLA composition
  const hqlaComposition = [
    {
      level: 'Level 1',
      balance: 82000,
      haircut: 0,
      eligible: 82000,
      yield: 4.2,
      description: 'Cash, Central Bank Reserves, US Treasuries'
    },
    {
      level: 'Level 2A',
      balance: 28000,
      haircut: 15,
      eligible: 23800,
      yield: 4.8,
      description: 'GSE Debt, High-Quality Corporate Bonds'
    },
    {
      level: 'Level 2B',
      balance: 12000,
      haircut: 50,
      eligible: 6000,
      yield: 5.5,
      description: 'Lower-Rated Corporates, Equities'
    }
  ]

  const totalHQLA = hqlaComposition.reduce((sum, item) => sum + item.eligible, 0)
  const netCashOutflow = 47000
  const currentLCR = (totalHQLA / netCashOutflow) * 100

  // LCR sensitivity analysis
  const lcrScenarios = [
    { lcr: 110, cost: 580, buffer: 4700, riskLevel: 'High' },
    { lcr: 120, cost: 530, buffer: 9400, riskLevel: 'Elevated' },
    { lcr: 130, cost: 480, buffer: 14100, riskLevel: 'Moderate' },
    { lcr: 140, cost: 430, buffer: 18800, riskLevel: 'Low' },
    { lcr: 150, cost: 380, buffer: 23500, riskLevel: 'Minimal' }
  ]

  // Optimal HQLA mix scenarios
  const hqlaMixScenarios = [
    {
      scenario: 'Current Mix',
      level1Pct: 73.4,
      level2APct: 21.3,
      level2BPct: 5.3,
      avgYield: 4.45,
      yieldDrag: 180,
      lcr: 118,
      riskScore: 65
    },
    {
      scenario: 'Conservative',
      level1Pct: 85,
      level2APct: 12,
      level2BPct: 3,
      avgYield: 4.25,
      yieldDrag: 200,
      lcr: 122,
      riskScore: 85
    },
    {
      scenario: 'Balanced',
      level1Pct: 70,
      level2APct: 25,
      level2BPct: 5,
      avgYield: 4.55,
      yieldDrag: 170,
      lcr: 116,
      riskScore: 70
    },
    {
      scenario: 'Optimized',
      level1Pct: 65,
      level2APct: 30,
      level2BPct: 5,
      avgYield: 4.68,
      yieldDrag: 157,
      lcr: 114,
      riskScore: 60
    },
    {
      scenario: 'Aggressive',
      level1Pct: 60,
      level2APct: 32,
      level2BPct: 8,
      avgYield: 4.85,
      yieldDrag: 140,
      lcr: 112,
      riskScore: 50
    }
  ]

  // Yield drag calculation by LCR level
  const yieldDragData = [
    { lcrLevel: '110%', excessLiquidity: 4.7, opportunityCost: 45, yieldDrag: 0.08 },
    { lcrLevel: '120%', excessLiquidity: 9.4, opportunityCost: 90, yieldDrag: 0.15 },
    { lcrLevel: '130%', excessLiquidity: 14.1, opportunityCost: 135, yieldDrag: 0.23 },
    { lcrLevel: '140%', excessLiquidity: 18.8, opportunityCost: 180, yieldDrag: 0.30 },
    { lcrLevel: '150%', excessLiquidity: 23.5, opportunityCost: 225, yieldDrag: 0.38 }
  ]

  // Deposit composition and optimization
  const depositAnalysis = [
    {
      type: 'Non-Interest Bearing DDA',
      balance: 195000,
      cost: 0,
      runoffRate: 8,
      lcrFactor: 5,
      optimalBalance: 195000,
      strategy: 'Maintain - Zero cost, stable'
    },
    {
      type: 'Interest Bearing DDA',
      balance: 88000,
      cost: 1.8,
      runoffRate: 12,
      lcrFactor: 10,
      optimalBalance: 95000,
      strategy: 'Grow - Low cost, sticky'
    },
    {
      type: 'Savings',
      balance: 45000,
      cost: 2.2,
      runoffRate: 18,
      lcrFactor: 10,
      optimalBalance: 50000,
      strategy: 'Selective growth'
    },
    {
      type: 'Money Market',
      balance: 62000,
      cost: 4.5,
      runoffRate: 35,
      lcrFactor: 25,
      optimalBalance: 55000,
      strategy: 'Reduce - High cost, volatile'
    },
    {
      type: 'Time Deposits',
      balance: 25000,
      cost: 4.8,
      runoffRate: 5,
      lcrFactor: 5,
      optimalBalance: 20000,
      strategy: 'Reduce - High cost'
    }
  ]

  const totalDeposits = depositAnalysis.reduce((sum, item) => sum + item.balance, 0)
  const avgDepositCost = depositAnalysis.reduce((sum, item) =>
    sum + (item.balance / totalDeposits) * item.cost, 0
  )

  // Wholesale funding alternatives
  const fundingAlternatives = [
    { source: 'Operating Deposits', cost: 2.85, lcr: true, amount: 415000, capacity: 450000 },
    { source: 'FHLB Advances', cost: 5.10, lcr: false, amount: 15000, capacity: 80000 },
    { source: 'Repo', cost: 5.35, lcr: false, amount: 8000, capacity: 50000 },
    { source: 'CP / CD', cost: 5.25, lcr: false, amount: 12000, capacity: 40000 },
    { source: 'Sub Debt', cost: 6.20, lcr: true, amount: 25000, capacity: 30000 }
  ]

  return (
    <div className="space-y-6">
      {/* Header Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="metric-card">
          <div className="text-sm text-gray-600 mb-1">Current LCR</div>
          <div className="text-2xl font-bold text-gray-900">{currentLCR.toFixed(1)}%</div>
          <div className="text-xs text-amber-500 mt-1">18% above minimum</div>
        </div>
        <div className="metric-card">
          <div className="text-sm text-gray-600 mb-1">Total HQLA</div>
          <div className="text-2xl font-bold text-blue-600">{formatCurrency(totalHQLA / 1000, 1)}B</div>
          <div className="text-xs text-gray-500 mt-1">Eligible for LCR</div>
        </div>
        <div className="metric-card">
          <div className="text-sm text-gray-600 mb-1">Yield Drag</div>
          <div className="text-2xl font-bold text-red-600">{formatCurrency(180, 0)}M</div>
          <div className="text-xs text-red-500 mt-1">Annual opportunity cost</div>
        </div>
        <div className="metric-card">
          <div className="text-sm text-gray-600 mb-1">Optimization Savings</div>
          <div className="text-2xl font-bold text-green-600">{formatCurrency(40, 0)}M</div>
          <div className="text-xs text-green-500 mt-1">From optimized HQLA mix</div>
        </div>
      </div>

      {/* LCR Cost-Benefit Analysis */}
      <div className="metric-card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">LCR Target vs Cost Trade-off</h3>
        <div className="h-80 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={lcrScenarios} margin={{ top: 20, right: 30, left: 60, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="lcr" label={{ value: 'LCR Level (%)', position: 'bottom', offset: 0 }} />
              <YAxis
                yAxisId="left"
                label={{ value: 'Yield Drag ($M)', angle: -90, position: 'insideLeft' }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                label={{ value: 'Liquidity Buffer ($B)', angle: 90, position: 'insideRight' }}
              />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="cost" name="Annual Yield Drag" fill="#ef4444" />
              <Line yAxisId="right" type="monotone" dataKey="buffer" name="Buffer Size" stroke="#10b981" strokeWidth={2} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-5 gap-3">
          {lcrScenarios.map((scenario, idx) => (
            <div key={idx} className={`p-3 rounded-lg border ${
              scenario.lcr === 120 ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
            }`}>
              <div className="text-xs text-gray-600">LCR {scenario.lcr}%</div>
              <div className="text-lg font-bold text-gray-900">${scenario.cost}M</div>
              <div className="text-xs text-gray-500 mt-1">Annual drag</div>
              <div className={`text-xs mt-1 font-medium ${
                scenario.riskLevel === 'High' ? 'text-red-600' :
                scenario.riskLevel === 'Elevated' ? 'text-orange-600' :
                scenario.riskLevel === 'Moderate' ? 'text-yellow-600' :
                'text-green-600'
              }`}>{scenario.riskLevel} Risk</div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-900">
            <strong>Recommendation:</strong> Target 120% LCR provides optimal balance between liquidity safety and yield.
            Each 10% LCR above 120% costs approximately $45M annually in forgone yield while providing diminishing risk reduction benefit.
          </p>
        </div>
      </div>

      {/* HQLA Mix Optimization */}
      <div className="metric-card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">HQLA Mix Optimization Scenarios</h3>
        <div className="overflow-x-auto mb-4">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Scenario</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Level 1 %</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Level 2A %</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Level 2B %</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Avg Yield</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Yield Drag</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">LCR</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Risk Score</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {hqlaMixScenarios.map((scenario, idx) => (
                <tr key={idx} className={`hover:bg-gray-50 ${
                  scenario.scenario === 'Optimized' ? 'bg-green-50' : ''
                }`}>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{scenario.scenario}</td>
                  <td className="px-4 py-3 text-sm text-right">{scenario.level1Pct.toFixed(1)}%</td>
                  <td className="px-4 py-3 text-sm text-right">{scenario.level2APct.toFixed(1)}%</td>
                  <td className="px-4 py-3 text-sm text-right">{scenario.level2BPct.toFixed(1)}%</td>
                  <td className="px-4 py-3 text-sm text-right font-medium">{scenario.avgYield.toFixed(2)}%</td>
                  <td className="px-4 py-3 text-sm text-right text-red-600">${scenario.yieldDrag}M</td>
                  <td className="px-4 py-3 text-sm text-right font-medium">{scenario.lcr}%</td>
                  <td className="px-4 py-3 text-sm text-right">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                      scenario.riskScore >= 70 ? 'bg-green-100 text-green-800' :
                      scenario.riskScore >= 60 ? 'bg-blue-100 text-blue-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {scenario.riskScore}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {hqlaComposition.map((level, idx) => (
            <div key={idx} className="p-4 border border-gray-200 rounded-lg">
              <div className="text-sm font-semibold text-gray-900 mb-2">{level.level}</div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600">Balance:</span>
                  <span className="font-medium">{formatCurrency(level.balance / 1000, 1)}B</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Haircut:</span>
                  <span className="font-medium">{level.haircut}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Eligible:</span>
                  <span className="font-medium">{formatCurrency(level.eligible / 1000, 1)}B</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Yield:</span>
                  <span className="font-medium text-blue-600">{level.yield.toFixed(2)}%</span>
                </div>
              </div>
              <div className="mt-2 pt-2 border-t border-gray-200 text-xs text-gray-600">
                {level.description}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Deposit Composition Optimization */}
      <div className="metric-card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Deposit Strategy Optimization</h3>
        <div className="mb-4 grid grid-cols-3 gap-4">
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="text-xs text-blue-700">Total Deposits</div>
            <div className="text-xl font-bold text-blue-900">{formatCurrency(totalDeposits / 1000, 1)}B</div>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <div className="text-xs text-green-700">Avg Cost of Deposits</div>
            <div className="text-xl font-bold text-green-900">{avgDepositCost.toFixed(2)}%</div>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg">
            <div className="text-xs text-purple-700">Non-Interest Bearing %</div>
            <div className="text-xl font-bold text-purple-900">{((195000 / totalDeposits) * 100).toFixed(1)}%</div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Deposit Type</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Balance</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Cost</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Runoff Rate</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">LCR Factor</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Optimal</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Strategy</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {depositAnalysis.map((deposit, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{deposit.type}</td>
                  <td className="px-4 py-3 text-sm text-right">{formatCurrency(deposit.balance / 1000, 1)}B</td>
                  <td className="px-4 py-3 text-sm text-right">{deposit.cost.toFixed(2)}%</td>
                  <td className="px-4 py-3 text-sm text-right">{deposit.runoffRate}%</td>
                  <td className="px-4 py-3 text-sm text-right">{deposit.lcrFactor}%</td>
                  <td className="px-4 py-3 text-sm text-right font-medium">
                    {formatCurrency(deposit.optimalBalance / 1000, 1)}B
                    <span className={`ml-1 text-xs ${
                      deposit.optimalBalance > deposit.balance ? 'text-green-600' :
                      deposit.optimalBalance < deposit.balance ? 'text-red-600' :
                      'text-gray-600'
                    }`}>
                      ({deposit.optimalBalance > deposit.balance ? '+' : ''}{formatCurrency((deposit.optimalBalance - deposit.balance) / 1000, 1)}B)
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">{deposit.strategy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
          <h4 className="text-sm font-semibold text-green-900 mb-2">Deposit Mix Optimization Impact</h4>
          <p className="text-sm text-green-800">
            Reducing Money Market deposits by $7B and growing low-cost DDA by $7B would save <strong>$126M annually</strong>
            (2.7% cost reduction from 4.5% to 1.8%) while improving LCR stability.
            Strategy: Offer enhanced cash management services to attract operating deposits.
          </p>
        </div>
      </div>

      {/* Wholesale Funding Analysis */}
      <div className="metric-card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Wholesale Funding Alternatives</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Funding Source</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Cost</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">LCR Benefit</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Current</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Capacity</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Headroom</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {fundingAlternatives.map((funding, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{funding.source}</td>
                  <td className="px-4 py-3 text-sm text-right">{funding.cost.toFixed(2)}%</td>
                  <td className="px-4 py-3 text-center">
                    {funding.lcr ? (
                      <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Yes
                      </span>
                    ) : (
                      <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        No
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-right">{formatCurrency(funding.amount / 1000, 1)}B</td>
                  <td className="px-4 py-3 text-sm text-right">{formatCurrency(funding.capacity / 1000, 1)}B</td>
                  <td className="px-4 py-3 text-sm text-right font-medium text-blue-600">
                    {formatCurrency((funding.capacity - funding.amount) / 1000, 1)}B
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-900">
            <strong>Analysis:</strong> Operating deposits at 2.85% cost provide best economics and LCR benefit.
            FHLB capacity of $65B remains available as contingent liquidity. Avoid expensive wholesale funding (repo 5.35%, CP 5.25%)
            unless required for strategic balance sheet growth.
          </p>
        </div>
      </div>
    </div>
  )
}
