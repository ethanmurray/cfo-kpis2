import { formatCurrency, formatPercent } from '../../utils/dataGenerators'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ScatterChart, Scatter, Cell } from 'recharts'

export default function CapitalDeployment() {
  const currentCET1 = 10.8
  const targetCET1 = 9.5
  const availableCapital = (currentCET1 - targetCET1) * 6.5 // $B, at $650B RWA

  // Capital deployment alternatives
  const deploymentOptions = [
    {
      option: 'Organic Growth - Expand Lending',
      capitalRequired: 2.5,
      expectedReturn: 8.5,
      rwaGenerated: 18.5,
      timeToReturn: 18,
      riskScore: 55,
      roic: 8.5,
      irr: 12.2,
      strategic: 75,
      description: 'Grow commercial lending book with high-quality corporate relationships'
    },
    {
      option: 'Share Buybacks',
      capitalRequired: 3.0,
      expectedReturn: 11.2,
      rwaGenerated: 0,
      timeToReturn: 0,
      riskScore: 25,
      roic: 11.2,
      irr: 11.2,
      strategic: 40,
      description: 'Repurchase shares at current P/TBV of 0.68x (below intrinsic value)'
    },
    {
      option: 'Increase Dividend',
      capitalRequired: 1.2,
      expectedReturn: 0,
      rwaGenerated: 0,
      timeToReturn: 0,
      riskScore: 15,
      roic: 0,
      irr: 0,
      strategic: 50,
      description: 'Raise quarterly dividend from $0.75 to $0.90 per share (+20%)'
    },
    {
      option: 'Acquire Mid-Tier Custody Bank',
      capitalRequired: 5.5,
      expectedReturn: 14.5,
      rwaGenerated: 32.0,
      timeToReturn: 36,
      riskScore: 80,
      roic: 14.5,
      irr: 18.8,
      strategic: 95,
      description: 'M&A target: $125B AUC, expand West Coast presence, cost synergies'
    },
    {
      option: 'Technology Investment',
      capitalRequired: 1.8,
      expectedReturn: 16.2,
      rwaGenerated: 2.5,
      timeToReturn: 24,
      riskScore: 65,
      roic: 16.2,
      irr: 15.5,
      strategic: 85,
      description: 'AI/ML platform, digital onboarding, blockchain custody capabilities'
    },
    {
      option: 'Debt Paydown',
      capitalRequired: 2.0,
      expectedReturn: 5.8,
      rwaGenerated: -4.0,
      timeToReturn: 0,
      riskScore: 10,
      roic: 5.8,
      irr: 5.8,
      strategic: 30,
      description: 'Repay $2B senior unsecured debt, reduce interest expense by $116M'
    }
  ]

  // ROE impact analysis
  const roeImpactAnalysis = [
    {
      scenario: 'Base Case (No Action)',
      netIncome: 6850,
      totalEquity: 63500,
      roe: 10.8,
      cet1: 10.8,
      description: 'Maintain current capital levels'
    },
    {
      scenario: 'Buyback $3B',
      netIncome: 6850,
      totalEquity: 60500,
      roe: 11.3,
      cet1: 10.3,
      description: 'EPS accretion, lower equity base'
    },
    {
      scenario: 'Organic Growth $2.5B',
      netIncome: 7063,
      totalEquity: 61000,
      roe: 11.6,
      cet1: 10.5,
      description: 'Deploy into 8.5% return assets'
    },
    {
      scenario: 'M&A $5.5B',
      netIncome: 7648,
      totalEquity: 58000,
      roe: 13.2,
      cet1: 9.8,
      description: 'Strategic acquisition with synergies'
    },
    {
      scenario: 'Balanced Mix',
      netIncome: 7124,
      totalEquity: 60800,
      roe: 11.7,
      cet1: 10.4,
      description: '$2B buyback + $1.8B tech + $1.2B dividend'
    }
  ]

  // Stress test impact on capital deployment
  const stressScenarios = [
    {
      scenario: 'Base Case',
      cet1Start: 10.8,
      lossesNI: 0,
      rwaInflation: 0,
      cet1End: 10.8,
      buffer: 1.3
    },
    {
      scenario: 'Moderate Stress',
      cet1Start: 10.8,
      lossesNI: -850,
      rwaInflation: 8,
      cet1End: 9.5,
      buffer: 0.0
    },
    {
      scenario: 'Severe Stress',
      cet1Start: 10.8,
      lossesNI: -1850,
      rwaInflation: 15,
      cet1End: 8.2,
      buffer: -1.3
    }
  ]

  // Multi-criteria scoring
  const criteriaWeights = {
    returnOnCapital: 30,
    strategicFit: 25,
    riskAdjusted: 20,
    executionSpeed: 15,
    capitalEfficiency: 10
  }

  const scoredOptions = deploymentOptions.map(option => {
    const scores = {
      returnOnCapital: (option.roic / 20) * 100,
      strategicFit: option.strategic,
      riskAdjusted: 100 - option.riskScore,
      executionSpeed: option.timeToReturn === 0 ? 100 : Math.max(0, 100 - (option.timeToReturn / 36) * 100),
      capitalEfficiency: option.rwaGenerated <= 0 ? 100 : Math.max(0, 100 - (option.rwaGenerated / 50) * 100)
    }

    const weightedScore =
      (scores.returnOnCapital * criteriaWeights.returnOnCapital +
       scores.strategicFit * criteriaWeights.strategicFit +
       scores.riskAdjusted * criteriaWeights.riskAdjusted +
       scores.executionSpeed * criteriaWeights.executionSpeed +
       scores.capitalEfficiency * criteriaWeights.capitalEfficiency) / 100

    return { ...option, scores, weightedScore }
  }).sort((a, b) => b.weightedScore - a.weightedScore)

  // Capital allocation timeline
  const allocationTimeline = [
    { quarter: 'Q2 24', dividends: 450, buybacks: 0, organic: 0, other: 0 },
    { quarter: 'Q3 24', dividends: 450, buybacks: 800, organic: 300, other: 0 },
    { quarter: 'Q4 24', dividends: 540, buybacks: 1200, organic: 400, other: 300 },
    { quarter: 'Q1 25', dividends: 540, buybacks: 1000, organic: 600, other: 500 },
    { quarter: 'Q2 25E', dividends: 540, buybacks: 0, organic: 1200, other: 1000 },
    { quarter: 'Q3 25E', dividends: 540, buybacks: 0, organic: 0, other: 3700 }
  ]

  return (
    <div className="space-y-6">
      {/* Header Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="metric-card">
          <div className="text-sm text-gray-600 mb-1">Current CET1</div>
          <div className="text-2xl font-bold text-gray-900">{currentCET1.toFixed(1)}%</div>
          <div className="text-xs text-green-500 mt-1">+130 bps above target</div>
        </div>
        <div className="metric-card">
          <div className="text-sm text-gray-600 mb-1">Available Capital</div>
          <div className="text-2xl font-bold text-blue-600">{formatCurrency(availableCapital, 1)}B</div>
          <div className="text-xs text-gray-500 mt-1">For deployment</div>
        </div>
        <div className="metric-card">
          <div className="text-sm text-gray-600 mb-1">Current ROE</div>
          <div className="text-2xl font-bold text-amber-600">10.8%</div>
          <div className="text-xs text-amber-500 mt-1">Target: 15.0%</div>
        </div>
        <div className="metric-card">
          <div className="text-sm text-gray-600 mb-1">Optimal Deployment IRR</div>
          <div className="text-2xl font-bold text-green-600">18.8%</div>
          <div className="text-xs text-green-500 mt-1">M&A opportunity</div>
        </div>
      </div>

      {/* Capital Deployment Options - Scored Ranking */}
      <div className="metric-card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Capital Deployment Decision Matrix</h3>
        <div className="overflow-x-auto mb-4">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Option</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Capital</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">ROIC</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">IRR</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">RWA Impact</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Risk</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Strategic</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Score</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {scoredOptions.map((option, idx) => (
                <tr key={idx} className={`hover:bg-gray-50 ${idx === 0 ? 'bg-green-50' : ''}`}>
                  <td className="px-4 py-3 text-sm">
                    <div className="font-medium text-gray-900">{option.option}</div>
                    <div className="text-xs text-gray-600">{option.description}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-right font-medium">{formatCurrency(option.capitalRequired, 1)}B</td>
                  <td className="px-4 py-3 text-sm text-right font-semibold text-blue-600">
                    {option.roic > 0 ? `${option.roic.toFixed(1)}%` : 'N/A'}
                  </td>
                  <td className="px-4 py-3 text-sm text-right font-semibold text-green-600">
                    {option.irr > 0 ? `${option.irr.toFixed(1)}%` : 'N/A'}
                  </td>
                  <td className="px-4 py-3 text-sm text-right">
                    <span className={`font-medium ${
                      option.rwaGenerated > 0 ? 'text-red-600' :
                      option.rwaGenerated < 0 ? 'text-green-600' :
                      'text-gray-600'
                    }`}>
                      {option.rwaGenerated > 0 ? '+' : ''}{formatCurrency(option.rwaGenerated, 1)}B
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-right">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                      option.riskScore < 30 ? 'bg-green-100 text-green-800' :
                      option.riskScore < 60 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {option.riskScore}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-right">{option.strategic}/100</td>
                  <td className="px-4 py-3 text-sm text-right">
                    <div className="font-bold text-lg text-gray-900">{option.weightedScore.toFixed(0)}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="grid grid-cols-5 gap-4 mb-4">
          <div className="p-3 bg-blue-50 rounded-lg text-center">
            <div className="text-xs text-blue-700">Return on Capital</div>
            <div className="text-lg font-bold text-blue-900">30%</div>
            <div className="text-xs text-blue-600">Weight</div>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg text-center">
            <div className="text-xs text-purple-700">Strategic Fit</div>
            <div className="text-lg font-bold text-purple-900">25%</div>
            <div className="text-xs text-purple-600">Weight</div>
          </div>
          <div className="p-3 bg-green-50 rounded-lg text-center">
            <div className="text-xs text-green-700">Risk Adjusted</div>
            <div className="text-lg font-bold text-green-900">20%</div>
            <div className="text-xs text-green-600">Weight</div>
          </div>
          <div className="p-3 bg-orange-50 rounded-lg text-center">
            <div className="text-xs text-orange-700">Execution Speed</div>
            <div className="text-lg font-bold text-orange-900">15%</div>
            <div className="text-xs text-orange-600">Weight</div>
          </div>
          <div className="p-3 bg-pink-50 rounded-lg text-center">
            <div className="text-xs text-pink-700">Capital Efficiency</div>
            <div className="text-lg font-bold text-pink-900">10%</div>
            <div className="text-xs text-pink-600">Weight</div>
          </div>
        </div>
      </div>

      {/* ROE Impact Scenarios */}
      <div className="metric-card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Capital Deployment Impact on ROE</h3>
        <div className="h-80 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 30, bottom: 60, left: 60 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                type="number"
                dataKey="cet1"
                name="CET1 Ratio"
                label={{ value: 'CET1 Ratio (%)', position: 'bottom', offset: 40 }}
                domain={[9.5, 11]}
              />
              <YAxis
                type="number"
                dataKey="roe"
                name="ROE"
                label={{ value: 'ROE (%)', angle: -90, position: 'left', offset: 40 }}
                domain={[10, 14]}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload
                    return (
                      <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
                        <p className="font-semibold text-gray-900">{data.scenario}</p>
                        <p className="text-sm text-gray-600">{data.description}</p>
                        <p className="text-sm text-blue-600">ROE: {data.roe.toFixed(1)}%</p>
                        <p className="text-sm text-green-600">CET1: {data.cet1.toFixed(1)}%</p>
                        <p className="text-sm text-gray-600">Net Income: {formatCurrency(data.netIncome, 0)}M</p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Scatter data={roeImpactAnalysis} fill="#3b82f6">
                {roeImpactAnalysis.map((entry, index) => {
                  const colors = ['#9ca3af', '#f59e0b', '#3b82f6', '#10b981', '#8b5cf6']
                  return <Cell key={`cell-${index}`} fill={colors[index]} />
                })}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {roeImpactAnalysis.map((scenario, idx) => (
            <div key={idx} className={`p-4 rounded-lg border-2 ${
              scenario.scenario === 'M&A $5.5B' ? 'border-green-500 bg-green-50' :
              scenario.scenario === 'Balanced Mix' ? 'border-purple-500 bg-purple-50' :
              'border-gray-200'
            }`}>
              <div className="text-sm font-semibold text-gray-900 mb-2">{scenario.scenario}</div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600">ROE:</span>
                  <span className="font-bold text-blue-600">{scenario.roe.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">CET1:</span>
                  <span className="font-medium">{scenario.cet1.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">NI:</span>
                  <span className="font-medium">{formatCurrency(scenario.netIncome, 0)}M</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
          <p className="text-sm text-green-900">
            <strong>Optimal Scenario:</strong> M&A delivers 13.2% ROE (+2.4% improvement) with acceptable CET1 of 9.8% (still 30 bps above target).
            Strategic acquisition provides both financial returns and market position enhancement.
            Balanced approach (buyback + tech + dividend) achieves 11.7% ROE with less risk.
          </p>
        </div>
      </div>

      {/* Stress Test Considerations */}
      <div className="metric-card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Capital Deployment Under Stress</h3>
        <div className="overflow-x-auto mb-4">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stress Scenario</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Starting CET1</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Credit Losses</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">RWA Inflation</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ending CET1</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Buffer vs Min</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stressScenarios.map((scenario, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{scenario.scenario}</td>
                  <td className="px-4 py-3 text-sm text-right">{scenario.cet1Start.toFixed(1)}%</td>
                  <td className="px-4 py-3 text-sm text-right text-red-600">
                    {scenario.lossesNI !== 0 ? formatCurrency(scenario.lossesNI, 0) + 'M' : '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-right">
                    {scenario.rwaInflation > 0 ? `+${scenario.rwaInflation}%` : '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-right font-bold">{scenario.cet1End.toFixed(1)}%</td>
                  <td className="px-4 py-3 text-sm text-right">
                    <span className={`font-semibold ${
                      scenario.buffer > 0.5 ? 'text-green-600' :
                      scenario.buffer >= 0 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {scenario.buffer > 0 ? '+' : ''}{scenario.buffer.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                      scenario.buffer > 0.5 ? 'bg-green-100 text-green-800' :
                      scenario.buffer >= 0 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {scenario.buffer > 0.5 ? 'Pass' : scenario.buffer >= 0 ? 'Marginal' : 'Fail'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-red-900 mb-1">Stress Test Constraint</h4>
              <p className="text-sm text-red-800">
                Severe stress would breach minimum CET1. Maximum prudent capital deployment is <strong>$5B</strong>
                (keeping post-stress CET1 above 9.5%). Retain $3.5B buffer for stress resilience.
                Stress scenarios assume: 2-year severe recession, 40% equity decline, 20% corporate bond spread widening, 5% loan loss rate.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Strategy */}
      <div className="metric-card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommended Capital Allocation Strategy</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border-2 border-green-500">
            <div className="text-sm font-semibold text-green-900 mb-2">Priority 1: Strategic M&A</div>
            <div className="text-3xl font-bold text-green-600 mb-2">$5.5B</div>
            <div className="text-sm text-green-800 space-y-1">
              <p>• Acquire mid-tier custody bank</p>
              <p>• 18.8% IRR, 14.5% ROIC</p>
              <p>• Expand West Coast presence</p>
              <p>• $798M NI accretion (yr 3)</p>
            </div>
          </div>
          <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border-2 border-blue-500">
            <div className="text-sm font-semibold text-blue-900 mb-2">Priority 2: Technology</div>
            <div className="text-3xl font-bold text-blue-600 mb-2">$1.8B</div>
            <div className="text-sm text-blue-800 space-y-1">
              <p>• AI/ML analytics platform</p>
              <p>• Digital client onboarding</p>
              <p>• 16.2% ROIC, 15.5% IRR</p>
              <p>• Improve efficiency ratio 3-5%</p>
            </div>
          </div>
          <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border-2 border-purple-500">
            <div className="text-sm font-semibold text-purple-900 mb-2">Priority 3: Shareholder Return</div>
            <div className="text-3xl font-bold text-purple-600 mb-2">$1.2B</div>
            <div className="text-sm text-purple-800 space-y-1">
              <p>• Raise dividend 20%</p>
              <p>• $0.75 → $0.90 per share</p>
              <p>• Maintain progressive policy</p>
              <p>• Signal confidence to market</p>
            </div>
          </div>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">3-Year Deployment Plan</h4>
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="text-sm font-medium text-gray-700 w-24">2024 H2:</div>
              <div className="text-sm text-gray-900">Begin M&A due diligence, initiate technology RFP, announce dividend increase ($1.2B deployed)</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm font-medium text-gray-700 w-24">2025:</div>
              <div className="text-sm text-gray-900">Close acquisition Q2 ($5.5B), deploy technology capital ($1.8B), maintain elevated dividend</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm font-medium text-gray-700 w-24">2026:</div>
              <div className="text-sm text-gray-900">Integration synergies realized, technology platform launched, reassess capital position for potential buyback</div>
            </div>
          </div>
        </div>
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-900">
            <strong>Expected Outcomes by 2027:</strong> ROE improves from 10.8% to 13.5-14.0%.
            AUC grows from $12.5T to $14.8T (+18%). Cost/income ratio improves from 68% to 63%.
            CET1 stabilizes at 10.0-10.5% (healthy buffer). EPS compounds at 11-13% CAGR.
          </p>
        </div>
      </div>
    </div>
  )
}
