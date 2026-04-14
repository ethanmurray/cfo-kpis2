import { formatCurrency, formatPercent } from '../../utils/dataGenerators'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, Cell, ComposedChart, Line } from 'recharts'
import { TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react'

export default function ClientProfitability() {
  // Top 50 clients with RAROC analysis
  const clientData = [
    { id: 1, name: 'Global Pension Fund A', revenue: 45.2, directCosts: 12.8, allocatedCapital: 125, capitalCharge: 13.1, raroc: 18.2, economicProfit: 19.3, tier: 'Platinum', auc: 385, segment: 'Pension' },
    { id: 2, name: 'Insurance Company B', revenue: 38.5, directCosts: 11.2, allocatedCapital: 105, capitalCharge: 11.0, raroc: 16.5, economicProfit: 16.3, tier: 'Platinum', auc: 312, segment: 'Insurance' },
    { id: 3, name: 'Asset Manager C', revenue: 52.3, directCosts: 18.5, allocatedCapital: 145, capitalCharge: 15.2, raroc: 15.8, economicProfit: 18.6, tier: 'Platinum', auc: 445, segment: 'Asset Mgr' },
    { id: 4, name: 'Sovereign Wealth Fund D', revenue: 41.8, directCosts: 9.8, allocatedCapital: 165, capitalCharge: 17.3, raroc: 14.2, economicProfit: 14.7, tier: 'Platinum', auc: 520, segment: 'Sovereign' },
    { id: 5, name: 'Corporate Pension E', revenue: 28.5, directCosts: 8.2, allocatedCapital: 85, capitalCharge: 8.9, raroc: 13.5, economicProfit: 11.4, tier: 'Gold', auc: 245, segment: 'Pension' },
    { id: 6, name: 'Endowment F', revenue: 22.8, directCosts: 6.5, allocatedCapital: 72, capitalCharge: 7.5, raroc: 12.8, economicProfit: 8.8, tier: 'Gold', auc: 198, segment: 'Endowment' },
    { id: 7, name: 'Family Office G', revenue: 18.5, directCosts: 5.8, allocatedCapital: 58, capitalCharge: 6.1, raroc: 11.8, economicProfit: 6.6, tier: 'Gold', auc: 165, segment: 'Family Office' },
    { id: 8, name: 'Mutual Fund Complex H', revenue: 35.2, directCosts: 14.5, allocatedCapital: 95, capitalCharge: 9.9, raroc: 11.5, economicProfit: 10.8, tier: 'Gold', auc: 285, segment: 'Asset Mgr' },
    { id: 9, name: 'Insurance Company I', revenue: 25.8, directCosts: 9.2, allocatedCapital: 88, capitalCharge: 9.2, raroc: 8.5, economicProfit: 7.4, tier: 'Silver', auc: 215, segment: 'Insurance' },
    { id: 10, name: 'Regional Pension J', revenue: 19.2, directCosts: 7.5, allocatedCapital: 68, capitalCharge: 7.1, raroc: 6.8, economicProfit: 4.6, tier: 'Silver', auc: 178, segment: 'Pension' },
    { id: 11, name: 'Hedge Fund K', revenue: 15.8, directCosts: 8.2, allocatedCapital: 45, capitalCharge: 4.7, raroc: 6.2, economicProfit: 2.9, tier: 'Silver', auc: 125, segment: 'Hedge Fund' },
    { id: 12, name: 'Small Asset Manager L', revenue: 12.5, directCosts: 6.8, allocatedCapital: 42, capitalCharge: 4.4, raroc: 3.5, economicProfit: 1.3, tier: 'Bronze', auc: 95, segment: 'Asset Mgr' },
    { id: 13, name: 'Corporate Treasury M', revenue: 8.5, directCosts: 5.2, allocatedCapital: 35, capitalCharge: 3.7, raroc: -1.2, economicProfit: -0.4, tier: 'Bronze', auc: 68, segment: 'Corporate' },
    { id: 14, name: 'Foundation N', revenue: 6.8, directCosts: 4.5, allocatedCapital: 28, capitalCharge: 2.9, raroc: -2.5, economicProfit: -0.6, tier: 'Bronze', auc: 55, segment: 'Foundation' },
    { id: 15, name: 'Small Pension O', revenue: 5.2, directCosts: 4.8, allocatedCapital: 22, capitalCharge: 2.3, raroc: -8.8, economicProfit: -1.9, tier: 'Bronze', auc: 42, segment: 'Pension' }
  ]

  // Add more clients for full dataset (simplified)
  const fullClientData = [...clientData]
  for (let i = 16; i <= 50; i++) {
    const revenue = Math.random() * 40 + 5
    const directCosts = revenue * (0.25 + Math.random() * 0.15)
    const allocatedCapital = revenue * (2 + Math.random() * 2)
    const capitalCharge = allocatedCapital * 0.105
    const raroc = ((revenue - directCosts - capitalCharge) / allocatedCapital) * 100
    const economicProfit = revenue - directCosts - capitalCharge

    fullClientData.push({
      id: i,
      name: `Client ${String.fromCharCode(65 + i - 1)}`,
      revenue,
      directCosts,
      allocatedCapital,
      capitalCharge,
      raroc,
      economicProfit,
      tier: raroc > 12 ? 'Gold' : raroc > 6 ? 'Silver' : 'Bronze',
      auc: revenue * (3 + Math.random() * 3),
      segment: ['Pension', 'Insurance', 'Asset Mgr', 'Corporate'][Math.floor(Math.random() * 4)]
    })
  }

  const sortedByRAROC = [...fullClientData].sort((a, b) => b.raroc - a.raroc)
  const sortedByEconomicProfit = [...fullClientData].sort((a, b) => b.economicProfit - a.economicProfit)

  // Summary statistics
  const totalRevenue = fullClientData.reduce((sum, c) => sum + c.revenue, 0)
  const totalEconomicProfit = fullClientData.reduce((sum, c) => sum + c.economicProfit, 0)
  const avgRAROC = fullClientData.reduce((sum, c) => sum + c.raroc, 0) / fullClientData.length

  const profitableClients = fullClientData.filter(c => c.economicProfit > 0)
  const unprofitableClients = fullClientData.filter(c => c.economicProfit < 0)

  const top20EconomicProfit = sortedByEconomicProfit.slice(0, 20).reduce((sum, c) => sum + c.economicProfit, 0)
  const bottom20EconomicProfit = sortedByEconomicProfit.slice(-20).reduce((sum, c) => sum + c.economicProfit, 0)

  // RAROC distribution
  const rarocBuckets = [
    { bucket: '>15% (Excellent)', count: fullClientData.filter(c => c.raroc > 15).length, avgProfit: 0 },
    { bucket: '12-15% (Strong)', count: fullClientData.filter(c => c.raroc > 12 && c.raroc <= 15).length, avgProfit: 0 },
    { bucket: '8-12% (Acceptable)', count: fullClientData.filter(c => c.raroc > 8 && c.raroc <= 12).length, avgProfit: 0 },
    { bucket: '4-8% (Marginal)', count: fullClientData.filter(c => c.raroc > 4 && c.raroc <= 8).length, avgProfit: 0 },
    { bucket: '0-4% (Weak)', count: fullClientData.filter(c => c.raroc > 0 && c.raroc <= 4).length, avgProfit: 0 },
    { bucket: '<0% (Destroy Value)', count: fullClientData.filter(c => c.raroc <= 0).length, avgProfit: 0 }
  ]

  rarocBuckets.forEach(bucket => {
    let clients: typeof fullClientData = []
    if (bucket.bucket.includes('>15')) clients = fullClientData.filter(c => c.raroc > 15)
    else if (bucket.bucket.includes('12-15')) clients = fullClientData.filter(c => c.raroc > 12 && c.raroc <= 15)
    else if (bucket.bucket.includes('8-12')) clients = fullClientData.filter(c => c.raroc > 8 && c.raroc <= 12)
    else if (bucket.bucket.includes('4-8')) clients = fullClientData.filter(c => c.raroc > 4 && c.raroc <= 8)
    else if (bucket.bucket.includes('0-4')) clients = fullClientData.filter(c => c.raroc > 0 && c.raroc <= 4)
    else clients = fullClientData.filter(c => c.raroc <= 0)

    bucket.avgProfit = clients.length > 0 ? clients.reduce((sum, c) => sum + c.economicProfit, 0) / clients.length : 0
  })

  // Segment analysis
  const segments = ['Pension', 'Insurance', 'Asset Mgr', 'Corporate', 'Endowment', 'Foundation', 'Family Office', 'Hedge Fund', 'Sovereign']
  const segmentAnalysis = segments.map(seg => {
    const segClients = fullClientData.filter(c => c.segment === seg)
    if (segClients.length === 0) return null

    return {
      segment: seg,
      clientCount: segClients.length,
      totalRevenue: segClients.reduce((sum, c) => sum + c.revenue, 0),
      avgRAROC: segClients.reduce((sum, c) => sum + c.raroc, 0) / segClients.length,
      economicProfit: segClients.reduce((sum, c) => sum + c.economicProfit, 0),
      avgAUC: segClients.reduce((sum, c) => sum + c.auc, 0) / segClients.length
    }
  }).filter(s => s !== null)

  return (
    <div className="space-y-6">
      {/* Header Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="metric-card">
          <div className="text-sm text-gray-600 mb-1">Total Economic Profit</div>
          <div className="text-2xl font-bold text-green-600">{formatCurrency(totalEconomicProfit, 0)}M</div>
          <div className="text-xs text-gray-500 mt-1">After capital charge</div>
        </div>
        <div className="metric-card">
          <div className="text-sm text-gray-600 mb-1">Average RAROC</div>
          <div className="text-2xl font-bold text-blue-600">{avgRAROC.toFixed(1)}%</div>
          <div className="text-xs text-gray-500 mt-1">Across all clients</div>
        </div>
        <div className="metric-card">
          <div className="text-sm text-gray-600 mb-1">Value Creating</div>
          <div className="text-2xl font-bold text-green-600">{profitableClients.length}</div>
          <div className="text-xs text-gray-500 mt-1">{((profitableClients.length / fullClientData.length) * 100).toFixed(0)}% of clients</div>
        </div>
        <div className="metric-card">
          <div className="text-sm text-gray-600 mb-1">Value Destroying</div>
          <div className="text-2xl font-bold text-red-600">{unprofitableClients.length}</div>
          <div className="text-xs text-red-500 mt-1">Destroying {formatCurrency(Math.abs(unprofitableClients.reduce((s, c) => s + c.economicProfit, 0)), 0)}M</div>
        </div>
      </div>

      {/* Key Insight Banner */}
      <div className="metric-card border-l-4 border-amber-500">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Client Profitability Concentration</h3>
            <p className="text-sm text-gray-700 mb-2">
              <strong>Top 20 clients</strong> generate <strong>{formatCurrency(top20EconomicProfit, 0)}M</strong> economic profit
              while <strong>bottom 20 clients</strong> destroy <strong>{formatCurrency(Math.abs(bottom20EconomicProfit), 0)}M</strong> value.
              The top 40% of clients (by RAROC) generate 127% of total economic profit, subsidizing underperforming relationships.
            </p>
            <div className="flex gap-2 text-sm">
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full font-medium">
                Top 20: +{formatCurrency(top20EconomicProfit, 0)}M
              </span>
              <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full font-medium">
                Bottom 20: {formatCurrency(bottom20EconomicProfit, 0)}M
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* RAROC Distribution */}
      <div className="metric-card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Client RAROC Distribution</h3>
        <div className="h-80 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={rarocBuckets} margin={{ top: 20, right: 30, left: 60, bottom: 80 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="bucket"
                angle={-20}
                textAnchor="end"
                height={100}
                interval={0}
              />
              <YAxis
                yAxisId="left"
                label={{ value: 'Number of Clients', angle: -90, position: 'insideLeft' }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                label={{ value: 'Avg Economic Profit ($M)', angle: 90, position: 'insideRight' }}
              />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="count" name="Client Count" fill="#3b82f6" />
              <Line yAxisId="right" type="monotone" dataKey="avgProfit" name="Avg Econ Profit" stroke="#10b981" strokeWidth={3} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-6 gap-2">
          {rarocBuckets.map((bucket, idx) => (
            <div key={idx} className={`p-3 rounded-lg border ${
              bucket.bucket.includes('>15') ? 'border-green-500 bg-green-50' :
              bucket.bucket.includes('12-15') ? 'border-blue-500 bg-blue-50' :
              bucket.bucket.includes('8-12') ? 'border-cyan-500 bg-cyan-50' :
              bucket.bucket.includes('4-8') ? 'border-yellow-500 bg-yellow-50' :
              bucket.bucket.includes('0-4') ? 'border-orange-500 bg-orange-50' :
              'border-red-500 bg-red-50'
            }`}>
              <div className="text-xs text-gray-600">{bucket.bucket}</div>
              <div className="text-2xl font-bold text-gray-900">{bucket.count}</div>
              <div className="text-xs text-gray-600 mt-1">
                Avg: {formatCurrency(bucket.avgProfit, 1)}M
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top 15 Clients by RAROC */}
      <div className="metric-card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top 15 Clients by RAROC</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rank</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Segment</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Revenue</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Direct Costs</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Capital Charge</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Economic Profit</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">RAROC</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tier</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedByRAROC.slice(0, 15).map((client, idx) => (
                <tr key={client.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{idx + 1}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{client.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{client.segment}</td>
                  <td className="px-4 py-3 text-sm text-right">{formatCurrency(client.revenue, 1)}M</td>
                  <td className="px-4 py-3 text-sm text-right text-red-600">{formatCurrency(client.directCosts, 1)}M</td>
                  <td className="px-4 py-3 text-sm text-right text-orange-600">{formatCurrency(client.capitalCharge, 1)}M</td>
                  <td className="px-4 py-3 text-sm text-right font-semibold text-green-600">
                    {formatCurrency(client.economicProfit, 1)}M
                  </td>
                  <td className="px-4 py-3 text-sm text-right">
                    <span className="font-bold text-lg text-blue-600">{client.raroc.toFixed(1)}%</span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                      client.tier === 'Platinum' ? 'bg-purple-100 text-purple-800' :
                      client.tier === 'Gold' ? 'bg-yellow-100 text-yellow-800' :
                      client.tier === 'Silver' ? 'bg-gray-100 text-gray-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {client.tier}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom 10 Clients - Value Destroyers */}
      <div className="metric-card border-l-4 border-red-500">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Bottom 10 Clients - Value Destroyers</h3>
        <div className="overflow-x-auto mb-4">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-red-50">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Segment</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Revenue</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Economic Profit</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">RAROC</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedByRAROC.slice(-10).reverse().map((client) => (
                <tr key={client.id} className="hover:bg-red-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{client.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{client.segment}</td>
                  <td className="px-4 py-3 text-sm text-right">{formatCurrency(client.revenue, 1)}M</td>
                  <td className="px-4 py-3 text-sm text-right font-semibold text-red-600">
                    {formatCurrency(client.economicProfit, 1)}M
                  </td>
                  <td className="px-4 py-3 text-sm text-right font-bold text-red-600">
                    {client.raroc.toFixed(1)}%
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded font-medium">
                      {client.raroc < -5 ? 'Exit Relationship' : client.raroc < 0 ? 'Reprice or Exit' : 'Reprice'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 bg-red-50 rounded-lg">
          <h4 className="text-sm font-semibold text-red-900 mb-2">Recommended Actions for Value Destroyers</h4>
          <div className="space-y-2 text-sm text-red-800">
            <p>• <strong>Immediate:</strong> Reprice bottom 10 clients to achieve minimum 6% RAROC or prepare for relationship exit</p>
            <p>• <strong>6 months:</strong> Exit relationships with RAROC &lt; -5% (currently {sortedByRAROC.filter(c => c.raroc < -5).length} clients destroying {formatCurrency(Math.abs(sortedByRAROC.filter(c => c.raroc < -5).reduce((s, c) => s + c.economicProfit, 0)), 1)}M)</p>
            <p>• <strong>Impact:</strong> Eliminating bottom 10 would improve economic profit by {formatCurrency(Math.abs(sortedByRAROC.slice(-10).reduce((s, c) => s + c.economicProfit, 0)), 1)}M annually</p>
          </div>
        </div>
      </div>

      {/* Segment Analysis */}
      <div className="metric-card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Profitability by Client Segment</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Segment</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Clients</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total Revenue</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Economic Profit</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Avg RAROC</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Avg AUC</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Performance</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {segmentAnalysis.sort((a, b) => (b?.avgRAROC ?? 0) - (a?.avgRAROC ?? 0)).map((seg, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{seg?.segment}</td>
                  <td className="px-4 py-3 text-sm text-right">{seg?.clientCount}</td>
                  <td className="px-4 py-3 text-sm text-right font-medium">{formatCurrency(seg?.totalRevenue ?? 0, 1)}M</td>
                  <td className="px-4 py-3 text-sm text-right font-semibold">
                    <span className={(seg?.economicProfit ?? 0) > 0 ? 'text-green-600' : 'text-red-600'}>
                      {formatCurrency(seg?.economicProfit ?? 0, 1)}M
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-right">
                    <span className={`font-bold ${
                      (seg?.avgRAROC ?? 0) > 12 ? 'text-green-600' :
                      (seg?.avgRAROC ?? 0) > 6 ? 'text-blue-600' :
                      'text-orange-600'
                    }`}>
                      {seg?.avgRAROC.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-right">{formatCurrency(seg?.avgAUC ?? 0, 0)}B</td>
                  <td className="px-4 py-3 text-sm">
                    {(seg?.avgRAROC ?? 0) > 12 && <span className="flex items-center gap-1 text-green-600"><TrendingUp className="w-4 h-4" /> Strong</span>}
                    {(seg?.avgRAROC ?? 0) > 6 && (seg?.avgRAROC ?? 0) <= 12 && <span className="flex items-center gap-1 text-blue-600"><TrendingUp className="w-4 h-4" /> Good</span>}
                    {(seg?.avgRAROC ?? 0) <= 6 && <span className="flex items-center gap-1 text-orange-600"><TrendingDown className="w-4 h-4" /> Weak</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-900">
            <strong>Segment Insight:</strong> {segmentAnalysis[0]?.segment} generates highest avg RAROC at {segmentAnalysis[0]?.avgRAROC.toFixed(1)}%.
            Focus growth efforts on high-RAROC segments. Consider strategic review of bottom-performing segments.
          </p>
        </div>
      </div>
    </div>
  )
}
