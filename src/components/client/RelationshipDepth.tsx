import { formatCurrency, formatPercent } from '../../utils/dataGenerators'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ScatterChart, Scatter, Cell } from 'recharts'
import { AlertTriangle, CheckCircle, TrendingDown, TrendingUp } from 'lucide-react'

export default function RelationshipDepth() {
  // Top 30 clients with relationship metrics
  const clientRelationships = [
    {
      client: 'Global Pension Fund A',
      revenue: 45.2,
      productsUsed: 3,
      relationshipLength: 12,
      executiveEngagement: 92,
      npsScore: 68,
      utilizationRate: 88,
      integrationLevel: 85,
      switchingCost: 'Very High',
      churnRisk: 5,
      lifetimeValue: 812,
      tier: 'Platinum',
      lastExpansion: 8
    },
    {
      client: 'Insurance Company B',
      revenue: 38.5,
      productsUsed: 3,
      relationshipLength: 15,
      executiveEngagement: 88,
      npsScore: 72,
      utilizationRate: 92,
      integrationLevel: 90,
      switchingCost: 'Very High',
      churnRisk: 3,
      lifetimeValue: 1025,
      tier: 'Platinum',
      lastExpansion: 6
    },
    {
      client: 'Asset Manager C',
      revenue: 52.3,
      productsUsed: 2,
      relationshipLength: 8,
      executiveEngagement: 65,
      npsScore: 55,
      utilizationRate: 72,
      integrationLevel: 68,
      switchingCost: 'Medium',
      churnRisk: 42,
      lifetimeValue: 485,
      tier: 'Platinum',
      lastExpansion: 24
    },
    {
      client: 'Sovereign Wealth Fund D',
      revenue: 41.8,
      productsUsed: 1,
      relationshipLength: 5,
      executiveEngagement: 58,
      npsScore: 48,
      utilizationRate: 65,
      integrationLevel: 55,
      switchingCost: 'Low',
      churnRisk: 68,
      lifetimeValue: 298,
      tier: 'Platinum',
      lastExpansion: 36
    },
    {
      client: 'Corporate Pension E',
      revenue: 28.5,
      productsUsed: 4,
      relationshipLength: 18,
      executiveEngagement: 95,
      npsScore: 78,
      utilizationRate: 95,
      integrationLevel: 92,
      switchingCost: 'Very High',
      churnRisk: 2,
      lifetimeValue: 685,
      tier: 'Gold',
      lastExpansion: 4
    },
    {
      client: 'Endowment F',
      revenue: 22.8,
      productsUsed: 3,
      relationshipLength: 22,
      executiveEngagement: 90,
      npsScore: 75,
      utilizationRate: 89,
      integrationLevel: 88,
      switchingCost: 'High',
      churnRisk: 8,
      lifetimeValue: 742,
      tier: 'Gold',
      lastExpansion: 12
    },
    {
      client: 'Family Office G',
      revenue: 18.5,
      productsUsed: 1,
      relationshipLength: 3,
      executiveEngagement: 52,
      npsScore: 42,
      utilizationRate: 58,
      integrationLevel: 48,
      switchingCost: 'Low',
      churnRisk: 72,
      lifetimeValue: 125,
      tier: 'Gold',
      lastExpansion: 36
    },
    {
      client: 'Mutual Fund Complex H',
      revenue: 35.2,
      productsUsed: 2,
      relationshipLength: 6,
      executiveEngagement: 70,
      npsScore: 58,
      utilizationRate: 75,
      integrationLevel: 72,
      switchingCost: 'Medium',
      churnRisk: 35,
      lifetimeValue: 412,
      tier: 'Gold',
      lastExpansion: 18
    }
  ]

  // Add more clients
  for (let i = 9; i <= 30; i++) {
    const revenue = Math.random() * 30 + 5
    const productsUsed = Math.floor(Math.random() * 4) + 1
    const relationshipLength = Math.floor(Math.random() * 20) + 2
    const executiveEngagement = Math.random() * 40 + 50
    const npsScore = Math.random() * 40 + 40
    const utilizationRate = Math.random() * 35 + 60
    const integrationLevel = Math.random() * 40 + 50
    const lastExpansion = Math.floor(Math.random() * 36) + 1

    // Calculate churn risk
    const baseRisk = 100 - ((executiveEngagement + npsScore + utilizationRate + integrationLevel) / 4)
    const expansionPenalty = Math.max(0, (lastExpansion - 12) * 2)
    const churnRisk = Math.min(95, Math.max(5, baseRisk + expansionPenalty + (Math.random() * 10 - 5)))

    clientRelationships.push({
      client: `Client ${String.fromCharCode(65 + i - 1)}`,
      revenue,
      productsUsed,
      relationshipLength,
      executiveEngagement,
      npsScore,
      utilizationRate,
      integrationLevel,
      switchingCost: integrationLevel > 80 ? 'Very High' : integrationLevel > 65 ? 'High' : integrationLevel > 50 ? 'Medium' : 'Low',
      churnRisk,
      lifetimeValue: revenue * relationshipLength * (1 - churnRisk / 100) * (1 + productsUsed * 0.2),
      tier: revenue > 30 ? 'Platinum' : revenue > 20 ? 'Gold' : revenue > 10 ? 'Silver' : 'Bronze',
      lastExpansion
    })
  }

  const atRiskClients = clientRelationships.filter(c => c.churnRisk > 50)
  const atRiskRevenue = atRiskClients.reduce((sum, c) => sum + c.revenue, 0)

  const healthyClients = clientRelationships.filter(c => c.churnRisk < 20)
  const healthyRevenue = healthyClients.reduce((sum, c) => sum + c.revenue, 0)

  // Relationship health score components
  const avgEngagement = clientRelationships.reduce((sum, c) => sum + c.executiveEngagement, 0) / clientRelationships.length
  const avgNPS = clientRelationships.reduce((sum, c) => sum + c.npsScore, 0) / clientRelationships.length
  const avgUtilization = clientRelationships.reduce((sum, c) => sum + c.utilizationRate, 0) / clientRelationships.length
  const avgIntegration = clientRelationships.reduce((sum, c) => sum + c.integrationLevel, 0) / clientRelationships.length

  // Churn risk distribution
  const churnBuckets = [
    { bucket: 'Very Low (<10%)', count: clientRelationships.filter(c => c.churnRisk < 10).length, revenue: 0 },
    { bucket: 'Low (10-25%)', count: clientRelationships.filter(c => c.churnRisk >= 10 && c.churnRisk < 25).length, revenue: 0 },
    { bucket: 'Moderate (25-50%)', count: clientRelationships.filter(c => c.churnRisk >= 25 && c.churnRisk < 50).length, revenue: 0 },
    { bucket: 'High (50-75%)', count: clientRelationships.filter(c => c.churnRisk >= 50 && c.churnRisk < 75).length, revenue: 0 },
    { bucket: 'Critical (>75%)', count: clientRelationships.filter(c => c.churnRisk >= 75).length, revenue: 0 }
  ]

  churnBuckets.forEach(bucket => {
    let clients: typeof clientRelationships = []
    if (bucket.bucket.includes('Very Low')) clients = clientRelationships.filter(c => c.churnRisk < 10)
    else if (bucket.bucket.includes('Low')) clients = clientRelationships.filter(c => c.churnRisk >= 10 && c.churnRisk < 25)
    else if (bucket.bucket.includes('Moderate')) clients = clientRelationships.filter(c => c.churnRisk >= 25 && c.churnRisk < 50)
    else if (bucket.bucket.includes('High')) clients = clientRelationships.filter(c => c.churnRisk >= 50 && c.churnRisk < 75)
    else clients = clientRelationships.filter(c => c.churnRisk >= 75)

    bucket.revenue = clients.reduce((sum, c) => sum + c.revenue, 0)
  })

  // Engagement drivers
  const engagementMetrics = [
    { metric: 'Executive Touch Points', score: avgEngagement, benchmark: 85, gap: avgEngagement - 85 },
    { metric: 'NPS Score', score: avgNPS, benchmark: 70, gap: avgNPS - 70 },
    { metric: 'Platform Utilization', score: avgUtilization, benchmark: 90, gap: avgUtilization - 90 },
    { metric: 'Systems Integration', score: avgIntegration, benchmark: 80, gap: avgIntegration - 80 }
  ]

  // Radar chart data for top at-risk clients
  const radarData = [
    { metric: 'Executive Engagement', fullMark: 100 },
    { metric: 'NPS', fullMark: 100 },
    { metric: 'Utilization', fullMark: 100 },
    { metric: 'Integration', fullMark: 100 },
    { metric: 'Products', fullMark: 100 }
  ]

  const topAtRisk = atRiskClients.sort((a, b) => b.revenue - a.revenue).slice(0, 3)

  return (
    <div className="space-y-6">
      {/* Header Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="metric-card">
          <div className="text-sm text-gray-600 mb-1">Healthy Relationships</div>
          <div className="text-2xl font-bold text-green-600">{healthyClients.length}</div>
          <div className="text-xs text-green-500 mt-1">{formatCurrency(healthyRevenue, 0)}M revenue</div>
        </div>
        <div className="metric-card">
          <div className="text-sm text-gray-600 mb-1">At-Risk Clients</div>
          <div className="text-2xl font-bold text-red-600">{atRiskClients.length}</div>
          <div className="text-xs text-red-500 mt-1">{formatCurrency(atRiskRevenue, 0)}M at risk</div>
        </div>
        <div className="metric-card">
          <div className="text-sm text-gray-600 mb-1">Avg Relationship Length</div>
          <div className="text-2xl font-bold text-blue-600">
            {(clientRelationships.reduce((sum, c) => sum + c.relationshipLength, 0) / clientRelationships.length).toFixed(1)}y
          </div>
          <div className="text-xs text-gray-500 mt-1">Years tenure</div>
        </div>
        <div className="metric-card">
          <div className="text-sm text-gray-600 mb-1">Total CLV</div>
          <div className="text-2xl font-bold text-purple-600">
            {formatCurrency(clientRelationships.reduce((sum, c) => sum + c.lifetimeValue, 0), 0)}M
          </div>
          <div className="text-xs text-gray-500 mt-1">Lifetime value</div>
        </div>
      </div>

      {/* Critical Alert */}
      <div className="metric-card border-l-4 border-red-500">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">High Churn Risk - Immediate Action Required</h3>
            <p className="text-sm text-gray-700 mb-3">
              <strong>{atRiskClients.length} clients</strong> (representing <strong>{formatCurrency(atRiskRevenue, 0)}M</strong> revenue)
              show elevated churn risk (&gt;50% probability). Primary drivers: low executive engagement, stagnant product adoption, poor utilization.
              <strong> Top 3 at-risk clients represent {formatCurrency(topAtRisk.reduce((s, c) => s + c.revenue, 0), 0)}M</strong> in potential losses.
            </p>
            <div className="grid grid-cols-3 gap-3">
              {topAtRisk.map((client, idx) => (
                <div key={idx} className="p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="text-sm font-semibold text-red-900">{client.client}</div>
                  <div className="text-xs text-red-700 mt-1">Revenue: {formatCurrency(client.revenue, 1)}M</div>
                  <div className="text-xs text-red-700">Churn Risk: {client.churnRisk.toFixed(0)}%</div>
                  <div className="text-xs text-red-700">Last Growth: {client.lastExpansion}mo ago</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Churn Risk Distribution */}
      <div className="metric-card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Churn Risk Distribution</h3>
        <div className="h-80 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={churnBuckets} margin={{ top: 20, right: 30, left: 60, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="bucket"
                angle={-15}
                textAnchor="end"
                height={80}
                interval={0}
              />
              <YAxis
                yAxisId="left"
                label={{ value: 'Client Count', angle: -90, position: 'insideLeft' }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                label={{ value: 'Revenue at Risk ($M)', angle: 90, position: 'insideRight' }}
              />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="count" name="Clients" fill="#3b82f6">
                {churnBuckets.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={
                    entry.bucket.includes('Very Low') ? '#10b981' :
                    entry.bucket.includes('Low') ? '#3b82f6' :
                    entry.bucket.includes('Moderate') ? '#f59e0b' :
                    entry.bucket.includes('High') ? '#ef4444' :
                    '#991b1b'
                  } />
                ))}
              </Bar>
              <Bar yAxisId="right" dataKey="revenue" name="Revenue ($M)" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {churnBuckets.map((bucket, idx) => (
            <div key={idx} className={`p-3 rounded-lg border ${
              bucket.bucket.includes('Very Low') ? 'border-green-500 bg-green-50' :
              bucket.bucket.includes('Low') ? 'border-blue-500 bg-blue-50' :
              bucket.bucket.includes('Moderate') ? 'border-yellow-500 bg-yellow-50' :
              bucket.bucket.includes('High') ? 'border-red-500 bg-red-50' :
              'border-red-700 bg-red-100'
            }`}>
              <div className="text-xs text-gray-600 mb-1">{bucket.bucket}</div>
              <div className="text-2xl font-bold text-gray-900">{bucket.count}</div>
              <div className="text-xs text-gray-600 mt-1">{formatCurrency(bucket.revenue, 0)}M</div>
            </div>
          ))}
        </div>
      </div>

      {/* Engagement Metrics */}
      <div className="metric-card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Relationship Health Metrics vs Benchmark</h3>
        <div className="space-y-4">
          {engagementMetrics.map((metric, idx) => (
            <div key={idx}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">{metric.metric}</span>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">Current: <strong>{metric.score.toFixed(0)}</strong></span>
                  <span className="text-sm text-gray-600">Benchmark: <strong>{metric.benchmark}</strong></span>
                  <span className={`text-sm font-bold ${metric.gap >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {metric.gap >= 0 ? '+' : ''}{metric.gap.toFixed(0)}
                  </span>
                </div>
              </div>
              <div className="relative h-6 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`absolute h-full ${
                    metric.score >= metric.benchmark ? 'bg-green-500' :
                    metric.score >= metric.benchmark * 0.9 ? 'bg-blue-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${Math.min(metric.score, 100)}%` }}
                ></div>
                <div
                  className="absolute h-full border-l-2 border-dashed border-gray-700"
                  style={{ left: `${metric.benchmark}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <h4 className="text-sm font-semibold text-yellow-900 mb-2">Performance Gaps</h4>
          <div className="space-y-1 text-sm text-yellow-800">
            {engagementMetrics.filter(m => m.gap < 0).map((metric, idx) => (
              <p key={idx}>• <strong>{metric.metric}:</strong> {Math.abs(metric.gap).toFixed(0)} points below benchmark - {
                metric.metric.includes('Executive') ? 'Increase C-level touchpoints' :
                metric.metric.includes('NPS') ? 'Address service quality issues' :
                metric.metric.includes('Utilization') ? 'Improve training and onboarding' :
                'Deepen systems integration'
              }</p>
            ))}
          </div>
        </div>
      </div>

      {/* Top At-Risk Clients Detail */}
      <div className="metric-card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">High-Risk Clients Requiring Intervention</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Revenue</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Churn Risk</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Exec Engage</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">NPS</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Utilization</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Products</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Last Expansion</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {clientRelationships.filter(c => c.churnRisk > 50).sort((a, b) => b.revenue - a.revenue).slice(0, 12).map((client, idx) => (
                <tr key={idx} className="hover:bg-red-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{client.client}</td>
                  <td className="px-4 py-3 text-sm text-right font-semibold">{formatCurrency(client.revenue, 1)}M</td>
                  <td className="px-4 py-3 text-sm text-right">
                    <span className={`font-bold ${
                      client.churnRisk > 75 ? 'text-red-700' :
                      client.churnRisk > 50 ? 'text-red-600' :
                      'text-orange-600'
                    }`}>
                      {client.churnRisk.toFixed(0)}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-right">{client.executiveEngagement.toFixed(0)}</td>
                  <td className="px-4 py-3 text-sm text-right">{client.npsScore.toFixed(0)}</td>
                  <td className="px-4 py-3 text-sm text-right">{client.utilizationRate.toFixed(0)}%</td>
                  <td className="px-4 py-3 text-sm text-right">{client.productsUsed}</td>
                  <td className="px-4 py-3 text-sm text-right text-red-600">{client.lastExpansion}mo</td>
                  <td className="px-4 py-3 text-sm">
                    <span className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded font-medium">
                      {client.churnRisk > 75 ? 'CEO Call' : 'Exec Review'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
          <h4 className="text-sm font-semibold text-red-900 mb-2">Retention Action Plan</h4>
          <div className="grid grid-cols-3 gap-4 text-sm text-red-800">
            <div>
              <p className="font-semibold mb-1">Week 1-2:</p>
              <p>• Executive sponsor calls for top 5 at-risk clients</p>
              <p>• Schedule QBRs with all &gt;75% risk</p>
            </div>
            <div>
              <p className="font-semibold mb-1">Week 3-4:</p>
              <p>• Deploy product specialists for expansion opportunities</p>
              <p>• Address service gaps identified in NPS</p>
            </div>
            <div>
              <p className="font-semibold mb-1">Month 2-3:</p>
              <p>• Launch pilot programs for new services</p>
              <p>• Increase utilization through training</p>
            </div>
          </div>
        </div>
      </div>

      {/* Lifetime Value Analysis */}
      <div className="metric-card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Client Lifetime Value vs Churn Risk</h3>
        <div className="h-80 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 30, bottom: 60, left: 60 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                type="number"
                dataKey="churnRisk"
                name="Churn Risk"
                label={{ value: 'Churn Risk (%)', position: 'bottom', offset: 40 }}
                domain={[0, 100]}
              />
              <YAxis
                type="number"
                dataKey="lifetimeValue"
                name="CLV"
                label={{ value: 'Lifetime Value ($M)', angle: -90, position: 'left', offset: 40 }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload
                    return (
                      <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
                        <p className="font-semibold text-gray-900">{data.client}</p>
                        <p className="text-sm text-gray-600">Revenue: {formatCurrency(data.revenue, 1)}M</p>
                        <p className="text-sm text-gray-600">CLV: {formatCurrency(data.lifetimeValue, 0)}M</p>
                        <p className="text-sm text-red-600">Churn Risk: {data.churnRisk.toFixed(0)}%</p>
                        <p className="text-sm text-gray-600">Products: {data.productsUsed}</p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Scatter data={clientRelationships} fill="#8884d8">
                {clientRelationships.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={
                    entry.churnRisk < 20 ? '#10b981' :
                    entry.churnRisk < 50 ? '#3b82f6' :
                    entry.churnRisk < 75 ? '#f59e0b' :
                    '#ef4444'
                  } />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-900">
            <strong>Strategic Insight:</strong> High-CLV clients with elevated churn risk represent critical vulnerability.
            Top-right quadrant (high CLV + high risk) demands immediate executive intervention.
            Focus retention efforts on clients with &gt;$400M CLV and &gt;50% churn risk - this represents
            <strong> {formatCurrency(clientRelationships.filter(c => c.lifetimeValue > 400 && c.churnRisk > 50).reduce((s, c) => s + c.lifetimeValue, 0), 0)}M</strong> in lifetime value at risk.
          </p>
        </div>
      </div>
    </div>
  )
}
