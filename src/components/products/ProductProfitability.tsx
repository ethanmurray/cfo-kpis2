import { formatCurrency, formatPercent } from '../../utils/dataGenerators'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Line, Area } from 'recharts'
import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react'

export default function ProductProfitability() {
  // Product P&L data
  const productPnL = [
    {
      product: 'Custody Services',
      revenue: 1850,
      directCosts: 485,
      allocatedOverhead: 265,
      totalCosts: 750,
      grossProfit: 1100,
      capitalAllocated: 2200,
      capitalCharge: 231,
      economicProfit: 869,
      raroc: 39.5,
      clients: 850,
      revPerClient: 2.18,
      volume: 12500,
      tier: 'Core'
    },
    {
      product: 'Fund Administration',
      revenue: 1250,
      directCosts: 425,
      allocatedOverhead: 185,
      totalCosts: 610,
      grossProfit: 640,
      capitalAllocated: 1800,
      capitalCharge: 189,
      economicProfit: 451,
      raroc: 25.1,
      clients: 420,
      revPerClient: 2.98,
      volume: 8500,
      tier: 'Core'
    },
    {
      product: 'Securities Lending',
      revenue: 685,
      directCosts: 125,
      allocatedOverhead: 85,
      totalCosts: 210,
      grossProfit: 475,
      capitalAllocated: 1200,
      capitalCharge: 126,
      economicProfit: 349,
      raroc: 29.1,
      clients: 285,
      revPerClient: 2.40,
      volume: 2200,
      tier: 'Strategic'
    },
    {
      product: 'Middle Office Services',
      revenue: 425,
      directCosts: 285,
      allocatedOverhead: 95,
      totalCosts: 380,
      grossProfit: 45,
      capitalAllocated: 450,
      capitalCharge: 47,
      economicProfit: -2,
      raroc: -0.4,
      clients: 185,
      revPerClient: 2.30,
      volume: 5200,
      tier: 'Problem'
    },
    {
      product: 'FX Services',
      revenue: 385,
      directCosts: 95,
      allocatedOverhead: 65,
      totalCosts: 160,
      grossProfit: 225,
      capitalAllocated: 850,
      capitalCharge: 89,
      economicProfit: 136,
      raroc: 16.0,
      clients: 245,
      revPerClient: 1.57,
      volume: 18500,
      tier: 'Growth'
    },
    {
      product: 'Performance & Analytics',
      revenue: 285,
      directCosts: 145,
      allocatedOverhead: 55,
      totalCosts: 200,
      grossProfit: 85,
      capitalAllocated: 320,
      capitalCharge: 34,
      economicProfit: 51,
      raroc: 15.9,
      clients: 320,
      revPerClient: 0.89,
      volume: 850,
      tier: 'Growth'
    },
    {
      product: 'Collateral Management',
      revenue: 315,
      directCosts: 165,
      allocatedOverhead: 72,
      totalCosts: 237,
      grossProfit: 78,
      capitalAllocated: 680,
      capitalCharge: 71,
      economicProfit: 7,
      raroc: 1.0,
      clients: 125,
      revPerClient: 2.52,
      volume: 4200,
      tier: 'Problem'
    },
    {
      product: 'Corporate Actions',
      revenue: 195,
      directCosts: 125,
      allocatedOverhead: 48,
      totalCosts: 173,
      grossProfit: 22,
      capitalAllocated: 280,
      capitalCharge: 29,
      economicProfit: -7,
      raroc: -2.5,
      clients: 650,
      revPerClient: 0.30,
      volume: 125000,
      tier: 'Problem'
    }
  ]

  const totalRevenue = productPnL.reduce((sum, p) => sum + p.revenue, 0)
  const totalEconomicProfit = productPnL.reduce((sum, p) => sum + p.economicProfit, 0)
  const avgRAROC = productPnL.reduce((sum, p) => sum + p.raroc * (p.revenue / totalRevenue), 0)

  const profitableProducts = productPnL.filter(p => p.economicProfit > 0)
  const unprofitableProducts = productPnL.filter(p => p.economicProfit <= 0)

  // Product portfolio matrix (BCG-style)
  const portfolioMatrix = productPnL.map(p => ({
    name: p.product,
    marketGrowth: p.product === 'FX Services' ? 12 :
                   p.product === 'Securities Lending' ? 8 :
                   p.product === 'Performance & Analytics' ? 15 :
                   p.product === 'Custody Services' ? 3 :
                   p.product === 'Fund Administration' ? 5 :
                   p.product === 'Collateral Management' ? 2 :
                   p.product === 'Middle Office Services' ? -2 :
                   1,
    marketShare: p.product === 'Custody Services' ? 12 :
                  p.product === 'Securities Lending' ? 8 :
                  p.product === 'Fund Administration' ? 10 :
                  p.product === 'FX Services' ? 4 :
                  p.product === 'Performance & Analytics' ? 3 :
                  p.product === 'Collateral Management' ? 5 :
                  p.product === 'Middle Office Services' ? 6 :
                  2,
    raroc: p.raroc,
    revenue: p.revenue
  }))

  // Product lifecycle
  const lifecycleData = [
    { product: 'Blockchain Custody', stage: 'Emerging', investment: 25, expectedRAROC: 22, launchYear: 2025, ttiBreakeven: 5 },
    { product: 'AI Analytics Platform', stage: 'Emerging', investment: 18, expectedRAROC: 28, launchYear: 2024, ttiBreakeven: 3 },
    { product: 'Tokenized Assets', stage: 'Emerging', investment: 35, expectedRAROC: 18, launchYear: 2026, ttiBreakeven: 7 },
    { product: 'ESG Reporting Suite', stage: 'Launch', investment: 12, expectedRAROC: 15, launchYear: 2024, ttiBreakeven: 4 }
  ]

  // Cross-subsidization
  const crossSubsidy = [
    { subsidizer: 'Custody Services', subsidized: 'Corporate Actions', amount: 45, reason: 'Bundled offering' },
    { subsidizer: 'Securities Lending', subsidized: 'Middle Office', amount: 28, reason: 'Client retention' },
    { subsidizer: 'Fund Administration', subsidized: 'Collateral Mgmt', amount: 15, reason: 'Strategic relationship' }
  ]

  return (
    <div className="space-y-6">
      {/* Header Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="metric-card">
          <div className="text-sm text-gray-600 mb-1">Total Product Revenue</div>
          <div className="text-2xl font-bold text-blue-600">{formatCurrency(totalRevenue, 0)}M</div>
          <div className="text-xs text-gray-500 mt-1">Across 8 products</div>
        </div>
        <div className="metric-card">
          <div className="text-sm text-gray-600 mb-1">Economic Profit</div>
          <div className="text-2xl font-bold text-green-600">{formatCurrency(totalEconomicProfit, 0)}M</div>
          <div className="text-xs text-green-500 mt-1">After capital charge</div>
        </div>
        <div className="metric-card">
          <div className="text-sm text-gray-600 mb-1">Blended RAROC</div>
          <div className="text-2xl font-bold text-purple-600">{avgRAROC.toFixed(1)}%</div>
          <div className="text-xs text-gray-500 mt-1">Revenue-weighted</div>
        </div>
        <div className="metric-card">
          <div className="text-sm text-gray-600 mb-1">Value Destroyers</div>
          <div className="text-2xl font-bold text-red-600">{unprofitableProducts.length}</div>
          <div className="text-xs text-red-500 mt-1">Destroying {formatCurrency(Math.abs(unprofitableProducts.reduce((s, p) => s + p.economicProfit, 0)), 0)}M</div>
        </div>
      </div>

      {/* Strategic Alert */}
      <div className="metric-card border-l-4 border-amber-500">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Product Portfolio Rationalization Required</h3>
            <p className="text-sm text-gray-700 mb-3">
              <strong>3 products destroying value:</strong> Middle Office (-$2M), Corporate Actions (-$7M), Collateral Management (+$7M but only 1% RAROC).
              Combined they generate <strong>{formatCurrency(unprofitableProducts.reduce((s, p) => s + p.revenue, 0), 0)}M revenue</strong> but
              destroy <strong>{formatCurrency(Math.abs(unprofitableProducts.reduce((s, p) => s + p.economicProfit, 0)), 0)}M economic value</strong>.
              Meanwhile, top 3 products (Custody, Fund Admin, Securities Lending) generate <strong>85% of economic profit</strong>.
            </p>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                Exit: Corporate Actions (-$7M)
              </span>
              <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">
                Reprice: Middle Office (+50% fees)
              </span>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                Fix: Collateral Mgmt (automate)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Product P&L Table */}
      <div className="metric-card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Product P&L & RAROC</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Revenue</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Direct Costs</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Overhead</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Gross Profit</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Capital Charge</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Econ Profit</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">RAROC</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {productPnL.sort((a, b) => b.raroc - a.raroc).map((product, idx) => (
                <tr key={idx} className={`hover:bg-gray-50 ${
                  product.economicProfit < 0 ? 'bg-red-50' : ''
                }`}>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{product.product}</td>
                  <td className="px-4 py-3 text-sm text-right font-semibold">{formatCurrency(product.revenue, 0)}M</td>
                  <td className="px-4 py-3 text-sm text-right text-red-600">{formatCurrency(product.directCosts, 0)}M</td>
                  <td className="px-4 py-3 text-sm text-right text-orange-600">{formatCurrency(product.allocatedOverhead, 0)}M</td>
                  <td className="px-4 py-3 text-sm text-right font-medium text-blue-600">{formatCurrency(product.grossProfit, 0)}M</td>
                  <td className="px-4 py-3 text-sm text-right text-purple-600">{formatCurrency(product.capitalCharge, 0)}M</td>
                  <td className="px-4 py-3 text-sm text-right font-bold">
                    <span className={product.economicProfit >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {formatCurrency(product.economicProfit, 0)}M
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-right">
                    <span className={`font-bold text-lg ${
                      product.raroc > 20 ? 'text-green-600' :
                      product.raroc > 12 ? 'text-blue-600' :
                      product.raroc > 0 ? 'text-orange-600' :
                      'text-red-600'
                    }`}>
                      {product.raroc.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                      product.tier === 'Core' ? 'bg-green-100 text-green-800' :
                      product.tier === 'Strategic' ? 'bg-blue-100 text-blue-800' :
                      product.tier === 'Growth' ? 'bg-purple-100 text-purple-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {product.tier}
                    </span>
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-100 font-bold">
                <td className="px-4 py-3 text-sm">Total</td>
                <td className="px-4 py-3 text-sm text-right">{formatCurrency(totalRevenue, 0)}M</td>
                <td className="px-4 py-3 text-sm text-right">{formatCurrency(productPnL.reduce((s, p) => s + p.directCosts, 0), 0)}M</td>
                <td className="px-4 py-3 text-sm text-right">{formatCurrency(productPnL.reduce((s, p) => s + p.allocatedOverhead, 0), 0)}M</td>
                <td className="px-4 py-3 text-sm text-right">{formatCurrency(productPnL.reduce((s, p) => s + p.grossProfit, 0), 0)}M</td>
                <td className="px-4 py-3 text-sm text-right">{formatCurrency(productPnL.reduce((s, p) => s + p.capitalCharge, 0), 0)}M</td>
                <td className="px-4 py-3 text-sm text-right text-green-600">{formatCurrency(totalEconomicProfit, 0)}M</td>
                <td className="px-4 py-3 text-sm text-right">{avgRAROC.toFixed(1)}%</td>
                <td className="px-4 py-3 text-sm"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Revenue vs RAROC */}
      <div className="metric-card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Economic Contribution</h3>
        <div className="h-80 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={productPnL.sort((a, b) => b.economicProfit - a.economicProfit)} margin={{ top: 20, right: 30, left: 60, bottom: 80 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="product"
                angle={-20}
                textAnchor="end"
                height={100}
                interval={0}
              />
              <YAxis
                yAxisId="left"
                label={{ value: 'Economic Profit ($M)', angle: -90, position: 'insideLeft' }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                label={{ value: 'RAROC (%)', angle: 90, position: 'insideRight' }}
              />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="economicProfit" name="Economic Profit" fill="#10b981">
                {productPnL.map((entry, index) => (
                  <rect key={`bar-${index}`} fill={entry.economicProfit >= 0 ? '#10b981' : '#ef4444'} />
                ))}
              </Bar>
              <Line yAxisId="right" type="monotone" dataKey="raroc" name="RAROC" stroke="#3b82f6" strokeWidth={3} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {productPnL.sort((a, b) => b.economicProfit - a.economicProfit).slice(0, 4).map((product, idx) => (
            <div key={idx} className={`p-4 rounded-lg border-2 ${
              idx === 0 ? 'border-green-500 bg-green-50' : 'border-gray-200'
            }`}>
              <div className="text-sm font-semibold text-gray-900 mb-2">{product.product}</div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600">Econ Profit:</span>
                  <span className="font-bold text-green-600">{formatCurrency(product.economicProfit, 0)}M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">RAROC:</span>
                  <span className="font-bold text-blue-600">{product.raroc.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Revenue:</span>
                  <span className="font-medium">{formatCurrency(product.revenue, 0)}M</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cross-Subsidization Analysis */}
      <div className="metric-card border-l-4 border-purple-500">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Cross-Subsidization</h3>
        <p className="text-sm text-gray-700 mb-4">
          High-margin products subsidize loss-makers to maintain client relationships and strategic positioning.
          Total cross-subsidy: <strong>{formatCurrency(crossSubsidy.reduce((s, c) => s + c.amount, 0), 0)}M annually</strong>.
        </p>
        <div className="space-y-3">
          {crossSubsidy.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-sm font-semibold text-green-900">{item.subsidizer}</div>
                  <div className="text-xs text-green-700">Profitable</div>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-5 h-5 text-purple-600" />
                  <span className="text-lg font-bold text-purple-600">{formatCurrency(item.amount, 0)}M</span>
                  <TrendingUp className="w-5 h-5 text-purple-600 transform rotate-180" />
                </div>
                <div className="text-center">
                  <div className="text-sm font-semibold text-red-900">{item.subsidized}</div>
                  <div className="text-xs text-red-700">Subsidized</div>
                </div>
              </div>
              <div className="text-sm text-gray-600 italic">{item.reason}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
          <h4 className="text-sm font-semibold text-amber-900 mb-2">Strategic Question</h4>
          <p className="text-sm text-amber-800">
            Is the cross-subsidy justified? If Corporate Actions (-$7M) is bundled with Custody (+$869M), are we capturing
            sufficient revenue from the bundle? Consider: (1) Unbundle and charge separately, (2) Exit subsidized products,
            or (3) Improve economics of subsidized products to reduce drag.
          </p>
        </div>
      </div>

      {/* New Product Pipeline */}
      <div className="metric-card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">New Product Pipeline & Innovation</h3>
        <div className="overflow-x-auto mb-4">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stage</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Investment</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Expected RAROC</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Launch Year</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Years to Breakeven</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Decision</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {lifecycleData.map((product, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{product.product}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                      product.stage === 'Emerging' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {product.stage}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-right font-semibold">{formatCurrency(product.investment, 0)}M</td>
                  <td className="px-4 py-3 text-sm text-right">
                    <span className={`font-bold ${
                      product.expectedRAROC > 20 ? 'text-green-600' :
                      product.expectedRAROC > 15 ? 'text-blue-600' :
                      'text-orange-600'
                    }`}>
                      {product.expectedRAROC}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-right">{product.launchYear}</td>
                  <td className="px-4 py-3 text-sm text-right">{product.ttiBreakeven} years</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`text-xs px-2 py-1 rounded font-medium ${
                      product.expectedRAROC > 20 && product.ttiBreakeven < 5 ? 'bg-green-100 text-green-800' :
                      product.expectedRAROC > 15 ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {product.expectedRAROC > 20 && product.ttiBreakeven < 5 ? 'Approve' :
                       product.expectedRAROC > 15 ? 'Conditional' :
                       'Review'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h4 className="text-sm font-semibold text-green-900 mb-2">Recommend: AI Analytics Platform</h4>
            <p className="text-sm text-green-800">
              $18M investment, 28% expected RAROC, 3-year breakeven. Addresses clear client need (performance attribution).
              Launch 2024. <strong>Approve</strong>.
            </p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <h4 className="text-sm font-semibold text-yellow-900 mb-2">Caution: Tokenized Assets</h4>
            <p className="text-sm text-yellow-800">
              $35M investment (largest), 18% RAROC (acceptable), but 7-year breakeven. Market maturity uncertain.
              <strong>Defer to 2026</strong> - reassess market demand.
            </p>
          </div>
        </div>
      </div>

      {/* Product Rationalization Recommendations */}
      <div className="metric-card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Portfolio Optimization Roadmap</h3>
        <div className="space-y-3">
          <div className="border-l-4 border-green-500 bg-green-50 p-4 rounded-r-lg">
            <h4 className="text-sm font-semibold text-green-900 mb-2">Grow: Core Products (Custody, Fund Admin, Sec Lending)</h4>
            <p className="text-sm text-green-800 mb-2">
              Generate 85% of economic profit. Combined RAROC 31.2%. Strategic focus: expand client base, increase penetration, defend pricing.
            </p>
            <p className="text-xs text-green-700">Action: +$500M investment over 3 years = +$180M incremental economic profit</p>
          </div>

          <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded-r-lg">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">Invest: Growth Products (FX, Performance & Analytics)</h4>
            <p className="text-sm text-blue-800 mb-2">
              16% RAROC, good margins, scalable. Opportunity to expand. FX growing at 12% annually, Analytics at 15%.
            </p>
            <p className="text-xs text-blue-700">Action: +$150M investment = +$65M incremental economic profit by 2027</p>
          </div>

          <div className="border-l-4 border-orange-500 bg-orange-50 p-4 rounded-r-lg">
            <h4 className="text-sm font-semibold text-orange-900 mb-2">Fix: Collateral Management (1% RAROC)</h4>
            <p className="text-sm text-orange-800 mb-2">
              Revenue $315M but barely profitable. High operational costs. Opportunity: automate workflows (reduce cost $85M) or reprice (+30% fees).
            </p>
            <p className="text-xs text-orange-700">Action: Automation investment $22M = +$63M economic profit improvement</p>
          </div>

          <div className="border-l-4 border-red-500 bg-red-50 p-4 rounded-r-lg">
            <h4 className="text-sm font-semibold text-red-900 mb-2">Exit: Middle Office (-0.4% RAROC) and Corporate Actions (-2.5% RAROC)</h4>
            <p className="text-sm text-red-800 mb-2">
              Combined destroy $9M economic value. Middle Office: low margins, intense competition. Corporate Actions: commoditized, can outsource.
            </p>
            <p className="text-xs text-red-700">Action: Exit over 18 months = eliminate -$9M drag + free up $730M capital for redeployment</p>
          </div>
        </div>
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="text-sm font-semibold text-blue-900 mb-2">Portfolio Optimization Impact</h4>
          <p className="text-sm text-blue-800">
            Combined strategy: <strong>+$317M economic profit improvement</strong> over 3 years.
            Exit value destroyers (-$9M → $0), fix Collateral Mgmt (+$63M), grow core (+$180M), invest growth (+$65M), launch AI Analytics (+$18M expected).
          </p>
        </div>
      </div>
    </div>
  )
}
