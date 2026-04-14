import { formatCurrency, formatPercent } from '../../utils/dataGenerators'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, Cell, LineChart as RechartsLineChart, Line } from 'recharts'

export default function ProductPricing() {
  // Product pricing analysis
  const productPricing = [
    {
      product: 'Custody Services',
      avgFeeRate: 8.5,
      costToServe: 3.2,
      margin: 5.3,
      peerAvg: 9.2,
      pricingPower: 'Medium',
      elasticity: -0.8,
      recommendedFee: 9.0
    },
    {
      product: 'Fund Administration',
      avgFeeRate: 11.2,
      costToServe: 5.8,
      margin: 5.4,
      peerAvg: 10.8,
      pricingPower: 'Strong',
      elasticity: -0.5,
      recommendedFee: 11.5
    },
    {
      product: 'Securities Lending',
      avgFeeRate: 24.5,
      costToServe: 4.2,
      margin: 20.3,
      peerAvg: 26.0,
      pricingPower: 'Strong',
      elasticity: -0.6,
      recommendedFee: 26.0
    },
    {
      product: 'Middle Office Services',
      avgFeeRate: 15.8,
      costToServe: 18.5,
      margin: -2.7,
      peerAvg: 22.0,
      pricingPower: 'Weak',
      elasticity: -1.4,
      recommendedFee: 22.0
    },
    {
      product: 'FX Services',
      avgFeeRate: 3.2,
      costToServe: 0.9,
      margin: 2.3,
      peerAvg: 3.5,
      pricingPower: 'Medium',
      elasticity: -1.1,
      recommendedFee: 3.5
    },
    {
      product: 'Performance & Analytics',
      avgFeeRate: 18.5,
      costToServe: 12.2,
      margin: 6.3,
      peerAvg: 20.0,
      pricingPower: 'Medium',
      elasticity: -0.9,
      recommendedFee: 19.5
    },
    {
      product: 'Collateral Management',
      avgFeeRate: 12.8,
      costToServe: 10.5,
      margin: 2.3,
      peerAvg: 15.0,
      pricingPower: 'Medium',
      elasticity: -1.0,
      recommendedFee: 14.5
    },
    {
      product: 'Corporate Actions',
      avgFeeRate: 0.85,
      costToServe: 1.2,
      margin: -0.35,
      peerAvg: 1.5,
      pricingPower: 'Weak',
      elasticity: -1.8,
      recommendedFee: 1.4
    }
  ]

  // Fee structure options
  const feeStructureComparison = [
    {
      structure: 'Tiered AUC-Based',
      products: ['Custody', 'Fund Admin'],
      avgRevenue: 2850,
      avgRAROC: 32.5,
      clientSatisfaction: 78,
      pros: 'Predictable, scales with growth, easy to understand',
      cons: 'Price compression on large accounts, no activity linkage',
      complexity: 'Low'
    },
    {
      structure: 'Activity-Based',
      products: ['Middle Office', 'Corporate Actions', 'FX'],
      avgRevenue: 1005,
      avgRAROC: 8.2,
      clientSatisfaction: 62,
      pros: 'Captures true cost, incentivizes efficiency',
      cons: 'Complex billing, client disputes, unpredictable revenue',
      complexity: 'High'
    },
    {
      structure: 'Hybrid (Base + Activity)',
      products: ['Securities Lending', 'Collateral Mgmt'],
      avgRevenue: 1000,
      avgRAROC: 18.5,
      clientSatisfaction: 72,
      pros: 'Balanced, upside potential, fair allocation',
      cons: 'Moderate complexity, requires tracking',
      complexity: 'Medium'
    },
    {
      structure: 'Performance-Based',
      products: ['Performance & Analytics'],
      avgRevenue: 285,
      avgRAROC: 15.9,
      clientSatisfaction: 85,
      pros: 'Aligns interests, premium pricing for value',
      cons: 'Revenue volatility, complex calculation',
      complexity: 'High'
    }
  ]

  // Pricing elasticity scenarios
  const elasticityScenarios = [
    { product: 'Custody', feeChange: -10, volumeChange: 8.0, revenueImpact: -2.0, profitImpact: -45 },
    { product: 'Custody', feeChange: -5, volumeChange: 4.0, revenueImpact: -1.0, profitImpact: -22 },
    { product: 'Custody', feeChange: 0, volumeChange: 0, revenueImpact: 0, profitImpact: 0 },
    { product: 'Custody', feeChange: 5, volumeChange: -4.0, revenueImpact: 1.0, profitImpact: 38 },
    { product: 'Custody', feeChange: 10, volumeChange: -8.0, revenueImpact: 2.0, profitImpact: 72 },
    { product: 'Custody', feeChange: 15, volumeChange: -12.0, revenueImpact: 3.0, profitImpact: 98 }
  ]

  // Value-based pricing opportunities
  const valuePricing = [
    {
      service: 'ESG Reporting Add-On',
      currentPrice: 0,
      clientValue: 125,
      recommendedPrice: 45,
      penetration: 0,
      potentialRevenue: 195,
      implementation: 'Bundle with Fund Admin'
    },
    {
      service: 'Real-Time Analytics Dashboard',
      currentPrice: 0,
      clientValue: 85,
      recommendedPrice: 28,
      penetration: 0,
      potentialRevenue: 142,
      implementation: 'Tier 1 clients only'
    },
    {
      service: 'Automated Tax Optimization',
      currentPrice: 0,
      clientValue: 250,
      recommendedPrice: 75,
      penetration: 0,
      potentialRevenue: 88,
      implementation: 'High-NW clients'
    },
    {
      service: 'API Integration Premium',
      currentPrice: 0,
      clientValue: 45,
      recommendedPrice: 15,
      penetration: 0,
      potentialRevenue: 68,
      implementation: 'Tech-forward clients'
    }
  ]

  const totalValuePricingOpp = valuePricing.reduce((sum, v) => sum + v.potentialRevenue, 0)

  // Discount analysis
  const discountTiers = [
    { tier: 'No Discount', clients: 285, avgRevenue: 2.8, avgRAROC: 28.5, reason: 'Premium service/new clients' },
    { tier: '0-10% Discount', clients: 420, avgRevenue: 2.5, avgRAROC: 22.8, reason: 'Standard commercial terms' },
    { tier: '10-20% Discount', clients: 195, avgRevenue: 2.1, avgRAROC: 16.2, reason: 'Large volume discounts' },
    { tier: '20-30% Discount', clients: 85, avgRevenue: 1.8, avgRAROC: 8.5, reason: 'Strategic relationships' },
    { tier: '>30% Discount', clients: 15, avgRevenue: 1.2, avgRAROC: -2.8, reason: 'Loss leaders/legacy' }
  ]

  return (
    <div className="space-y-6">
      {/* Header Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="metric-card">
          <div className="text-sm text-gray-600 mb-1">Price Realization</div>
          <div className="text-2xl font-bold text-amber-600">88%</div>
          <div className="text-xs text-amber-500 mt-1">vs peer benchmark</div>
        </div>
        <div className="metric-card">
          <div className="text-sm text-gray-600 mb-1">Pricing Gap</div>
          <div className="text-2xl font-bold text-red-600">-12%</div>
          <div className="text-xs text-red-500 mt-1">Below market rates</div>
        </div>
        <div className="metric-card">
          <div className="text-sm text-gray-600 mb-1">Price Increase Opportunity</div>
          <div className="text-2xl font-bold text-green-600">+{formatCurrency(285, 0)}M</div>
          <div className="text-xs text-green-500 mt-1">To market parity</div>
        </div>
        <div className="metric-card">
          <div className="text-sm text-gray-600 mb-1">Value-Based Pricing</div>
          <div className="text-2xl font-bold text-purple-600">+{formatCurrency(totalValuePricingOpp, 0)}M</div>
          <div className="text-xs text-purple-500 mt-1">New service tiers</div>
        </div>
      </div>

      {/* Product Pricing Analysis */}
      <div className="metric-card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Pricing vs Cost to Serve vs Market</h3>
        <div className="h-96 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={productPricing} margin={{ top: 20, right: 30, left: 60, bottom: 80 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="product"
                angle={-20}
                textAnchor="end"
                height={100}
                interval={0}
              />
              <YAxis label={{ value: 'Basis Points', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="costToServe" name="Cost to Serve" fill="#ef4444" stackId="a" />
              <Bar dataKey="margin" name="Margin" fill="#10b981" stackId="a" />
              <Bar dataKey="peerAvg" name="Peer Average" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Our Fee Rate</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Cost to Serve</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Margin</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Peer Avg</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Gap</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Recommended</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {productPricing.map((product, idx) => {
                const gap = product.avgFeeRate - product.peerAvg
                const gapPct = (gap / product.peerAvg) * 100
                return (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{product.product}</td>
                    <td className="px-4 py-3 text-sm text-right font-semibold">{product.avgFeeRate.toFixed(1)} bps</td>
                    <td className="px-4 py-3 text-sm text-right text-red-600">{product.costToServe.toFixed(1)} bps</td>
                    <td className="px-4 py-3 text-sm text-right">
                      <span className={product.margin >= 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                        {product.margin.toFixed(1)} bps
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-blue-600">{product.peerAvg.toFixed(1)} bps</td>
                    <td className="px-4 py-3 text-sm text-right">
                      <span className={`font-bold ${gap >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {gap > 0 ? '+' : ''}{gap.toFixed(1)} ({gapPct.toFixed(0)}%)
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-right font-bold text-purple-600">
                      {product.recommendedFee.toFixed(1)} bps
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`text-xs px-2 py-1 rounded font-medium ${
                        Math.abs(gapPct) < 5 ? 'bg-green-100 text-green-800' :
                        Math.abs(gapPct) < 15 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {Math.abs(gapPct) < 5 ? 'Hold' :
                         gapPct < 0 ? 'Increase' : 'Review'}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
          <h4 className="text-sm font-semibold text-red-900 mb-2">Critical Pricing Issues</h4>
          <div className="space-y-1 text-sm text-red-800">
            <p>• <strong>Middle Office:</strong> Priced at 15.8 bps, costs 18.5 bps to deliver = -2.7 bps margin. Peer avg 22.0 bps. Underpriced by 28%.</p>
            <p>• <strong>Securities Lending:</strong> 24.5 bps vs peer 26.0 bps. High margin (20.3 bps) but leaving revenue on table. Increase to 26 bps = +$28M.</p>
            <p>• <strong>Collateral Mgmt:</strong> 12.8 bps vs peer 15.0 bps. Underpriced by 17%. Thin margins (2.3 bps) need pricing power or cost reduction.</p>
          </div>
        </div>
      </div>

      {/* Fee Structure Analysis */}
      <div className="metric-card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Fee Structure Strategy by Product</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          {feeStructureComparison.map((structure, idx) => (
            <div key={idx} className={`p-4 rounded-lg border-2 ${
              structure.avgRAROC > 25 ? 'border-green-500 bg-green-50' :
              structure.avgRAROC > 15 ? 'border-blue-500 bg-blue-50' :
              'border-red-500 bg-red-50'
            }`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="font-semibold text-gray-900 mb-1">{structure.structure}</div>
                  <div className="text-xs text-gray-600">{structure.products.join(', ')}</div>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  structure.complexity === 'Low' ? 'bg-green-100 text-green-800' :
                  structure.complexity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {structure.complexity}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-3">
                <div>
                  <div className="text-xs text-gray-600">Revenue</div>
                  <div className="text-lg font-bold text-gray-900">{formatCurrency(structure.avgRevenue, 0)}M</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600">RAROC</div>
                  <div className={`text-lg font-bold ${
                    structure.avgRAROC > 20 ? 'text-green-600' : 'text-orange-600'
                  }`}>
                    {structure.avgRAROC.toFixed(1)}%
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-600">Client Sat</div>
                  <div className="text-lg font-bold text-blue-600">{structure.clientSatisfaction}%</div>
                </div>
              </div>
              <div className="text-xs space-y-1">
                <div className="text-green-700">✓ {structure.pros}</div>
                <div className="text-red-700">✗ {structure.cons}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="text-sm font-semibold text-blue-900 mb-2">Fee Structure Recommendation</h4>
          <p className="text-sm text-blue-800">
            <strong>Tiered AUC-based</strong> works well for core products (32.5% RAROC, 78% satisfaction).
            Shift Middle Office to <strong>Hybrid</strong> model: base custody fee + activity charges for complex workflows.
            This captures true cost (fixing -2.7 bps margin) while maintaining predictability. Expected revenue uplift: +$95M.
          </p>
        </div>
      </div>

      {/* Pricing Elasticity */}
      <div className="metric-card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Elasticity Analysis - Custody (Example)</h3>
        <div className="h-80 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsLineChart data={elasticityScenarios} margin={{ top: 20, right: 30, left: 60, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="feeChange"
                label={{ value: 'Fee Change (%)', position: 'bottom', offset: 0 }}
              />
              <YAxis
                yAxisId="left"
                label={{ value: 'Volume Change (%)', angle: -90, position: 'insideLeft' }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                label={{ value: 'Profit Impact ($M)', angle: 90, position: 'insideRight' }}
              />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="volumeChange" name="Volume Change" stroke="#ef4444" strokeWidth={2} />
              <Line yAxisId="right" type="monotone" dataKey="profitImpact" name="Profit Impact" stroke="#10b981" strokeWidth={3} />
            </RechartsLineChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h4 className="text-sm font-semibold text-green-900 mb-2">Optimal Strategy: +5-10% Fee Increase</h4>
            <p className="text-sm text-green-800">
              Elasticity -0.8 means 10% price increase → 8% volume loss → net +2% revenue = +$72M profit.
              Client retention: 92% (acceptable churn).
            </p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">Elasticity Insights</h4>
            <p className="text-sm text-blue-800">
              Custody relatively inelastic (-0.8) = pricing power.
              Securities Lending (-0.6) = even stronger.
              Middle Office (-1.4) = elastic, limited pricing power.
            </p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <h4 className="text-sm font-semibold text-purple-900 mb-2">Implementation</h4>
            <p className="text-sm text-purple-800">
              Phase increases: +3% immediately (grandfathered clients), +5% new business.
              Target Platinum/Gold tiers first (less price sensitive).
            </p>
          </div>
        </div>
      </div>

      {/* Value-Based Pricing */}
      <div className="metric-card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Value-Based Pricing Opportunities</h3>
        <div className="overflow-x-auto mb-4">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">New Service</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Client Value</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Recommended Price</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Value Capture %</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Potential Revenue</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Implementation</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {valuePricing.map((service, idx) => {
                const valueCapture = (service.recommendedPrice / service.clientValue) * 100
                return (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{service.service}</td>
                    <td className="px-4 py-3 text-sm text-right text-blue-600">{formatCurrency(service.clientValue, 0)}K</td>
                    <td className="px-4 py-3 text-sm text-right font-semibold text-green-600">
                      {formatCurrency(service.recommendedPrice, 0)}K
                    </td>
                    <td className="px-4 py-3 text-sm text-right font-medium">{valueCapture.toFixed(0)}%</td>
                    <td className="px-4 py-3 text-sm text-right font-bold text-purple-600">
                      {formatCurrency(service.potentialRevenue, 0)}M
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{service.implementation}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
          <h4 className="text-sm font-semibold text-purple-900 mb-2">Value Pricing Strategy</h4>
          <p className="text-sm text-purple-800 mb-2">
            Total opportunity: <strong>+{formatCurrency(totalValuePricingOpp, 0)}M</strong> from new premium services.
            Price at 30-35% of client value (industry standard for B2B software/services).
          </p>
          <p className="text-sm text-purple-800">
            <strong>Priority:</strong> ESG Reporting (+$195M) - highest demand, bundle with Fund Admin for 85% adoption.
            Launch Q3 2024, achieve 40% penetration by year-end = +$78M revenue in first 6 months.
          </p>
        </div>
      </div>

      {/* Discount Analysis */}
      <div className="metric-card border-l-4 border-amber-500">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Discount Structure & Impact</h3>
        <div className="overflow-x-auto mb-4">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Discount Tier</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Clients</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Avg Revenue</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">RAROC</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {discountTiers.map((tier, idx) => (
                <tr key={idx} className={`hover:bg-gray-50 ${
                  tier.avgRAROC < 0 ? 'bg-red-50' : ''
                }`}>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{tier.tier}</td>
                  <td className="px-4 py-3 text-sm text-right">{tier.clients}</td>
                  <td className="px-4 py-3 text-sm text-right font-semibold">{formatCurrency(tier.avgRevenue, 1)}M</td>
                  <td className="px-4 py-3 text-sm text-right">
                    <span className={`font-bold ${
                      tier.avgRAROC > 20 ? 'text-green-600' :
                      tier.avgRAROC > 10 ? 'text-blue-600' :
                      tier.avgRAROC > 0 ? 'text-orange-600' :
                      'text-red-600'
                    }`}>
                      {tier.avgRAROC.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{tier.reason}</td>
                  <td className="px-4 py-3 text-sm">
                    {tier.avgRAROC < 5 && (
                      <span className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded font-medium">
                        Reprice or Exit
                      </span>
                    )}
                    {tier.avgRAROC >= 5 && tier.avgRAROC < 15 && (
                      <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded font-medium">
                        Reduce Discount
                      </span>
                    )}
                    {tier.avgRAROC >= 15 && (
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded font-medium">
                        Maintain
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
          <h4 className="text-sm font-semibold text-amber-900 mb-2">Discount Discipline Opportunity</h4>
          <p className="text-sm text-amber-800 mb-2">
            <strong>15 clients</strong> receiving &gt;30% discounts destroy value (-2.8% RAROC).
            <strong>85 clients</strong> at 20-30% discounts earn only 8.5% RAROC (below hurdle).
          </p>
          <p className="text-sm text-amber-800">
            <strong>Action:</strong> Implement discount governance policy - require CFO approval for &gt;15% discounts.
            Reduce average discount from 12% to 8% = <strong>+$168M revenue</strong> with minimal client loss (95% retention expected).
          </p>
        </div>
      </div>
    </div>
  )
}
