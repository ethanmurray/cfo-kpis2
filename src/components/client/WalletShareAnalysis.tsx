import { formatCurrency, formatPercent } from '../../utils/dataGenerators'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, ComposedChart, Area, Line } from 'recharts'

export default function WalletShareAnalysis() {
  // Top 30 clients wallet share data
  const walletShareData = [
    {
      client: 'Global Pension Fund A',
      ourRevenue: 45.2,
      estimatedTotalSpend: 125,
      walletShare: 36.2,
      products: ['Custody', 'Fund Admin', 'Securities Lending'],
      productsUsed: 3,
      productsAvailable: 7,
      crossSellOpportunity: 58,
      tier: 'Platinum'
    },
    {
      client: 'Insurance Company B',
      ourRevenue: 38.5,
      estimatedTotalSpend: 95,
      walletShare: 40.5,
      products: ['Custody', 'Fund Admin', 'Middle Office'],
      productsUsed: 3,
      productsAvailable: 7,
      crossSellOpportunity: 42,
      tier: 'Platinum'
    },
    {
      client: 'Asset Manager C',
      ourRevenue: 52.3,
      estimatedTotalSpend: 185,
      walletShare: 28.3,
      products: ['Custody', 'Fund Admin'],
      productsUsed: 2,
      productsAvailable: 7,
      crossSellOpportunity: 95,
      tier: 'Platinum'
    },
    {
      client: 'Sovereign Wealth Fund D',
      ourRevenue: 41.8,
      estimatedTotalSpend: 155,
      walletShare: 27.0,
      products: ['Custody'],
      productsUsed: 1,
      productsAvailable: 7,
      crossSellOpportunity: 113,
      tier: 'Platinum'
    },
    {
      client: 'Corporate Pension E',
      ourRevenue: 28.5,
      estimatedTotalSpend: 62,
      walletShare: 46.0,
      products: ['Custody', 'Fund Admin', 'Securities Lending', 'FX'],
      productsUsed: 4,
      productsAvailable: 7,
      crossSellOpportunity: 22,
      tier: 'Gold'
    },
    {
      client: 'Endowment F',
      ourRevenue: 22.8,
      estimatedTotalSpend: 48,
      walletShare: 47.5,
      products: ['Custody', 'Fund Admin', 'Middle Office'],
      productsUsed: 3,
      productsAvailable: 7,
      crossSellOpportunity: 18,
      tier: 'Gold'
    },
    {
      client: 'Family Office G',
      ourRevenue: 18.5,
      estimatedTotalSpend: 82,
      walletShare: 22.6,
      products: ['Custody'],
      productsUsed: 1,
      productsAvailable: 7,
      crossSellOpportunity: 63,
      tier: 'Gold'
    },
    {
      client: 'Mutual Fund Complex H',
      ourRevenue: 35.2,
      estimatedTotalSpend: 145,
      walletShare: 24.3,
      products: ['Custody', 'Fund Admin'],
      productsUsed: 2,
      productsAvailable: 7,
      crossSellOpportunity: 110,
      tier: 'Gold'
    },
    {
      client: 'Insurance Company I',
      ourRevenue: 25.8,
      estimatedTotalSpend: 72,
      walletShare: 35.8,
      products: ['Custody', 'Middle Office'],
      productsUsed: 2,
      productsAvailable: 7,
      crossSellOpportunity: 46,
      tier: 'Silver'
    },
    {
      client: 'Regional Pension J',
      ourRevenue: 19.2,
      estimatedTotalSpend: 88,
      walletShare: 21.8,
      products: ['Custody'],
      productsUsed: 1,
      productsAvailable: 7,
      crossSellOpportunity: 69,
      tier: 'Silver'
    }
  ]

  // Add more clients
  for (let i = 11; i <= 30; i++) {
    const ourRevenue = Math.random() * 30 + 5
    const walletShare = Math.random() * 40 + 15
    const estimatedTotalSpend = ourRevenue / (walletShare / 100)
    const productsUsed = Math.floor(Math.random() * 4) + 1
    const crossSellOpportunity = estimatedTotalSpend * (1 - walletShare / 100)

    walletShareData.push({
      client: `Client ${String.fromCharCode(65 + i - 1)}`,
      ourRevenue,
      estimatedTotalSpend,
      walletShare,
      products: ['Custody'],
      productsUsed,
      productsAvailable: 7,
      crossSellOpportunity,
      tier: walletShare > 40 ? 'Gold' : walletShare > 25 ? 'Silver' : 'Bronze'
    })
  }

  const totalOpportunity = walletShareData.reduce((sum, c) => sum + c.crossSellOpportunity, 0)
  const avgWalletShare = walletShareData.reduce((sum, c) => sum + c.walletShare, 0) / walletShareData.length

  // Product penetration analysis
  const productPenetration = [
    { product: 'Custody', penetration: 100, revenue: 850, clients: 30, avgWallet: 35 },
    { product: 'Fund Administration', penetration: 40, revenue: 425, clients: 12, avgWallet: 42 },
    { product: 'Securities Lending', penetration: 23, revenue: 185, clients: 7, avgWallet: 48 },
    { product: 'Middle Office', penetration: 17, revenue: 145, clients: 5, avgWallet: 38 },
    { product: 'FX Services', penetration: 13, revenue: 95, clients: 4, avgWallet: 52 },
    { product: 'Collateral Management', penetration: 10, revenue: 72, clients: 3, avgWallet: 45 },
    { product: 'Performance & Analytics', penetration: 7, revenue: 48, clients: 2, avgWallet: 55 }
  ]

  // Cross-sell opportunity matrix
  const crossSellMatrix = [
    { segment: 'Pension Funds', clientCount: 8, avgWalletShare: 32.5, topOpportunity: 'Securities Lending', opportunityValue: 125 },
    { segment: 'Insurance Companies', clientCount: 5, avgWalletShare: 38.2, topOpportunity: 'Collateral Mgmt', opportunityValue: 88 },
    { segment: 'Asset Managers', clientCount: 9, avgWalletShare: 26.8, topOpportunity: 'Fund Admin', opportunityValue: 215 },
    { segment: 'Sovereign/Endowment', clientCount: 4, avgWalletShare: 35.5, topOpportunity: 'FX Services', opportunityValue: 92 },
    { segment: 'Family Office/HNW', clientCount: 4, avgWalletShare: 24.2, topOpportunity: 'Middle Office', opportunityValue: 68 }
  ]

  // Wallet share vs product usage
  const walletVsProducts = walletShareData.map(c => ({
    name: c.client.split(' ').slice(0, 3).join(' '),
    walletShare: c.walletShare,
    productsUsed: c.productsUsed,
    opportunity: c.crossSellOpportunity
  }))

  // Competitive losses (estimated)
  const competitiveLosses = [
    { competitor: 'BNY Mellon', lostWallet: 285, clients: 15, primaryProduct: 'Fund Admin', avgLoss: 19 },
    { competitor: 'State Street', lostWallet: 220, clients: 18, primaryProduct: 'Custody', avgLoss: 12 },
    { competitor: 'JPMorgan', lostWallet: 195, clients: 12, primaryProduct: 'Securities Lending', avgLoss: 16 },
    { competitor: 'Citi', lostWallet: 165, clients: 14, primaryProduct: 'Middle Office', avgLoss: 12 },
    { competitor: 'Brown Brothers', lostWallet: 125, clients: 8, primaryProduct: 'FX Services', avgLoss: 16 }
  ]

  const totalLostWallet = competitiveLosses.reduce((sum, c) => sum + c.lostWallet, 0)

  return (
    <div className="space-y-6">
      {/* Header Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="metric-card">
          <div className="text-sm text-gray-600 mb-1">Avg Wallet Share</div>
          <div className="text-2xl font-bold text-blue-600">{avgWalletShare.toFixed(1)}%</div>
          <div className="text-xs text-gray-500 mt-1">Top 30 clients</div>
        </div>
        <div className="metric-card">
          <div className="text-sm text-gray-600 mb-1">Cross-Sell Opportunity</div>
          <div className="text-2xl font-bold text-green-600">{formatCurrency(totalOpportunity, 0)}M</div>
          <div className="text-xs text-green-500 mt-1">Addressable revenue</div>
        </div>
        <div className="metric-card">
          <div className="text-sm text-gray-600 mb-1">Lost to Competitors</div>
          <div className="text-2xl font-bold text-red-600">{formatCurrency(totalLostWallet, 0)}M</div>
          <div className="text-xs text-red-500 mt-1">Annual wallet leakage</div>
        </div>
        <div className="metric-card">
          <div className="text-sm text-gray-600 mb-1">Product Penetration</div>
          <div className="text-2xl font-bold text-purple-600">2.4</div>
          <div className="text-xs text-gray-500 mt-1">Avg products per client</div>
        </div>
      </div>

      {/* Strategic Insight */}
      <div className="metric-card border-l-4 border-green-500">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-1">
            <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Wallet Share Expansion Opportunity</h3>
            <p className="text-sm text-gray-700 mb-3">
              We capture only <strong>{avgWalletShare.toFixed(0)}%</strong> of our top clients' total custody/servicing spend.
              <strong> {formatCurrency(totalOpportunity, 0)}M</strong> addressable opportunity exists through product cross-sell.
              Increasing wallet share from 30% to 40% across top 50 clients would generate
              <strong> +{formatCurrency(totalOpportunity * 0.33, 0)}M</strong> incremental revenue.
            </p>
            <div className="flex gap-3">
              <div className="px-3 py-2 bg-green-100 rounded-lg">
                <div className="text-xs text-green-700">High Priority</div>
                <div className="text-lg font-bold text-green-900">12 clients</div>
                <div className="text-xs text-green-700">&lt;25% wallet share</div>
              </div>
              <div className="px-3 py-2 bg-blue-100 rounded-lg">
                <div className="text-xs text-blue-700">Quick Wins</div>
                <div className="text-lg font-bold text-blue-900">{formatCurrency(totalOpportunity * 0.25, 0)}M</div>
                <div className="text-xs text-blue-700">Fund admin cross-sell</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wallet Share by Client */}
      <div className="metric-card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top 30 Clients - Wallet Share Analysis</h3>
        <div className="overflow-x-auto mb-4">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Our Revenue</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Est. Total Spend</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Wallet Share</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Products Used</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Cross-Sell Opp</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {walletShareData.slice(0, 20).sort((a, b) => b.crossSellOpportunity - a.crossSellOpportunity).map((client, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{client.client}</td>
                  <td className="px-4 py-3 text-sm text-right">{formatCurrency(client.ourRevenue, 1)}M</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-600">{formatCurrency(client.estimatedTotalSpend, 1)}M</td>
                  <td className="px-4 py-3 text-sm text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span className={`font-semibold ${
                        client.walletShare > 40 ? 'text-green-600' :
                        client.walletShare > 25 ? 'text-blue-600' :
                        'text-orange-600'
                      }`}>
                        {client.walletShare.toFixed(1)}%
                      </span>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            client.walletShare > 40 ? 'bg-green-500' :
                            client.walletShare > 25 ? 'bg-blue-500' :
                            'bg-orange-500'
                          }`}
                          style={{ width: `${Math.min(client.walletShare, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-right">
                    <span className="text-gray-900">{client.productsUsed}</span>
                    <span className="text-gray-500"> / {client.productsAvailable}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-right font-semibold text-green-600">
                    {formatCurrency(client.crossSellOpportunity, 1)}M
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                      client.walletShare < 25 ? 'bg-red-100 text-red-800' :
                      client.walletShare < 35 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {client.walletShare < 25 ? 'High' : client.walletShare < 35 ? 'Medium' : 'Low'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Penetration */}
      <div className="metric-card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Penetration & Cross-Sell Potential</h3>
        <div className="h-80 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={productPenetration} margin={{ top: 20, right: 30, left: 60, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="product"
                angle={-20}
                textAnchor="end"
                height={80}
                interval={0}
              />
              <YAxis
                yAxisId="left"
                label={{ value: 'Penetration (%)', angle: -90, position: 'insideLeft' }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                label={{ value: 'Revenue ($M)', angle: 90, position: 'insideRight' }}
              />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="penetration" name="Client Penetration %" fill="#3b82f6" />
              <Line yAxisId="right" type="monotone" dataKey="revenue" name="Revenue" stroke="#10b981" strokeWidth={3} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {productPenetration.map((prod, idx) => (
            <div key={idx} className="p-3 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
              <div className="text-xs text-gray-600 mb-1">{prod.product}</div>
              <div className="text-xl font-bold text-blue-600">{prod.penetration}%</div>
              <div className="text-xs text-gray-600 mt-1">{prod.clients} clients</div>
              <div className="text-xs text-green-600 mt-1">{formatCurrency(prod.revenue, 0)}M rev</div>
              <div className="text-xs text-purple-600 mt-1">{prod.avgWallet}% wallet</div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
          <h4 className="text-sm font-semibold text-purple-900 mb-2">Cross-Sell Strategy</h4>
          <div className="space-y-2 text-sm text-purple-800">
            <p>• <strong>Fund Administration:</strong> Only 40% penetration. Target Asset Managers with $215M opportunity</p>
            <p>• <strong>Securities Lending:</strong> 23% penetration but 48% wallet share when adopted. High-value add product</p>
            <p>• <strong>FX Services:</strong> Lowest penetration (13%) but highest wallet share (52%). Premium product for larger clients</p>
            <p>• <strong>Quick Win:</strong> Sell Securities Lending to existing custody clients - $280M addressable market</p>
          </div>
        </div>
      </div>

      {/* Cross-Sell Opportunity by Segment */}
      <div className="metric-card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Cross-Sell Opportunity by Segment</h3>
        <div className="overflow-x-auto mb-4">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Segment</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Clients</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Avg Wallet Share</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Top Opportunity</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Opportunity Value</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {crossSellMatrix.sort((a, b) => b.opportunityValue - a.opportunityValue).map((seg, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{seg.segment}</td>
                  <td className="px-4 py-3 text-sm text-right">{seg.clientCount}</td>
                  <td className="px-4 py-3 text-sm text-right">
                    <span className={`font-semibold ${
                      seg.avgWalletShare > 35 ? 'text-green-600' :
                      seg.avgWalletShare > 25 ? 'text-blue-600' :
                      'text-orange-600'
                    }`}>
                      {seg.avgWalletShare.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">{seg.topOpportunity}</td>
                  <td className="px-4 py-3 text-sm text-right font-bold text-green-600">
                    {formatCurrency(seg.opportunityValue, 0)}M
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded font-medium">
                      Target Campaign
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h4 className="text-sm font-semibold text-green-900 mb-2">Phase 1: Quick Wins</h4>
            <p className="text-sm text-green-800">
              Asset Manager fund admin cross-sell: <strong>{formatCurrency(215, 0)}M</strong> opportunity.
              9 clients, avg 27% wallet share. Target 50% penetration in 12 months.
            </p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">Phase 2: Relationship Deepening</h4>
            <p className="text-sm text-blue-800">
              Pension fund securities lending: <strong>{formatCurrency(125, 0)}M</strong> opportunity.
              8 clients, current 33% wallet share. High margin product.
            </p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <h4 className="text-sm font-semibold text-purple-900 mb-2">Phase 3: Premium Services</h4>
            <p className="text-sm text-purple-800">
              FX & collateral mgmt for Sovereign/Insurance: <strong>{formatCurrency(180, 0)}M</strong>.
              Complex products requiring relationship strength.
            </p>
          </div>
        </div>
      </div>

      {/* Competitive Analysis */}
      <div className="metric-card border-l-4 border-red-500">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Wallet Lost to Competitors</h3>
        <div className="overflow-x-auto mb-4">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-red-50">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Competitor</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Lost Wallet</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Affected Clients</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Primary Product</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Avg Loss/Client</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Defense Strategy</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {competitiveLosses.map((comp, idx) => (
                <tr key={idx} className="hover:bg-red-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{comp.competitor}</td>
                  <td className="px-4 py-3 text-sm text-right font-bold text-red-600">
                    {formatCurrency(comp.lostWallet, 0)}M
                  </td>
                  <td className="px-4 py-3 text-sm text-right">{comp.clients}</td>
                  <td className="px-4 py-3 text-sm">{comp.primaryProduct}</td>
                  <td className="px-4 py-3 text-sm text-right font-medium">
                    {formatCurrency(comp.avgLoss, 0)}M
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className="text-xs px-2 py-1 bg-orange-100 text-orange-800 rounded font-medium">
                      {comp.primaryProduct === 'Fund Admin' ? 'Product Parity' :
                       comp.primaryProduct === 'Securities Lending' ? 'Enhanced Terms' :
                       'Competitive Pricing'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 bg-red-50 rounded-lg">
          <h4 className="text-sm font-semibold text-red-900 mb-2">Competitive Defense Priority</h4>
          <p className="text-sm text-red-800 mb-2">
            <strong>{formatCurrency(totalLostWallet, 0)}M</strong> annual revenue going to competitors across our client base.
            BNY Mellon capturing largest share ({formatCurrency(competitiveLosses[0].lostWallet, 0)}M) primarily in fund administration.
          </p>
          <div className="space-y-1 text-sm text-red-800">
            <p>• <strong>Immediate:</strong> Match BNY Mellon fund admin capabilities - $285M at risk</p>
            <p>• <strong>Q3 2024:</strong> Launch enhanced securities lending program to recapture State Street share</p>
            <p>• <strong>2025:</strong> Develop middle office platform to compete with Citi's integrated offering</p>
          </div>
        </div>
      </div>
    </div>
  )
}
