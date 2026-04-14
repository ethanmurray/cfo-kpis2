import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/Tabs'
import ScoreboardView from '../components/peer/ScoreboardView'
import TrendsView from '../components/peer/TrendsView'
import ValuationView from '../components/peer/ValuationView'
import CompactMetricCard from '../components/CompactMetricCard'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Cell } from 'recharts'
import { TrendingUp, Users, Award, Target, CheckCircle2, AlertCircle, Clock } from 'lucide-react'

export default function ExternalPositioning() {
  // Strategic positioning vs peers
  const strategicPosition = [
    { dimension: 'Scale', score: 85, benchmark: 72 },
    { dimension: 'Profitability', score: 72, benchmark: 68 },
    { dimension: 'Efficiency', score: 79, benchmark: 65 },
    { dimension: 'Capital', score: 88, benchmark: 75 },
    { dimension: 'Liquidity', score: 91, benchmark: 78 },
    { dimension: 'Growth', score: 68, benchmark: 70 },
    { dimension: 'Innovation', score: 62, benchmark: 75 },
    { dimension: 'Risk Mgmt', score: 82, benchmark: 70 },
  ]

  const competitiveMetrics = [
    { metric: 'Market Share (US Custody)', value: '18.8%', rank: '3rd', trend: '+0.4pp YoY' },
    { metric: 'AUM ($T)', value: '$6.1', rank: '3rd', trend: '+6.8% YoY' },
    { metric: 'Client NPS', value: '68', rank: '2nd', trend: '+4 pts YoY' },
    { metric: 'Technology Investment', value: '9.2%', rank: '4th', trend: '+1.2pp YoY' },
    { metric: 'Employee Satisfaction', value: '82', rank: '1st', trend: '+3 pts YoY' },
    { metric: 'ESG Rating', value: 'A-', rank: '2nd', trend: 'Stable' },
  ]

  const marketShareData = [
    { competitor: 'BNY Mellon', share: 28.5, color: '#6b7280' },
    { competitor: 'State Street', share: 26.2, color: '#6b7280' },
    { competitor: 'Northern Trust', share: 18.8, color: '#D4AF37' },
    { competitor: 'JP Morgan', share: 15.3, color: '#6b7280' },
    { competitor: 'Others', share: 11.2, color: '#6b7280' },
  ]

  const winLossData = [
    { quarter: 'Q1 23', wins: 3, losses: 2, netAUM: 32 },
    { quarter: 'Q2 23', wins: 5, losses: 1, netAUM: 58 },
    { quarter: 'Q3 23', wins: 4, losses: 3, netAUM: 18 },
    { quarter: 'Q4 23', wins: 2, losses: 2, netAUM: 0 },
    { quarter: 'Q1 24', wins: 4, losses: 0, netAUM: 35 },
  ]

  const getRankColor = (rank: string) => {
    if (rank.includes('1st')) return '#10b981'
    if (rank.includes('2nd')) return '#3b82f6'
    if (rank.includes('3rd')) return '#D4AF37'
    return '#6b7280'
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-nt-forest">External Positioning</h1>
          <p className="text-xs mt-1 text-gray-600">
            Peer benchmarking, competitive analysis, and market positioning
          </p>
        </div>
        <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg shadow-md" style={{
          background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.12) 0%, rgba(212, 175, 55, 0.04) 100%)',
          border: '1px solid rgba(212, 175, 55, 0.25)'
        }}>
          <Award className="h-5 w-5 text-nt-gold" />
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wide text-gray-600">Market Rank</div>
            <div className="flex items-baseline gap-1.5">
              <div className="text-lg font-bold text-nt-gold">#3 in US Custody</div>
              <div className="text-[10px] font-semibold text-green-600">+0.4pp</div>
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
              <span className="font-semibold text-xs text-nt-forest">Competitive Strengths</span>
            </div>
            <ul className="space-y-0.5 text-xs text-gray-600 leading-tight">
              <li>• #3 market position in US Custody (18.8% share)</li>
              <li>• Win rate 69% YTD (4 wins, 0 losses in Q1)</li>
              <li>• Client NPS 68 (#2 ranked, +12 vs peers)</li>
              <li>• Employee satisfaction #1 ranked (82 score)</li>
            </ul>
          </div>

          <div className="summary-card">
            <div className="flex items-center gap-1.5 mb-2">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <span className="font-semibold text-xs text-nt-forest">Competitive Gaps</span>
            </div>
            <ul className="space-y-0.5 text-xs text-gray-600 leading-tight">
              <li>• Innovation score 62 vs 75 peer average</li>
              <li>• Technology investment 9.2% (#4 ranked)</li>
              <li>• Growth rate 68 vs 70 peer benchmark</li>
              <li>• Gap to #1 (BNY Mellon): -9.7pp market share</li>
            </ul>
          </div>

          <div className="summary-card">
            <div className="flex items-center gap-1.5 mb-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="font-semibold text-xs text-nt-forest">Strategic Priorities</span>
            </div>
            <ul className="space-y-0.5 text-xs text-gray-600 leading-tight">
              <li>• Accelerate digital transformation initiatives</li>
              <li>• Target AUM growth to $6.5T (from $6.1T)</li>
              <li>• Defend against BNY/State Street in mandates</li>
              <li>• Leverage ESG leadership (A- rating) in RFPs</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-6 gap-3">
        <CompactMetricCard label="Market Share" value="18.8" unit="%" change={2.2} status="good" />
        <CompactMetricCard label="Win Rate (YTD)" value="69" unit="%" change={8.5} status="good" />
        <CompactMetricCard label="NPS vs Peers" value="+12" change={4.0} status="good" />
        <CompactMetricCard label="RAROC Rank" value="72nd" unit=" %ile" status="good" />
        <CompactMetricCard label="Efficiency Rank" value="79th" unit=" %ile" status="good" />
        <CompactMetricCard label="ESG Rating" value="A-" status="good" />
      </div>

      <Tabs defaultValue="scoreboard">
        <TabsList>
          <TabsTrigger value="scoreboard">Peer Scoreboard</TabsTrigger>
          <TabsTrigger value="positioning">Strategic Positioning</TabsTrigger>
          <TabsTrigger value="competitive">Competitive Dynamics</TabsTrigger>
          <TabsTrigger value="trends">Performance Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="scoreboard">
          <ScoreboardView />
        </TabsContent>

        <TabsContent value="positioning">
          <div className="space-y-6">
            {/* Strategic Position Radar */}
            <div className="rounded-2xl p-6 shadow-lg" style={{
              background: 'linear-gradient(135deg, #ffffff 0%, rgba(248, 249, 250, 0.5) 100%)',
              border: '1px solid rgba(0, 77, 53, 0.08)'
            }}>
              <h3 className="text-lg font-bold mb-4" style={{ color: '#006747' }}>
                Strategic Position vs Peer Average (Percentile Scores)
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <ResponsiveContainer width="100%" height={360}>
                  <RadarChart data={strategicPosition}>
                    <PolarGrid stroke="rgba(0, 77, 53, 0.1)" />
                    <PolarAngleAxis dataKey="dimension" style={{ fontSize: '12px', fill: '#6b7280' }} />
                    <PolarRadiusAxis domain={[0, 100]} style={{ fontSize: '10px', fill: '#9ca3af' }} />
                    <Radar name="Northern Trust" dataKey="score" stroke="#D4AF37" fill="#D4AF37" fillOpacity={0.5} strokeWidth={2} />
                    <Radar name="Peer Average" dataKey="benchmark" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} strokeWidth={2} />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
                <div className="space-y-3">
                  {strategicPosition.map((item, idx) => (
                    <div key={idx} className="p-3 rounded-lg transition-all duration-200 hover:shadow-md" style={{
                      backgroundColor: 'rgba(0, 77, 53, 0.02)'
                    }}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-sm" style={{ color: '#006747' }}>{item.dimension}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold" style={{ color: '#D4AF37' }}>
                            {item.score}th
                          </span>
                          <span className="text-xs" style={{ color: '#6b7280' }}>
                            vs {item.benchmark}th avg
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full transition-all duration-500"
                            style={{
                              width: `${item.score}%`,
                              backgroundColor: item.score >= 80 ? '#10b981' : item.score >= 70 ? '#D4AF37' : '#f59e0b'
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-xl" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
                  <div className="font-bold text-green-600 mb-2">Strengths (80+)</div>
                  <ul className="space-y-1 text-green-800">
                    <li>• Liquidity: 91st percentile</li>
                    <li>• Capital: 88th percentile</li>
                    <li>• Scale: 85th percentile</li>
                    <li>• Risk Management: 82nd percentile</li>
                  </ul>
                </div>
                <div className="p-4 rounded-xl" style={{ backgroundColor: 'rgba(212, 175, 55, 0.1)' }}>
                  <div className="font-bold mb-2" style={{ color: '#D4AF37' }}>Competitive (70-79)</div>
                  <ul className="space-y-1" style={{ color: '#6b7280' }}>
                    <li>• Efficiency: 79th percentile</li>
                    <li>• Profitability: 72nd percentile</li>
                  </ul>
                </div>
                <div className="p-4 rounded-xl" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)' }}>
                  <div className="font-bold text-amber-600 mb-2">Opportunities (&lt;70)</div>
                  <ul className="space-y-1 text-amber-800">
                    <li>• Growth: 68th percentile</li>
                    <li>• Innovation: 62nd percentile</li>
                    <li>• Digital acceleration needed</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Competitive Metrics Table */}
            <div className="rounded-2xl p-6 shadow-lg" style={{
              background: 'linear-gradient(135deg, #ffffff 0%, rgba(248, 249, 250, 0.5) 100%)',
              border: '1px solid rgba(0, 77, 53, 0.08)'
            }}>
              <h3 className="text-lg font-bold mb-4" style={{ color: '#006747' }}>Competitive Metrics & Rankings</h3>
              <table className="min-w-full">
                <thead style={{ backgroundColor: 'rgba(0, 77, 53, 0.02)' }}>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider" style={{ color: '#006747' }}>Metric</th>
                    <th className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider" style={{ color: '#006747' }}>Value</th>
                    <th className="px-6 py-3 text-center text-xs font-bold uppercase tracking-wider" style={{ color: '#006747' }}>Industry Rank</th>
                    <th className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider" style={{ color: '#006747' }}>Trend</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ divideColor: 'rgba(0, 77, 53, 0.05)' }}>
                  {competitiveMetrics.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-sm" style={{ color: '#006747' }}>{item.metric}</td>
                      <td className="px-6 py-4 text-right text-xl font-bold" style={{ color: '#D4AF37' }}>{item.value}</td>
                      <td className="px-6 py-4 text-center">
                        <span className="px-4 py-2 rounded-full text-sm font-bold" style={{
                          backgroundColor: `${getRankColor(item.rank)}15`,
                          color: getRankColor(item.rank)
                        }}>
                          {item.rank}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-semibold text-green-600">{item.trend}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="competitive">
          <div className="space-y-6">
            {/* Market Share */}
            <div className="rounded-2xl p-6 shadow-lg" style={{
              background: 'linear-gradient(135deg, #ffffff 0%, rgba(248, 249, 250, 0.5) 100%)',
              border: '1px solid rgba(0, 77, 53, 0.08)'
            }}>
              <h3 className="text-lg font-bold mb-4" style={{ color: '#006747' }}>US Custody Market Share</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={marketShareData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 0, 0, 0.05)" />
                  <XAxis dataKey="competitor" style={{ fontSize: '12px', fill: '#6b7280' }} />
                  <YAxis style={{ fontSize: '12px', fill: '#6b7280' }} label={{ value: 'Market Share (%)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid rgba(0, 77, 53, 0.2)',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar dataKey="share" radius={[8, 8, 0, 0]}>
                    {marketShareData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Win/Loss Analysis */}
            <div className="rounded-2xl p-6 shadow-lg" style={{
              background: 'linear-gradient(135deg, #ffffff 0%, rgba(248, 249, 250, 0.5) 100%)',
              border: '1px solid rgba(0, 77, 53, 0.08)'
            }}>
              <h3 className="text-lg font-bold mb-4" style={{ color: '#006747' }}>Win/Loss Analysis (Last 5 Quarters)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={winLossData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 0, 0, 0.05)" />
                  <XAxis dataKey="quarter" style={{ fontSize: '12px', fill: '#6b7280' }} />
                  <YAxis yAxisId="left" style={{ fontSize: '12px', fill: '#6b7280' }} label={{ value: 'Mandates', angle: -90, position: 'insideLeft' }} />
                  <YAxis yAxisId="right" orientation="right" style={{ fontSize: '12px', fill: '#6b7280' }} label={{ value: 'Net AUM ($B)', angle: 90, position: 'insideRight' }} />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="wins" fill="#10b981" name="Wins" radius={[8, 8, 0, 0]} />
                  <Bar yAxisId="left" dataKey="losses" fill="#ef4444" name="Losses" radius={[8, 8, 0, 0]} />
                  <Line yAxisId="right" type="monotone" dataKey="netAUM" stroke="#D4AF37" strokeWidth={3} name="Net AUM" />
                </BarChart>
              </ResponsiveContainer>

              <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="p-4 rounded-xl" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
                  <div className="font-bold text-green-600 text-sm mb-2">YTD Wins: 18 mandates</div>
                  <div className="text-xs text-green-800">$285B AUM | Avg fee: 9.2bps</div>
                </div>
                <div className="p-4 rounded-xl" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
                  <div className="font-bold text-red-600 text-sm mb-2">YTD Losses: 8 mandates</div>
                  <div className="text-xs text-red-800">$142B AUM | Lost to pricing</div>
                </div>
                <div className="p-4 rounded-xl" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
                  <div className="font-bold text-blue-600 text-sm mb-2">Net: +$143B AUM</div>
                  <div className="text-xs text-blue-800">69% win rate | +2.4% market share</div>
                </div>
              </div>
            </div>

            {/* Competitive Differentiators */}
            <div className="rounded-2xl p-6 shadow-lg" style={{
              background: 'linear-gradient(135deg, #ffffff 0%, rgba(248, 249, 250, 0.5) 100%)',
              border: '1px solid rgba(0, 77, 53, 0.08)'
            }}>
              <h3 className="text-lg font-bold mb-4" style={{ color: '#006747' }}>Key Differentiators</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-sm font-bold mb-3" style={{ color: '#006747' }}>Strengths</div>
                  <div className="space-y-2 text-sm">
                    <div className="p-3 rounded-lg flex items-center gap-2" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
                      <span className="text-green-600 font-bold">✓</span>
                      <span style={{ color: '#1f2937' }}>Technology platform</span>
                    </div>
                    <div className="p-3 rounded-lg flex items-center gap-2" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
                      <span className="text-green-600 font-bold">✓</span>
                      <span style={{ color: '#1f2937' }}>Client service ratings (#2)</span>
                    </div>
                    <div className="p-3 rounded-lg flex items-center gap-2" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
                      <span className="text-green-600 font-bold">✓</span>
                      <span style={{ color: '#1f2937' }}>Risk management</span>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-bold mb-3" style={{ color: '#006747' }}>Neutral</div>
                  <div className="space-y-2 text-sm">
                    <div className="p-3 rounded-lg flex items-center gap-2" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)' }}>
                      <span className="text-amber-600 font-bold">~</span>
                      <span style={{ color: '#1f2937' }}>Pricing (88% of market)</span>
                    </div>
                    <div className="p-3 rounded-lg flex items-center gap-2" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)' }}>
                      <span className="text-amber-600 font-bold">~</span>
                      <span style={{ color: '#1f2937' }}>Innovation speed</span>
                    </div>
                    <div className="p-3 rounded-lg flex items-center gap-2" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)' }}>
                      <span className="text-amber-600 font-bold">~</span>
                      <span style={{ color: '#1f2937' }}>Product breadth</span>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-bold mb-3" style={{ color: '#006747' }}>Gaps</div>
                  <div className="space-y-2 text-sm">
                    <div className="p-3 rounded-lg flex items-center gap-2" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
                      <span className="text-red-600 font-bold">✗</span>
                      <span style={{ color: '#1f2937' }}>Scale in emerging markets</span>
                    </div>
                    <div className="p-3 rounded-lg flex items-center gap-2" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
                      <span className="text-red-600 font-bold">✗</span>
                      <span style={{ color: '#1f2937' }}>Digital-first solutions</span>
                    </div>
                    <div className="p-3 rounded-lg flex items-center gap-2" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
                      <span className="text-red-600 font-bold">✗</span>
                      <span style={{ color: '#1f2937' }}>API ecosystem maturity</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="trends">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <TrendsView />
              <ValuationView />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
