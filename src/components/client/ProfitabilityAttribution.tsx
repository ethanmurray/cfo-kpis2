import { formatCurrency, formatPercent } from '../../utils/dataGenerators'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Line, Area } from 'recharts'

export default function ProfitabilityAttribution() {
  // Example client waterfall
  const exampleClient = {
    name: 'Global Pension Fund A',
    revenue: 45.2,
    segment: 'Pension Fund'
  }

  // Revenue waterfall
  const revenueWaterfall = [
    { component: 'Custody Fees', value: 18.5, cumulative: 18.5, color: '#3b82f6' },
    { component: 'Fund Admin Fees', value: 12.8, cumulative: 31.3, color: '#8b5cf6' },
    { component: 'Securities Lending', value: 8.2, cumulative: 39.5, color: '#10b981' },
    { component: 'FX & Trading', value: 3.5, cumulative: 43.0, color: '#f59e0b' },
    { component: 'Other Services', value: 2.2, cumulative: 45.2, color: '#6b7280' }
  ]

  // Cost waterfall
  const costWaterfall = [
    { component: 'Revenue', value: 45.2, cumulative: 45.2, type: 'revenue', color: '#10b981' },
    { component: 'Direct Labor', value: -6.8, cumulative: 38.4, type: 'cost', color: '#ef4444' },
    { component: 'Technology', value: -2.5, cumulative: 35.9, type: 'cost', color: '#f59e0b' },
    { component: 'Operations', value: -1.8, cumulative: 34.1, type: 'cost', color: '#f97316' },
    { component: 'Overhead Allocation', value: -1.7, cumulative: 32.4, type: 'cost', color: '#ea580c' },
    { component: 'Gross Profit', value: 32.4, cumulative: 32.4, type: 'subtotal', color: '#3b82f6' },
    { component: 'Capital Charge (10.5%)', value: -13.1, cumulative: 19.3, type: 'capital', color: '#7c2d12' },
    { component: 'Economic Profit', value: 19.3, cumulative: 19.3, type: 'final', color: '#166534' }
  ]

  // Client profitability drivers - compare profitable vs unprofitable
  const profitabilityDrivers = [
    {
      driver: 'Fee Rate (bps on AUC)',
      topQuartile: 11.8,
      bottomQuartile: 5.2,
      gap: 6.6,
      description: 'Revenue per $1B AUC'
    },
    {
      driver: 'Products per Client',
      topQuartile: 3.8,
      bottomQuartile: 1.2,
      gap: 2.6,
      description: 'Average product penetration'
    },
    {
      driver: 'Operational Efficiency',
      topQuartile: 92.5,
      bottomQuartile: 68.2,
      gap: 24.3,
      description: 'STP rate / automation %'
    },
    {
      driver: 'Balance Utilization',
      topQuartile: 88.5,
      bottomQuartile: 52.8,
      gap: 35.7,
      description: '% of deposits generating revenue'
    },
    {
      driver: 'Capital Efficiency',
      topQuartile: 2.8,
      bottomQuartile: 6.5,
      gap: -3.7,
      description: 'RWA per $1M revenue (lower better)'
    }
  ]

  // Segment profitability comparison
  const segmentComparison = [
    {
      segment: 'Pension Funds',
      avgRevenue: 28.5,
      avgDirectCost: 7.8,
      avgCapitalCharge: 9.2,
      economicProfit: 11.5,
      raroc: 14.2,
      clients: 8,
      feeRate: 9.5,
      efficiency: 85
    },
    {
      segment: 'Insurance',
      avgRevenue: 32.2,
      avgDirectCost: 9.5,
      avgCapitalCharge: 10.8,
      economicProfit: 11.9,
      raroc: 13.8,
      clients: 5,
      feeRate: 10.2,
      efficiency: 82
    },
    {
      segment: 'Asset Managers',
      avgRevenue: 35.8,
      avgDirectCost: 14.2,
      avgCapitalCharge: 11.5,
      economicProfit: 10.1,
      raroc: 11.2,
      clients: 9,
      feeRate: 7.8,
      efficiency: 75
    },
    {
      segment: 'Sovereign/Endowment',
      avgRevenue: 30.5,
      avgDirectCost: 8.2,
      avgCapitalCharge: 12.8,
      economicProfit: 9.5,
      raroc: 10.5,
      clients: 4,
      feeRate: 8.8,
      efficiency: 88
    },
    {
      segment: 'Family Office/HNW',
      avgRevenue: 12.8,
      avgDirectCost: 6.5,
      avgCapitalCharge: 5.2,
      economicProfit: 1.1,
      raroc: 4.8,
      clients: 4,
      feeRate: 6.2,
      efficiency: 65
    }
  ]

  // Fee structure analysis
  const feeStructures = [
    {
      structure: 'Tiered AUC-based',
      clients: 18,
      avgFeeRate: 8.5,
      avgRAROC: 12.5,
      pros: 'Scales with growth, predictable',
      cons: 'Price compression on large accounts'
    },
    {
      structure: 'Activity-based',
      clients: 7,
      avgFeeRate: 12.2,
      avgRAROC: 15.8,
      pros: 'Captures true cost, higher margin',
      cons: 'Complex billing, client resistance'
    },
    {
      structure: 'Hybrid (Base + Activity)',
      clients: 5,
      avgFeeRate: 10.8,
      avgRAROC: 14.2,
      pros: 'Balanced approach, upside potential',
      cons: 'Requires sophisticated tracking'
    }
  ]

  // Value creation levers
  const valueLevers = [
    {
      lever: 'Increase Fee Rates 50bps',
      revenueImpact: 285,
      costImpact: 0,
      capitalImpact: 0,
      economicProfitImpact: 285,
      rarocImpact: 4.2,
      feasibility: 'Medium',
      timeframe: '12 months'
    },
    {
      lever: 'Expand Product Penetration (+0.5 products/client)',
      revenueImpact: 420,
      costImpact: -120,
      capitalImpact: -35,
      economicProfitImpact: 265,
      rarocImpact: 3.8,
      feasibility: 'High',
      timeframe: '18 months'
    },
    {
      lever: 'Improve STP Rate to 95% (from 88%)',
      revenueImpact: 0,
      costImpact: 185,
      capitalImpact: 0,
      economicProfitImpact: 185,
      rarocImpact: 2.7,
      feasibility: 'Medium',
      timeframe: '24 months'
    },
    {
      lever: 'Exit Bottom Decile Clients',
      revenueImpact: -85,
      costImpact: 92,
      capitalImpact: 18,
      economicProfitImpact: 25,
      rarocImpact: 1.8,
      feasibility: 'High',
      timeframe: '6 months'
    },
    {
      lever: 'Shift to Activity-Based Pricing',
      revenueImpact: 380,
      costImpact: -45,
      capitalImpact: 0,
      economicProfitImpact: 335,
      rarocImpact: 4.9,
      feasibility: 'Low',
      timeframe: '18 months'
    }
  ]

  const totalOptimizationImpact = valueLevers.reduce((sum, lever) => sum + lever.economicProfitImpact, 0)

  return (
    <div className="space-y-6">
      {/* Header Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="metric-card">
          <div className="text-sm text-gray-600 mb-1">Avg Fee Rate</div>
          <div className="text-2xl font-bold text-blue-600">8.5</div>
          <div className="text-xs text-gray-500 mt-1">bps on AUC</div>
        </div>
        <div className="metric-card">
          <div className="text-sm text-gray-600 mb-1">Avg Products/Client</div>
          <div className="text-2xl font-bold text-purple-600">2.4</div>
          <div className="text-xs text-gray-500 mt-1">Opportunity: 4.5+</div>
        </div>
        <div className="metric-card">
          <div className="text-sm text-gray-600 mb-1">STP Rate</div>
          <div className="text-2xl font-bold text-green-600">88%</div>
          <div className="text-xs text-gray-500 mt-1">Target: 95%</div>
        </div>
        <div className="metric-card">
          <div className="text-sm text-gray-600 mb-1">Optimization Potential</div>
          <div className="text-2xl font-bold text-green-600">+{formatCurrency(totalOptimizationImpact, 0)}M</div>
          <div className="text-xs text-green-500 mt-1">Economic profit upside</div>
        </div>
      </div>

      {/* Example Client Waterfall */}
      <div className="metric-card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Client Profitability Waterfall - {exampleClient.name}</h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Revenue Composition</h4>
            <div className="space-y-2">
              {revenueWaterfall.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-700">{item.component}</span>
                  <span className="text-sm font-semibold text-gray-900">{formatCurrency(item.value, 1)}M</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Profitability Bridge</h4>
            <div className="space-y-2">
              {costWaterfall.map((item, idx) => (
                <div key={idx} className={`flex items-center justify-between p-2 rounded ${
                  item.type === 'revenue' ? 'bg-green-50' :
                  item.type === 'subtotal' ? 'bg-blue-50' :
                  item.type === 'final' ? 'bg-green-100 border-2 border-green-500' :
                  'bg-red-50'
                }`}>
                  <span className="text-sm text-gray-700">{item.component}</span>
                  <span className={`text-sm font-semibold ${
                    item.type === 'cost' ? 'text-red-600' :
                    item.type === 'capital' ? 'text-orange-600' :
                    'text-gray-900'
                  }`}>
                    {item.value > 0 && item.type !== 'revenue' ? '+' : ''}{formatCurrency(Math.abs(item.value), 1)}M
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="text-xs text-blue-700">Gross Margin</div>
            <div className="text-xl font-bold text-blue-900">71.7%</div>
            <div className="text-xs text-blue-700 mt-1">$32.4M / $45.2M</div>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <div className="text-xs text-green-700">RAROC</div>
            <div className="text-xl font-bold text-green-900">18.2%</div>
            <div className="text-xs text-green-700 mt-1">Top quartile</div>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg">
            <div className="text-xs text-purple-700">Capital Allocated</div>
            <div className="text-xl font-bold text-purple-900">{formatCurrency(125, 0)}M</div>
            <div className="text-xs text-purple-700 mt-1">10.5% charge rate</div>
          </div>
        </div>
      </div>

      {/* Profitability Drivers */}
      <div className="metric-card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">What Differentiates Profitable vs Unprofitable Clients?</h3>
        <div className="space-y-4">
          {profitabilityDrivers.map((driver, idx) => (
            <div key={idx} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="font-semibold text-gray-900">{driver.driver}</div>
                  <div className="text-xs text-gray-600">{driver.description}</div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  Math.abs(driver.gap) > 30 ? 'bg-red-100 text-red-800' :
                  Math.abs(driver.gap) > 15 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  Gap: {driver.gap > 0 ? '+' : ''}{driver.gap.toFixed(1)}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-green-700 font-medium">Top Quartile</span>
                    <span className="text-sm font-bold text-green-600">{driver.topQuartile.toFixed(1)}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500" style={{ width: '100%' }}></div>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-red-700 font-medium">Bottom Quartile</span>
                    <span className="text-sm font-bold text-red-600">{driver.bottomQuartile.toFixed(1)}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-500"
                      style={{ width: `${Math.min((driver.bottomQuartile / driver.topQuartile) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="text-sm font-semibold text-blue-900 mb-2">Key Findings</h4>
          <div className="space-y-1 text-sm text-blue-800">
            <p>• <strong>Fee Rate:</strong> Top quartile charges 2.3x more per AUC (11.8 vs 5.2 bps) - pricing power from value-add services</p>
            <p>• <strong>Product Penetration:</strong> 3.8 products/client vs 1.2 for bottom quartile - cross-sell drives profitability</p>
            <p>• <strong>Operational Excellence:</strong> 92.5% STP rate vs 68.2% - automation dramatically improves margins</p>
            <p>• <strong>Capital Efficiency:</strong> Top clients use less capital per revenue dollar (better quality, lower RWA)</p>
          </div>
        </div>
      </div>

      {/* Segment Economics */}
      <div className="metric-card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Segment Profitability Economics</h3>
        <div className="overflow-x-auto mb-4">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Segment</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Clients</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Avg Revenue</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Direct Cost</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Capital Charge</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Econ Profit</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">RAROC</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Fee Rate</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Efficiency</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {segmentComparison.sort((a, b) => b.raroc - a.raroc).map((seg, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{seg.segment}</td>
                  <td className="px-4 py-3 text-sm text-right">{seg.clients}</td>
                  <td className="px-4 py-3 text-sm text-right">{formatCurrency(seg.avgRevenue, 1)}M</td>
                  <td className="px-4 py-3 text-sm text-right text-red-600">{formatCurrency(seg.avgDirectCost, 1)}M</td>
                  <td className="px-4 py-3 text-sm text-right text-orange-600">{formatCurrency(seg.avgCapitalCharge, 1)}M</td>
                  <td className="px-4 py-3 text-sm text-right font-semibold text-green-600">
                    {formatCurrency(seg.economicProfit, 1)}M
                  </td>
                  <td className="px-4 py-3 text-sm text-right">
                    <span className={`font-bold ${
                      seg.raroc > 12 ? 'text-green-600' :
                      seg.raroc > 8 ? 'text-blue-600' :
                      'text-orange-600'
                    }`}>
                      {seg.raroc.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-right">{seg.feeRate.toFixed(1)} bps</td>
                  <td className="px-4 py-3 text-sm text-right">{seg.efficiency}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h4 className="text-sm font-semibold text-green-900 mb-2">Best: Pension Funds</h4>
            <p className="text-sm text-green-800">
              14.2% RAROC, 9.5 bps fee rate, 85% efficiency. Large stable relationships with multi-product adoption.
              Focus growth here.
            </p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <h4 className="text-sm font-semibold text-yellow-900 mb-2">Mixed: Asset Managers</h4>
            <p className="text-sm text-yellow-800">
              11.2% RAROC despite high revenue - low fee rates (7.8 bps) and operational complexity (75% efficiency).
              Reprice or streamline.
            </p>
          </div>
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <h4 className="text-sm font-semibold text-red-900 mb-2">Weak: Family Office</h4>
            <p className="text-sm text-red-800">
              4.8% RAROC, low fee rates (6.2 bps), poor efficiency (65%). Small relationships with high service cost.
              Exit or dramatically reprice.
            </p>
          </div>
        </div>
      </div>

      {/* Fee Structure Analysis */}
      <div className="metric-card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Fee Structure Impact on Profitability</h3>
        <div className="grid grid-cols-3 gap-4 mb-4">
          {feeStructures.map((structure, idx) => (
            <div key={idx} className={`p-4 rounded-lg border-2 ${
              structure.avgRAROC > 14 ? 'border-green-500 bg-green-50' :
              'border-gray-200'
            }`}>
              <div className="font-semibold text-gray-900 mb-2">{structure.structure}</div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Clients:</span>
                  <span className="font-medium">{structure.clients}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg Fee Rate:</span>
                  <span className="font-medium text-blue-600">{structure.avgFeeRate} bps</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg RAROC:</span>
                  <span className="font-bold text-green-600">{structure.avgRAROC.toFixed(1)}%</span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="text-xs text-green-700 mb-1">✓ {structure.pros}</div>
                <div className="text-xs text-red-700">✗ {structure.cons}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
          <h4 className="text-sm font-semibold text-purple-900 mb-2">Pricing Strategy Recommendation</h4>
          <p className="text-sm text-purple-800">
            <strong>Activity-based pricing</strong> delivers 15.8% RAROC (+26% vs tiered AUC) and 12.2 bps fee rate (+43%).
            Transition top 20 clients to hybrid model capturing activity fees for high-touch services.
            Potential revenue uplift: <strong>+{formatCurrency(285, 0)}M</strong> at current volume.
          </p>
        </div>
      </div>

      {/* Value Creation Levers */}
      <div className="metric-card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Value Creation Levers - Profitability Optimization</h3>
        <div className="space-y-3">
          {valueLevers.sort((a, b) => b.economicProfitImpact - a.economicProfitImpact).map((lever, idx) => (
            <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-gray-900">{lever.lever}</h4>
                  <div className="text-xs text-gray-500 mt-1">Timeframe: {lever.timeframe}</div>
                </div>
                <div className="flex gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    lever.feasibility === 'High' ? 'bg-green-100 text-green-800' :
                    lever.feasibility === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {lever.feasibility} Feasibility
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    +{lever.rarocImpact.toFixed(1)}% RAROC
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-5 gap-4 text-sm">
                <div>
                  <div className="text-xs text-gray-600">Revenue</div>
                  <div className={`font-semibold ${lever.revenueImpact >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {lever.revenueImpact > 0 ? '+' : ''}{formatCurrency(lever.revenueImpact, 0)}M
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-600">Cost Savings</div>
                  <div className={`font-semibold ${lever.costImpact >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {lever.costImpact > 0 ? '+' : ''}{formatCurrency(lever.costImpact, 0)}M
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-600">Capital</div>
                  <div className={`font-semibold ${lever.capitalImpact >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {lever.capitalImpact > 0 ? '+' : ''}{formatCurrency(lever.capitalImpact, 0)}M
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-600">Econ Profit</div>
                  <div className="font-bold text-green-600">
                    +{formatCurrency(lever.economicProfitImpact, 0)}M
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-600">RAROC Impact</div>
                  <div className="font-bold text-blue-600">
                    +{lever.rarocImpact.toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
          <h4 className="text-sm font-semibold text-green-900 mb-2">Recommended Implementation Sequence</h4>
          <div className="space-y-2 text-sm text-green-800">
            <p><strong>Phase 1 (0-6 months):</strong> Exit bottom decile clients (+{formatCurrency(25, 0)}M) - Immediate impact, high feasibility</p>
            <p><strong>Phase 2 (6-18 months):</strong> Expand product penetration (+{formatCurrency(265, 0)}M) - Leverage existing relationships</p>
            <p><strong>Phase 3 (12-24 months):</strong> STP improvement (+{formatCurrency(185, 0)}M) - Technology investment required</p>
            <p><strong>Phase 4 (18+ months):</strong> Fee rate increase & pricing model shift (+{formatCurrency(620, 0)}M) - Requires market positioning</p>
            <p className="pt-2 border-t border-green-300 font-semibold">
              <strong>Combined Impact:</strong> +{formatCurrency(totalOptimizationImpact, 0)}M economic profit over 24 months
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
