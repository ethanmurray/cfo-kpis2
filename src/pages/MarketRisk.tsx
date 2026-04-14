import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/Tabs'
import ScoreboardView from '../components/peer/ScoreboardView'
import TrendsView from '../components/peer/TrendsView'
import ValuationView from '../components/peer/ValuationView'
import CompactMetricCard from '../components/CompactMetricCard'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'
import { useClientStore } from '../stores/clientStore'

export default function MarketRisk() {
  const config = useClientStore((s) => s.config)
  // Risk metrics
  const riskMetrics = {
    credit: { var95: 285, var99: 412, expectedLoss: 125, rwa: 42500, npl: 0.8, coverage: 145 },
    market: { var95: 142, var99: 205, expectedLoss: 52, rwa: 18200, tradingVar: 38, irrbb: 215 },
    operational: { var95: 98, var99: 165, expectedLoss: 42, rwa: 28500, incidents: 12, severity: 2.8 },
    liquidity: { lcr: 142, nsfr: 118, hqla: 45500, outflows30d: 32100, inflows30d: 45600 }
  }

  // Compliance metrics
  const complianceMetrics = [
    { category: 'AML/KYC', alerts: 285, investigations: 42, breaches: 0, rating: 'Strong' },
    { category: 'Market Conduct', alerts: 128, investigations: 18, breaches: 1, rating: 'Adequate' },
    { category: 'Data Privacy', alerts: 95, investigations: 12, breaches: 0, rating: 'Strong' },
    { category: 'Sanctions', alerts: 456, investigations: 68, breaches: 0, rating: 'Strong' },
    { category: 'Securities Regulations', alerts: 178, investigations: 25, breaches: 2, rating: 'Needs Improvement' },
  ]

  // Risk appetite framework
  const riskAppetite = [
    { metric: 'Credit Risk', actual: 285, limit: 400, utilization: 71, status: 'Green' },
    { metric: 'Market Risk', actual: 142, limit: 200, utilization: 71, status: 'Green' },
    { metric: 'Operational Risk', actual: 98, limit: 150, utilization: 65, status: 'Green' },
    { metric: 'Liquidity (LCR)', actual: 142, limit: 110, utilization: 129, status: 'Green' },
    { metric: 'Capital (CET1)', actual: 11.2, limit: 10.5, utilization: 107, status: 'Green' },
    { metric: 'Concentration', actual: 18.5, limit: 25.0, utilization: 74, status: 'Green' },
  ]

  // Strategic positioning vs peers
  const strategicPosition = [
    { dimension: 'Scale', score: 85 },
    { dimension: 'Profitability', score: 72 },
    { dimension: 'Efficiency', score: 79 },
    { dimension: 'Capital', score: 88 },
    { dimension: 'Liquidity', score: 91 },
    { dimension: 'Growth', score: 68 },
    { dimension: 'Innovation', score: 62 },
    { dimension: 'Risk Mgmt', score: 82 },
  ]

  const getRatingColor = (rating: string) => {
    switch(rating) {
      case 'Strong': return 'bg-green-50 text-green-700 border-green-200'
      case 'Adequate': return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'Needs Improvement': return 'bg-amber-50 text-amber-700 border-amber-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Market Position & Risk</h1>
          <p className="text-sm text-gray-600 mt-1">Peer comparison, strategic positioning, risk metrics, and compliance</p>
        </div>
      </div>

      <Tabs defaultValue="peers">
        <TabsList>
          <TabsTrigger value="peers">Peer Comparison</TabsTrigger>
          <TabsTrigger value="positioning">Strategic Positioning</TabsTrigger>
          <TabsTrigger value="risk">Risk Metrics</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="peers">
          <div className="space-y-4">
            <ScoreboardView />
            <div className="grid grid-cols-2 gap-4 mt-4">
              <TrendsView />
              <ValuationView />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="positioning">
          <div className="space-y-4">
            {/* Strategic Position Radar */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold text-sm mb-3">Strategic Position vs Peer Average (Percentile Scores)</h3>
              <div className="grid grid-cols-2 gap-6">
                <ResponsiveContainer width="100%" height={320}>
                  <RadarChart data={strategicPosition}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="dimension" />
                    <PolarRadiusAxis domain={[0, 100]} />
                    <Radar name={config.shortName} dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                  </RadarChart>
                </ResponsiveContainer>
                <div className="space-y-2">
                  {strategicPosition.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs">
                      <span className="font-medium text-gray-700 w-32">{item.dimension}</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2 mx-3">
                        <div
                          className={`h-2 rounded-full ${item.score >= 80 ? 'bg-green-600' : item.score >= 70 ? 'bg-blue-600' : 'bg-amber-600'}`}
                          style={{ width: `${item.score}%` }}
                        />
                      </div>
                      <span className="font-semibold text-gray-900 w-16 text-right">{item.score}th %ile</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-green-50 rounded">
                  <div className="font-medium text-green-900">Strengths</div>
                  <ul className="mt-1 space-y-1 text-green-800">
                    <li>• Liquidity: 91st percentile</li>
                    <li>• Capital: 88th percentile</li>
                    <li>• Scale: 85th percentile</li>
                  </ul>
                </div>
                <div className="p-3 bg-blue-50 rounded">
                  <div className="font-medium text-blue-900">Competitive</div>
                  <ul className="mt-1 space-y-1 text-blue-800">
                    <li>• Risk Management: 82nd %ile</li>
                    <li>• Efficiency: 79th percentile</li>
                    <li>• Profitability: 72nd percentile</li>
                  </ul>
                </div>
                <div className="p-3 bg-amber-50 rounded">
                  <div className="font-medium text-amber-900">Opportunities</div>
                  <ul className="mt-1 space-y-1 text-amber-800">
                    <li>• Growth: 68th percentile</li>
                    <li>• Innovation: 62nd percentile</li>
                    <li>• Need to accelerate digital</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Competitive Dynamics */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold text-sm mb-3">Competitive Dynamics & Market Share</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-xs text-gray-600 mb-2">US Custody Market Share</div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between p-1.5 bg-gray-50 rounded">
                      <span>BNY Mellon</span>
                      <span className="font-semibold">28.5%</span>
                    </div>
                    <div className="flex justify-between p-1.5 bg-gray-50 rounded">
                      <span>State Street</span>
                      <span className="font-semibold">26.2%</span>
                    </div>
                    <div className="flex justify-between p-1.5 bg-blue-50 rounded border border-blue-200">
                      <span className="font-medium">{config.shortName}</span>
                      <span className="font-bold text-blue-600">18.8%</span>
                    </div>
                    <div className="flex justify-between p-1.5 bg-gray-50 rounded">
                      <span>JP Morgan</span>
                      <span className="font-semibold">15.3%</span>
                    </div>
                    <div className="flex justify-between p-1.5 bg-gray-50 rounded">
                      <span>Others</span>
                      <span className="font-semibold">11.2%</span>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-2">Win/Loss Analysis (YTD)</div>
                  <div className="space-y-2">
                    <div className="p-2 bg-green-50 rounded">
                      <div className="font-medium text-green-900 text-xs">Wins: 18 mandates</div>
                      <div className="text-xs text-green-800">$285B AUM | Avg fee: 9.2bps</div>
                    </div>
                    <div className="p-2 bg-red-50 rounded">
                      <div className="font-medium text-red-900 text-xs">Losses: 8 mandates</div>
                      <div className="text-xs text-red-800">$142B AUM | Lost to pricing</div>
                    </div>
                    <div className="p-2 bg-blue-50 rounded">
                      <div className="font-medium text-blue-900 text-xs">Net: +10 mandates</div>
                      <div className="text-xs text-blue-800">+$143B AUM | 69% win rate</div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-2">Key Differentiators</div>
                  <div className="space-y-1 text-xs">
                    <div className="p-1.5 bg-green-50 rounded flex items-center gap-2">
                      <span className="text-green-600">✓</span>
                      <span>Technology platform</span>
                    </div>
                    <div className="p-1.5 bg-green-50 rounded flex items-center gap-2">
                      <span className="text-green-600">✓</span>
                      <span>Client service ratings</span>
                    </div>
                    <div className="p-1.5 bg-amber-50 rounded flex items-center gap-2">
                      <span className="text-amber-600">~</span>
                      <span>Pricing (88% of market)</span>
                    </div>
                    <div className="p-1.5 bg-amber-50 rounded flex items-center gap-2">
                      <span className="text-amber-600">~</span>
                      <span>Innovation speed</span>
                    </div>
                    <div className="p-1.5 bg-red-50 rounded flex items-center gap-2">
                      <span className="text-red-600">✗</span>
                      <span>Scale in emerging mkts</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="risk">
          <div className="space-y-4">
            {/* Risk Summary */}
            <div className="grid grid-cols-6 gap-3">
              <CompactMetricCard label="Total VaR (99%)" value="$782" unit="M" change={-2.5} status="good" />
              <CompactMetricCard label="Credit RWA" value="$42.5" unit="B" change={1.8} status="neutral" />
              <CompactMetricCard label="Market RWA" value="$18.2" unit="B" change={-0.5} status="good" />
              <CompactMetricCard label="Op Risk RWA" value="$28.5" unit="B" change={2.1} status="neutral" />
              <CompactMetricCard label="NPL Ratio" value="0.8" unit="%" change={-0.1} status="good" />
              <CompactMetricCard label="Risk Incidents" value="12" change={-25} status="good" />
            </div>

            {/* Risk Appetite Framework */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold text-sm mb-3">Risk Appetite Framework - Utilization</h3>
              <table className="min-w-full text-xs">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium text-gray-600">Risk Metric</th>
                    <th className="px-3 py-2 text-right font-medium text-gray-600">Actual</th>
                    <th className="px-3 py-2 text-right font-medium text-gray-600">Limit</th>
                    <th className="px-3 py-2 text-right font-medium text-gray-600">Utilization</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {riskAppetite.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-3 py-2 font-medium text-gray-900">{item.metric}</td>
                      <td className="px-3 py-2 text-right text-gray-900">{item.actual}</td>
                      <td className="px-3 py-2 text-right text-gray-700">{item.limit}</td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                            <div
                              className={`h-1.5 rounded-full ${item.utilization <= 75 ? 'bg-green-600' : item.utilization <= 90 ? 'bg-amber-600' : 'bg-red-600'}`}
                              style={{ width: `${Math.min(item.utilization, 100)}%` }}
                            />
                          </div>
                          <span className="text-xs font-semibold w-10 text-right">{item.utilization}%</span>
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <span className="px-2 py-0.5 text-xs font-medium rounded bg-green-100 text-green-700">
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-3 p-3 bg-green-50 rounded text-xs">
                <div className="font-medium text-green-900">Risk Position Summary</div>
                <div className="text-green-800 mt-1">All risk metrics within approved appetite. Average utilization: 73%. Strong buffers vs regulatory minimums.</div>
              </div>
            </div>

            {/* Risk Detail by Category */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold text-sm mb-3">Risk Exposure by Category ($M)</h3>
              <div className="grid grid-cols-4 gap-3">
                <div className="p-3 border border-gray-200 rounded">
                  <div className="text-xs text-gray-600 mb-2">Credit Risk</div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between"><span>VaR 95%:</span><span className="font-semibold">$285M</span></div>
                    <div className="flex justify-between"><span>VaR 99%:</span><span className="font-semibold">$412M</span></div>
                    <div className="flex justify-between"><span>Expected Loss:</span><span className="font-semibold">$125M</span></div>
                    <div className="flex justify-between"><span>RWA:</span><span className="font-semibold">$42.5B</span></div>
                    <div className="flex justify-between"><span>NPL Ratio:</span><span className="font-semibold">0.8%</span></div>
                  </div>
                </div>
                <div className="p-3 border border-gray-200 rounded">
                  <div className="text-xs text-gray-600 mb-2">Market Risk</div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between"><span>VaR 95%:</span><span className="font-semibold">$142M</span></div>
                    <div className="flex justify-between"><span>VaR 99%:</span><span className="font-semibold">$205M</span></div>
                    <div className="flex justify-between"><span>Expected Loss:</span><span className="font-semibold">$52M</span></div>
                    <div className="flex justify-between"><span>RWA:</span><span className="font-semibold">$18.2B</span></div>
                    <div className="flex justify-between"><span>Trading VaR:</span><span className="font-semibold">$38M</span></div>
                  </div>
                </div>
                <div className="p-3 border border-gray-200 rounded">
                  <div className="text-xs text-gray-600 mb-2">Operational Risk</div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between"><span>VaR 95%:</span><span className="font-semibold">$98M</span></div>
                    <div className="flex justify-between"><span>VaR 99%:</span><span className="font-semibold">$165M</span></div>
                    <div className="flex justify-between"><span>Expected Loss:</span><span className="font-semibold">$42M</span></div>
                    <div className="flex justify-between"><span>RWA:</span><span className="font-semibold">$28.5B</span></div>
                    <div className="flex justify-between"><span>Incidents:</span><span className="font-semibold">12 YTD</span></div>
                  </div>
                </div>
                <div className="p-3 border border-gray-200 rounded">
                  <div className="text-xs text-gray-600 mb-2">Liquidity Risk</div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between"><span>LCR:</span><span className="font-semibold">142%</span></div>
                    <div className="flex justify-between"><span>NSFR:</span><span className="font-semibold">118%</span></div>
                    <div className="flex justify-between"><span>HQLA:</span><span className="font-semibold">$45.5B</span></div>
                    <div className="flex justify-between"><span>30d Outflows:</span><span className="font-semibold">$32.1B</span></div>
                    <div className="flex justify-between"><span>30d Inflows:</span><span className="font-semibold">$45.6B</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="compliance">
          <div className="space-y-4">
            {/* Compliance Summary */}
            <div className="grid grid-cols-6 gap-3">
              <CompactMetricCard label="Total Alerts" value="1,142" change={-15} status="good" />
              <CompactMetricCard label="Investigations" value="165" change={-8} status="good" />
              <CompactMetricCard label="Breaches" value="3" change={-40} status="good" />
              <CompactMetricCard label="Regulatory Exams" value="8" status="neutral" />
              <CompactMetricCard label="Findings Open" value="12" change={-25} status="good" />
              <CompactMetricCard label="Avg Close Time" value="28" unit="d" change={-18} status="good" />
            </div>

            {/* Compliance by Category */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold text-sm mb-3">Compliance Monitoring by Category</h3>
              <table className="min-w-full text-xs">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium text-gray-600">Category</th>
                    <th className="px-3 py-2 text-right font-medium text-gray-600">Alerts (YTD)</th>
                    <th className="px-3 py-2 text-right font-medium text-gray-600">Investigations</th>
                    <th className="px-3 py-2 text-right font-medium text-gray-600">Breaches</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-600">Rating</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {complianceMetrics.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-3 py-2 font-medium text-gray-900">{item.category}</td>
                      <td className="px-3 py-2 text-right text-gray-900">{item.alerts}</td>
                      <td className="px-3 py-2 text-right text-gray-700">{item.investigations}</td>
                      <td className="px-3 py-2 text-right">
                        <span className={item.breaches === 0 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                          {item.breaches}
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        <span className={`px-2 py-0.5 text-xs font-medium rounded border ${getRatingColor(item.rating)}`}>
                          {item.rating}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Regulatory Environment */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold text-sm mb-3">Regulatory Environment & Upcoming Changes</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs font-medium text-gray-700 mb-2">Recent Regulatory Changes</div>
                  <div className="space-y-2 text-xs">
                    <div className="p-2 bg-blue-50 rounded border-l-2 border-blue-500">
                      <div className="font-medium text-blue-900">Basel III Endgame (2025)</div>
                      <div className="text-blue-800">Impact: +$2.8B RWA | +45bps capital requirement</div>
                    </div>
                    <div className="p-2 bg-green-50 rounded border-l-2 border-green-500">
                      <div className="font-medium text-green-900">Custody Rule Updates (Q2 2024)</div>
                      <div className="text-green-800">Status: Compliant | Enhanced reporting implemented</div>
                    </div>
                    <div className="p-2 bg-amber-50 rounded border-l-2 border-amber-500">
                      <div className="font-medium text-amber-900">Crypto Asset Guidance (Q4 2024)</div>
                      <div className="text-amber-800">Status: Monitoring | Potential new service line</div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-xs font-medium text-gray-700 mb-2">Key Regulatory Relationships</div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between p-2 bg-gray-50 rounded">
                      <span className="font-medium">Federal Reserve</span>
                      <span className="text-green-600">Strong</span>
                    </div>
                    <div className="flex justify-between p-2 bg-gray-50 rounded">
                      <span className="font-medium">OCC</span>
                      <span className="text-green-600">Strong</span>
                    </div>
                    <div className="flex justify-between p-2 bg-gray-50 rounded">
                      <span className="font-medium">SEC</span>
                      <span className="text-blue-600">Good</span>
                    </div>
                    <div className="flex justify-between p-2 bg-gray-50 rounded">
                      <span className="font-medium">FinCEN</span>
                      <span className="text-green-600">Strong</span>
                    </div>
                    <div className="flex justify-between p-2 bg-gray-50 rounded">
                      <span className="font-medium">State Regulators</span>
                      <span className="text-green-600">Strong</span>
                    </div>
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
