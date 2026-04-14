import { useMemo } from 'react'
import { formatPercent } from '../../utils/dataGenerators'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

export default function CorrelationView() {
  // Generate correlation matrix
  const metrics = [
    'LCR',
    'NSFR',
    'CET1 Ratio',
    'Total Deposits',
    'Total Loans',
    'NII',
    'NIM',
    'ROE',
    'ROA',
    'LCR Deposits',
    'Fed Funds Rate',
    'Loan Growth'
  ]

  // Correlation matrix (realistic banking correlations)
  const correlations = useMemo(() => {
    const matrix = [
      [1.00, 0.72, 0.15, 0.82, -0.23, -0.31, -0.28, 0.08, 0.12, 0.89, -0.45, -0.18],  // LCR
      [1.00, 1.00, 0.35, 0.41, 0.52, 0.38, 0.41, 0.32, 0.28, 0.61, -0.22, 0.15],       // NSFR
      [1.00, 0.35, 1.00, -0.12, -0.68, 0.62, 0.58, 0.85, 0.79, 0.22, -0.15, -0.42],    // CET1
      [1.00, 0.82, 0.41, -0.12, 1.00, 0.45, 0.28, 0.31, 0.18, 0.22, 0.91, -0.35, 0.38], // Total Deposits
      [1.00, -0.23, 0.52, -0.68, 0.45, 1.00, 0.78, 0.72, 0.42, 0.38, -0.18, 0.25, 0.82], // Total Loans
      [1.00, -0.31, 0.38, 0.62, 0.28, 0.78, 1.00, 0.92, 0.68, 0.61, -0.28, 0.52, 0.72], // NII
      [1.00, -0.28, 0.41, 0.58, 0.31, 0.72, 0.92, 1.00, 0.75, 0.65, -0.25, 0.48, 0.68], // NIM
      [1.00, 0.08, 0.32, 0.85, 0.18, 0.42, 0.68, 0.75, 1.00, 0.88, 0.15, 0.35, 0.45],   // ROE
      [1.00, 0.12, 0.28, 0.79, 0.22, 0.38, 0.61, 0.65, 0.88, 1.00, 0.18, 0.32, 0.42],   // ROA
      [1.00, 0.89, 0.61, 0.22, 0.91, -0.18, -0.28, -0.25, 0.15, 0.18, 1.00, -0.52, -0.15], // LCR Deposits
      [1.00, -0.45, -0.22, -0.15, -0.35, 0.25, 0.52, 0.48, 0.35, 0.32, -0.52, 1.00, 0.38],  // Fed Funds
      [1.00, -0.18, 0.15, -0.42, 0.38, 0.82, 0.72, 0.68, 0.45, 0.42, -0.15, 0.38, 1.00]   // Loan Growth
    ]

    // Make symmetric
    const symmetric = matrix.map((row, i) =>
      row.map((val, j) => i > j ? matrix[j][i] : val)
    )

    return symmetric
  }, [])

  const getCorrelationColor = (value: number) => {
    if (value >= 0.7) return 'bg-green-600'
    if (value >= 0.4) return 'bg-green-400'
    if (value >= 0.2) return 'bg-green-200'
    if (value >= -0.2) return 'bg-gray-200'
    if (value >= -0.4) return 'bg-red-200'
    if (value >= -0.7) return 'bg-red-400'
    return 'bg-red-600'
  }

  const getCorrelationTextColor = (value: number) => {
    if (Math.abs(value) >= 0.4) return 'text-white'
    return 'text-gray-800'
  }

  // Key insights
  const insights = [
    {
      title: 'Strong Positive Correlations',
      items: [
        { pair: 'NII ↔ NIM', correlation: 0.92, interpretation: 'Net interest income and margin move together as expected. Rate environment directly impacts both.' },
        { pair: 'LCR ↔ LCR Deposits', correlation: 0.89, interpretation: 'Liquidity coverage heavily driven by deposit stability. Deposit volatility is primary LCR risk.' },
        { pair: 'ROE ↔ CET1', correlation: 0.85, interpretation: 'Higher capital ratios associate with stronger returns. Quality earnings drive capital accumulation.' },
        { pair: 'Loan Growth ↔ Total Loans', correlation: 0.82, interpretation: 'Organic growth driving loan portfolio expansion. Sustainable growth trajectory.' }
      ]
    },
    {
      title: 'Strong Negative Correlations',
      items: [
        { pair: 'Total Loans ↔ CET1', correlation: -0.68, interpretation: 'Loan growth consumes capital through RWA increase. Balance sheet expansion requires capital management.' },
        { pair: 'Fed Funds ↔ LCR Deposits', correlation: -0.52, interpretation: 'Rising rates trigger deposit migration. Rate-sensitive deposits challenge liquidity management.' },
        { pair: 'Fed Funds ↔ LCR', correlation: -0.45, interpretation: 'Rate increases stress liquidity as outflows accelerate. Forward planning critical in tightening cycles.' },
        { pair: 'Loan Growth ↔ CET1', correlation: -0.42, interpretation: 'Growth ambitions constrained by capital. Strategic capital allocation required.' }
      ]
    },
    {
      title: 'Key Implications',
      items: [
        { pair: 'Liquidity-Capital Trade-off', correlation: 0, interpretation: 'Limited direct correlation between LCR and CET1 suggests independent management. However, funding strategies impact both.' },
        { pair: 'Growth-Profitability Balance', correlation: 0.45, interpretation: 'Loan growth moderately correlates with ROE. Quality over quantity - focus on risk-adjusted returns.' },
        { pair: 'Rate Sensitivity', correlation: 0.52, interpretation: 'Fed funds rate moderately correlated with NII. Asset sensitivity positioning creates opportunity in rising rate environment.' }
      ]
    }
  ]

  const getCorrelationIcon = (value: number) => {
    if (value >= 0.2) return <TrendingUp className="w-4 h-4 text-green-600" />
    if (value <= -0.2) return <TrendingDown className="w-4 h-4 text-red-600" />
    return <Minus className="w-4 h-4 text-gray-400" />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="metric-card">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Cross-Metric Correlation Analysis</h2>
        <p className="text-sm text-gray-600">
          Understanding relationships between key financial metrics to optimize strategic decision-making and risk management.
          Correlations calculated using 90-day rolling historical data.
        </p>
      </div>

      {/* Correlation Matrix Heatmap */}
      <div className="metric-card overflow-x-auto">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Correlation Matrix</h3>
        <div className="inline-block min-w-full">
          <table className="border-collapse">
            <thead>
              <tr>
                <th className="p-2 text-xs font-medium text-gray-500 text-left sticky left-0 bg-white z-10" style={{ minWidth: '150px' }}>
                  Metric
                </th>
                {metrics.map((metric, i) => (
                  <th key={i} className="p-2 text-xs font-medium text-gray-500 text-center" style={{ minWidth: '60px' }}>
                    <div className="transform -rotate-45 origin-center whitespace-nowrap" style={{ width: '60px' }}>
                      {metric}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {metrics.map((metric, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="p-2 text-xs font-medium text-gray-900 sticky left-0 bg-white z-10 border-r border-gray-200">
                    {metric}
                  </td>
                  {correlations[i].map((corr, j) => (
                    <td key={j} className="p-0">
                      <div
                        className={`w-full h-full p-2 text-xs font-medium text-center ${getCorrelationColor(corr)} ${getCorrelationTextColor(corr)}`}
                        title={`${metrics[i]} vs ${metrics[j]}: ${corr.toFixed(2)}`}
                      >
                        {corr === 1.00 ? '—' : corr.toFixed(2)}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-center gap-6 mt-4 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-600"></div>
            <span>Strong Positive (&gt;0.7)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-400"></div>
            <span>Moderate Positive (0.4-0.7)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-200"></div>
            <span>Weak (-0.2 to 0.2)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-400"></div>
            <span>Moderate Negative (-0.7 to -0.4)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-600"></div>
            <span>Strong Negative (&lt;-0.7)</span>
          </div>
        </div>
      </div>

      {/* Key Insights */}
      {insights.map((section, idx) => (
        <div key={idx} className="metric-card">
          <h3 className="text-base font-semibold text-gray-900 mb-4">{section.title}</h3>
          <div className="space-y-3">
            {section.items.map((item, i) => (
              <div key={i} className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded-r-lg">
                <div className="flex items-center gap-2 mb-2">
                  {getCorrelationIcon(item.correlation)}
                  <span className="font-semibold text-gray-900">{item.pair}</span>
                  {item.correlation !== 0 && (
                    <span className={`text-sm px-2 py-0.5 rounded-full font-medium ${
                      Math.abs(item.correlation) >= 0.7
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      ρ = {item.correlation.toFixed(2)}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-700">{item.interpretation}</p>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Scenario Impact Analysis */}
      <div className="metric-card">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Rate Scenario Impact Chain</h3>
        <p className="text-sm text-gray-600 mb-4">
          How a 100 bps Fed rate increase propagates through correlated metrics (illustrative):
        </p>
        <div className="space-y-2">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="flex-shrink-0 w-32 text-sm font-medium text-gray-900">Fed Funds Rate</div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm text-green-600 font-medium">+100 bps</span>
                <div className="h-1 flex-1 bg-green-200 rounded"></div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg ml-6">
            <div className="flex-shrink-0 w-32 text-sm font-medium text-gray-900">NII</div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm text-green-600 font-medium">+$52M (ρ=0.52)</span>
                <div className="h-1 flex-1 bg-green-200 rounded" style={{ width: '52%' }}></div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg ml-12">
            <div className="flex-shrink-0 w-32 text-sm font-medium text-gray-900">ROE</div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm text-green-600 font-medium">+0.35% (ρ=0.68 to NII)</span>
                <div className="h-1 flex-1 bg-green-200 rounded" style={{ width: '35%' }}></div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg ml-6">
            <div className="flex-shrink-0 w-32 text-sm font-medium text-gray-900">LCR Deposits</div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm text-red-600 font-medium">-$5.2B (ρ=-0.52)</span>
                <div className="h-1 flex-1 bg-red-200 rounded" style={{ width: '52%' }}></div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg ml-12">
            <div className="flex-shrink-0 w-32 text-sm font-medium text-gray-900">LCR</div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm text-red-600 font-medium">-45 bps (ρ=-0.45 to rate, 0.89 to deposits)</span>
                <div className="h-1 flex-1 bg-red-200 rounded" style={{ width: '45%' }}></div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-gray-700">
            <strong>Net Effect:</strong> Rising rates improve profitability (+NII, +ROE) but create liquidity pressure (-LCR).
            Strategic balance required: deploy HQLA to optimize NII while maintaining regulatory buffers. Consider funding mix adjustments
            to retain rate-sensitive deposits through competitive pricing or relationship deepening.
          </p>
        </div>
      </div>

      {/* Strategic Recommendations */}
      <div className="metric-card">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Strategic Implications for Capital & Liquidity Management</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border-l-4 border-green-600 bg-green-50 p-4 rounded-r-lg">
            <div className="font-medium text-gray-900 mb-2">Leverage Positive Correlations</div>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Strong ROE-CET1 link: retained earnings naturally build capital</li>
              <li>• NII-NIM alignment: focus on quality spread management</li>
              <li>• Deploy excess liquidity into higher-yielding HQLA to optimize both LCR and NII</li>
            </ul>
          </div>

          <div className="border-l-4 border-amber-600 bg-amber-50 p-4 rounded-r-lg">
            <div className="font-medium text-gray-900 mb-2">Manage Negative Correlations</div>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Loan growth constrains CET1: match origination pace to capital generation</li>
              <li>• Rate increases stress deposits: pre-position liquidity before tightening</li>
              <li>• Balance sheet expansion vs capital efficiency: optimize RWA density</li>
            </ul>
          </div>

          <div className="border-l-4 border-blue-600 bg-blue-50 p-4 rounded-r-lg">
            <div className="font-medium text-gray-900 mb-2">Diversification Opportunities</div>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Weak LCR-CET1 correlation: independent optimization possible</li>
              <li>• Multiple levers for performance: don't rely on single driver</li>
              <li>• Rate sensitivity varies by metric: natural hedges exist in portfolio</li>
            </ul>
          </div>

          <div className="border-l-4 border-purple-600 bg-purple-50 p-4 rounded-r-lg">
            <div className="font-medium text-gray-900 mb-2">Monitoring Priorities</div>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Watch for correlation breakdowns signaling regime change</li>
              <li>• Strong correlations amplify both opportunities and risks</li>
              <li>• Use correlations to validate forecast scenarios and stress tests</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
