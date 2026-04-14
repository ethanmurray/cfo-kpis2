import { useState } from 'react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, ScatterChart, Scatter, ComposedChart } from 'recharts'
import { ChevronDown, ChevronRight, TrendingUp, TrendingDown, Target, AlertTriangle } from 'lucide-react'

export default function DriverTreesView() {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['revenue', 'economic-profit', 'clients', 'revenue-per-client']))
  const [selectedScenario, setSelectedScenario] = useState<'base' | 'optimistic' | 'pessimistic'>('base')

  // Base case drivers (2024)
  const baseDrivers = {
    // Level 1: Top-level metrics
    revenue: 5390,
    economicProfit: 1854,
    raroc: 9.8,
    allocatedCapital: 18900,

    // Level 2: Revenue components
    numClients: 285,
    revenuePerClient: 18.91, // 5390 / 285

    // Level 3: Revenue per client components
    aumPerClient: 21500, // $M
    feeRate: 8.8, // bps (0.088%)

    // Level 3: Additional revenue streams
    transactionRevenue: 1245,
    performanceFees: 485,
    otherRevenue: 220,

    // Level 2: Cost components
    directCosts: 2156,
    allocatedOverhead: 1380,

    // Level 3: Direct cost drivers
    personnelCosts: 1358,
    technologyCosts: 485,
    operationalCosts: 313,

    // Level 3: Unit economics
    costPerTransaction: 1.60,
    transactionsPerClient: 8750,
    costPerClient: 25500,

    // Level 2: Capital components
    capitalCharge: 1985, // allocatedCapital * 0.105
    costOfCapital: 10.5, // %
  }

  // Scenario adjustments
  const scenarios = {
    base: {
      clientGrowth: 0,
      aumGrowth: 0,
      feeRateChange: 0,
      costReduction: 0,
      capitalEfficiency: 0,
    },
    optimistic: {
      clientGrowth: 8, // %
      aumGrowth: 12, // %
      feeRateChange: 5, // bps
      costReduction: -8, // %
      capitalEfficiency: -10, // %
    },
    pessimistic: {
      clientGrowth: -5, // %
      aumGrowth: -8, // %
      feeRateChange: -3, // bps
      costReduction: 5, // %
      capitalEfficiency: 8, // %
    },
  }

  const scenario = scenarios[selectedScenario]

  // Calculate scenario values
  const scenarioValues = {
    numClients: baseDrivers.numClients * (1 + scenario.clientGrowth / 100),
    aumPerClient: baseDrivers.aumPerClient * (1 + scenario.aumGrowth / 100),
    feeRate: baseDrivers.feeRate + scenario.feeRateChange,
    directCosts: baseDrivers.directCosts * (1 + scenario.costReduction / 100),
    allocatedOverhead: baseDrivers.allocatedOverhead * (1 + scenario.costReduction / 100),
    allocatedCapital: baseDrivers.allocatedCapital * (1 + scenario.capitalEfficiency / 100),
  }

  // Derived calculations
  const aumBase = scenarioValues.aumPerClient * scenarioValues.numClients
  const custodyRevenue = (aumBase * scenarioValues.feeRate) / 10000
  const totalRevenue = custodyRevenue + baseDrivers.transactionRevenue + baseDrivers.performanceFees + baseDrivers.otherRevenue
  const totalCosts = scenarioValues.directCosts + scenarioValues.allocatedOverhead
  const capitalCharge = scenarioValues.allocatedCapital * (baseDrivers.costOfCapital / 100)
  const economicProfit = totalRevenue - totalCosts - capitalCharge
  const raroc = (economicProfit / scenarioValues.allocatedCapital) * 100
  const revenuePerClient = totalRevenue / scenarioValues.numClients

  // Historical trends (last 3 years)
  const historicalTrends = [
    { year: '2022', clients: 258, aumPerClient: 18200, feeRate: 9.5, costPerClient: 28900, raroc: 8.2 },
    { year: '2023', clients: 272, aumPerClient: 19800, feeRate: 9.1, costPerClient: 27100, raroc: 9.0 },
    { year: '2024', clients: 285, aumPerClient: 21500, feeRate: 8.8, costPerClient: 25500, raroc: 9.8 },
    { year: '2025 Target', clients: 308, aumPerClient: 24100, feeRate: 9.3, costPerClient: 23400, raroc: 12.5 },
  ]

  // Sensitivity analysis
  const sensitivities = [
    {
      driver: 'Client Count',
      change: '+10 clients',
      revenueImpact: 189,
      profitImpact: 78,
      rarocImpact: 0.4,
      feasibility: 'High',
      timeframe: '6-12 months'
    },
    {
      driver: 'AUM per Client',
      change: '+$1B',
      revenueImpact: 251,
      profitImpact: 210,
      rarocImpact: 1.1,
      feasibility: 'Medium',
      timeframe: '12-18 months'
    },
    {
      driver: 'Fee Rate (bps)',
      change: '+5 bps',
      revenueImpact: 307,
      profitImpact: 307,
      rarocImpact: 1.6,
      feasibility: 'Medium',
      timeframe: '3-6 months'
    },
    {
      driver: 'Cost per Client',
      change: '-$1,000',
      revenueImpact: 0,
      profitImpact: 285,
      rarocImpact: 1.5,
      feasibility: 'High',
      timeframe: '6-12 months'
    },
    {
      driver: 'Capital Allocation',
      change: '-10%',
      revenueImpact: 0,
      profitImpact: 198,
      rarocImpact: 2.1,
      feasibility: 'Medium',
      timeframe: '12-24 months'
    },
    {
      driver: 'Transaction Revenue',
      change: '+10%',
      revenueImpact: 125,
      profitImpact: 95,
      rarocImpact: 0.5,
      feasibility: 'Medium',
      timeframe: '6-12 months'
    },
  ]

  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes)
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId)
    } else {
      newExpanded.add(nodeId)
    }
    setExpandedNodes(newExpanded)
  }

  const TreeNode = ({
    id,
    label,
    value,
    unit = 'M',
    change,
    level = 0,
    children,
    formula
  }: {
    id: string
    label: string
    value: number
    unit?: string
    change?: number
    level?: number
    children?: React.ReactNode
    formula?: string
  }) => {
    const isExpanded = expandedNodes.has(id)
    const hasChildren = !!children
    const indent = level * 32

    return (
      <div className="border-l-2 border-gray-200">
        <div
          className="flex items-center gap-2 p-3 hover:bg-gray-50 cursor-pointer"
          style={{ paddingLeft: `${indent + 12}px` }}
          onClick={() => hasChildren && toggleNode(id)}
        >
          {hasChildren ? (
            isExpanded ? <ChevronDown className="h-4 w-4 text-gray-400" /> : <ChevronRight className="h-4 w-4 text-gray-400" />
          ) : (
            <div className="w-4" />
          )}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900">{label}</span>
              {formula && <span className="text-xs text-gray-500 font-mono">{formula}</span>}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="font-semibold text-gray-900">
                {unit === '$' ? '$' : ''}{value.toLocaleString(undefined, { maximumFractionDigits: unit === 'bps' ? 1 : 0 })}{unit === 'M' ? 'M' : unit === '%' ? '%' : unit === 'bps' ? ' bps' : ''}
              </div>
              {change !== undefined && (
                <div className={`text-sm flex items-center gap-1 justify-end ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {change >= 0 ? '+' : ''}{change.toFixed(1)}%
                </div>
              )}
            </div>
          </div>
        </div>
        {isExpanded && children && (
          <div className="border-t border-gray-100">
            {children}
          </div>
        )}
      </div>
    )
  }

  const getFeasibilityColor = (feasibility: string) => {
    switch(feasibility) {
      case 'High': return '#10b981'
      case 'Medium': return '#f59e0b'
      case 'Low': return '#ef4444'
      default: return '#6b7280'
    }
  }

  // Calculate bridge from current to target
  const bridgeData = [
    { name: '2024 Actual', value: 9.8, type: 'actual' },
    { name: 'Client Growth', value: 0.8, type: 'positive' },
    { name: 'AUM Growth', value: 1.2, type: 'positive' },
    { name: 'Fee Optimization', value: 0.9, type: 'positive' },
    { name: 'Cost Reduction', value: 0.6, type: 'positive' },
    { name: 'Capital Efficiency', value: 0.4, type: 'positive' },
    { name: 'Market Headwinds', value: -1.2, type: 'negative' },
    { name: '2025 Target', value: 12.5, type: 'target' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Financial Performance Driver Trees</h2>
        <p className="text-gray-700">
          Hierarchical decomposition of key financial metrics into actionable levers.
          Each level shows how top-line metrics break down into component drivers.
        </p>
      </div>

      {/* Scenario Selector */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Scenario Analysis</h3>
          <div className="flex gap-2">
            {(['base', 'optimistic', 'pessimistic'] as const).map(s => (
              <button
                key={s}
                onClick={() => setSelectedScenario(s)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedScenario === s
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-5 gap-4">
          <div className="p-4 bg-gray-50 rounded">
            <div className="text-sm text-gray-600">Revenue</div>
            <div className="text-xl font-bold text-gray-900">${totalRevenue.toFixed(0)}M</div>
            <div className={`text-sm ${totalRevenue > baseDrivers.revenue ? 'text-green-600' : totalRevenue < baseDrivers.revenue ? 'text-red-600' : 'text-gray-600'}`}>
              {totalRevenue > baseDrivers.revenue ? '+' : ''}{((totalRevenue - baseDrivers.revenue) / baseDrivers.revenue * 100).toFixed(1)}% vs base
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded">
            <div className="text-sm text-gray-600">Economic Profit</div>
            <div className="text-xl font-bold text-gray-900">${economicProfit.toFixed(0)}M</div>
            <div className={`text-sm ${economicProfit > baseDrivers.economicProfit ? 'text-green-600' : economicProfit < baseDrivers.economicProfit ? 'text-red-600' : 'text-gray-600'}`}>
              {economicProfit > baseDrivers.economicProfit ? '+' : ''}{((economicProfit - baseDrivers.economicProfit) / baseDrivers.economicProfit * 100).toFixed(1)}% vs base
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded">
            <div className="text-sm text-gray-600">RAROC</div>
            <div className="text-xl font-bold text-gray-900">{raroc.toFixed(1)}%</div>
            <div className={`text-sm ${raroc > baseDrivers.raroc ? 'text-green-600' : raroc < baseDrivers.raroc ? 'text-red-600' : 'text-gray-600'}`}>
              {raroc > baseDrivers.raroc ? '+' : ''}{(raroc - baseDrivers.raroc).toFixed(1)}pp vs base
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded">
            <div className="text-sm text-gray-600">Rev/Client</div>
            <div className="text-xl font-bold text-gray-900">${revenuePerClient.toFixed(1)}M</div>
            <div className={`text-sm ${revenuePerClient > baseDrivers.revenuePerClient ? 'text-green-600' : revenuePerClient < baseDrivers.revenuePerClient ? 'text-red-600' : 'text-gray-600'}`}>
              {revenuePerClient > baseDrivers.revenuePerClient ? '+' : ''}{((revenuePerClient - baseDrivers.revenuePerClient) / baseDrivers.revenuePerClient * 100).toFixed(1)}%
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded">
            <div className="text-sm text-gray-600">Total AUM</div>
            <div className="text-xl font-bold text-gray-900">${(aumBase / 1000).toFixed(1)}T</div>
            <div className={`text-sm ${aumBase > baseDrivers.aumPerClient * baseDrivers.numClients ? 'text-green-600' : aumBase < baseDrivers.aumPerClient * baseDrivers.numClients ? 'text-red-600' : 'text-gray-600'}`}>
              {aumBase > baseDrivers.aumPerClient * baseDrivers.numClients ? '+' : ''}{((aumBase - baseDrivers.aumPerClient * baseDrivers.numClients) / (baseDrivers.aumPerClient * baseDrivers.numClients) * 100).toFixed(1)}%
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Driver Tree */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-lg font-semibold">Revenue Driver Tree</h3>
          <span className="text-sm text-gray-500">Click to expand/collapse nodes</span>
        </div>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <TreeNode
            id="revenue"
            label="Total Revenue"
            value={totalRevenue}
            change={(totalRevenue - baseDrivers.revenue) / baseDrivers.revenue * 100}
          >
            <TreeNode
              id="clients"
              label="Number of Clients"
              value={scenarioValues.numClients}
              unit=""
              change={scenario.clientGrowth}
              level={1}
            />
            <TreeNode
              id="revenue-per-client"
              label="Revenue per Client"
              value={revenuePerClient}
              formula="= Revenue / Clients"
              change={(revenuePerClient - baseDrivers.revenuePerClient) / baseDrivers.revenuePerClient * 100}
              level={1}
            >
              <TreeNode
                id="custody-revenue"
                label="Custody Revenue"
                value={custodyRevenue}
                formula="= AUM × Fee Rate"
                level={2}
              >
                <TreeNode
                  id="aum-per-client"
                  label="AUM per Client"
                  value={scenarioValues.aumPerClient}
                  unit="M"
                  change={scenario.aumGrowth}
                  level={3}
                />
                <TreeNode
                  id="fee-rate"
                  label="Fee Rate (basis points)"
                  value={scenarioValues.feeRate}
                  unit="bps"
                  change={scenario.feeRateChange / baseDrivers.feeRate * 100}
                  level={3}
                />
              </TreeNode>
              <TreeNode
                id="transaction-revenue"
                label="Transaction Revenue"
                value={baseDrivers.transactionRevenue}
                level={2}
              />
              <TreeNode
                id="performance-fees"
                label="Performance Fees"
                value={baseDrivers.performanceFees}
                level={2}
              />
              <TreeNode
                id="other-revenue"
                label="Other Revenue"
                value={baseDrivers.otherRevenue}
                level={2}
              />
            </TreeNode>
          </TreeNode>
        </div>
      </div>

      {/* Economic Profit Driver Tree */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Economic Profit Driver Tree</h3>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <TreeNode
            id="economic-profit"
            label="Economic Profit"
            value={economicProfit}
            formula="= Revenue - Costs - Capital Charge"
            change={(economicProfit - baseDrivers.economicProfit) / baseDrivers.economicProfit * 100}
          >
            <TreeNode
              id="total-revenue-2"
              label="Total Revenue"
              value={totalRevenue}
              level={1}
            />
            <TreeNode
              id="total-costs"
              label="Total Costs"
              value={-totalCosts}
              formula="= Direct + Overhead"
              level={1}
            >
              <TreeNode
                id="direct-costs"
                label="Direct Costs"
                value={scenarioValues.directCosts}
                change={scenario.costReduction}
                level={2}
              >
                <TreeNode
                  id="personnel-costs"
                  label="Personnel Costs"
                  value={baseDrivers.personnelCosts * (1 + scenario.costReduction / 100)}
                  level={3}
                />
                <TreeNode
                  id="technology-costs"
                  label="Technology Costs"
                  value={baseDrivers.technologyCosts * (1 + scenario.costReduction / 100)}
                  level={3}
                />
                <TreeNode
                  id="operational-costs"
                  label="Operational Costs"
                  value={baseDrivers.operationalCosts * (1 + scenario.costReduction / 100)}
                  level={3}
                />
              </TreeNode>
              <TreeNode
                id="overhead"
                label="Allocated Overhead"
                value={scenarioValues.allocatedOverhead}
                change={scenario.costReduction}
                level={2}
              />
            </TreeNode>
            <TreeNode
              id="capital-charge"
              label="Capital Charge"
              value={-capitalCharge}
              formula="= Capital × Cost of Capital"
              level={1}
            >
              <TreeNode
                id="allocated-capital"
                label="Allocated Capital"
                value={scenarioValues.allocatedCapital}
                change={scenario.capitalEfficiency}
                level={2}
              />
              <TreeNode
                id="cost-of-capital"
                label="Cost of Capital"
                value={baseDrivers.costOfCapital}
                unit="%"
                level={2}
              />
            </TreeNode>
          </TreeNode>
        </div>
      </div>

      {/* RAROC Driver Tree */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">RAROC Driver Tree</h3>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <TreeNode
            id="raroc"
            label="RAROC (Risk-Adjusted Return on Capital)"
            value={raroc}
            unit="%"
            formula="= Economic Profit / Allocated Capital × 100"
            change={(raroc - baseDrivers.raroc) / baseDrivers.raroc * 100}
          >
            <TreeNode
              id="economic-profit-numerator"
              label="Economic Profit (Numerator)"
              value={economicProfit}
              level={1}
            />
            <TreeNode
              id="allocated-capital-denominator"
              label="Allocated Capital (Denominator)"
              value={scenarioValues.allocatedCapital}
              level={1}
            />
          </TreeNode>
        </div>
      </div>

      {/* Historical Driver Trends */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Historical Driver Trends & Targets</h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="text-sm font-medium text-gray-700 mb-3">Client & AUM Growth</div>
            <ResponsiveContainer width="100%" height={220}>
              <ComposedChart data={historicalTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="clients" fill="#3b82f6" name="Clients" />
                <Line yAxisId="right" type="monotone" dataKey="aumPerClient" stroke="#10b981" strokeWidth={2} name="AUM/Client ($M)" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-700 mb-3">Fee Rate & Cost Efficiency</div>
            <ResponsiveContainer width="100%" height={220}>
              <ComposedChart data={historicalTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis yAxisId="left" domain={[8, 10]} />
                <YAxis yAxisId="right" orientation="right" domain={[23000, 29000]} />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="feeRate" stroke="#f59e0b" strokeWidth={2} name="Fee Rate (bps)" />
                <Line yAxisId="right" type="monotone" dataKey="costPerClient" stroke="#ef4444" strokeWidth={2} name="Cost/Client ($)" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="mt-4 p-4 bg-blue-50 rounded">
          <div className="font-medium text-blue-900 mb-2">Key Trends</div>
          <ul className="space-y-1 text-sm text-blue-800">
            <li>• Client count growing at 5.3% CAGR (258 → 285 → target 308)</li>
            <li>• AUM per client expanding 8.7% annually ($18.2B → $21.5B → target $24.1B)</li>
            <li>• Fee rate compression (9.5 → 8.8 bps) offset by scale benefits</li>
            <li>• Cost per client improved 11.8% ($28,900 → $25,500), targeting $23,400</li>
            <li>• RAROC trajectory: 8.2% → 9.8% → target 12.5% (+280 bps improvement needed)</li>
          </ul>
        </div>
      </div>

      {/* Sensitivity Analysis */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Driver Sensitivity Analysis</h3>
        <div className="text-sm text-gray-600 mb-4">
          Impact of individual driver changes on key metrics (isolated effect, all else equal)
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Driver</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Change</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Revenue Impact</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Profit Impact</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">RAROC Impact</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Feasibility</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Timeframe</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sensitivities.map((sens, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{sens.driver}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{sens.change}</td>
                  <td className="px-4 py-3 text-sm text-right">
                    <span className={sens.revenueImpact > 0 ? 'text-green-600 font-medium' : 'text-gray-400'}>
                      {sens.revenueImpact > 0 ? `+$${sens.revenueImpact}M` : '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-right">
                    <span className="text-green-600 font-medium">+${sens.profitImpact}M</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-right">
                    <span className="text-green-600 font-medium">+{sens.rarocImpact.toFixed(1)}pp</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 text-xs font-medium rounded" style={{
                      backgroundColor: getFeasibilityColor(sens.feasibility) + '20',
                      color: getFeasibilityColor(sens.feasibility)
                    }}>
                      {sens.feasibility}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{sens.timeframe}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="p-4 bg-green-50 rounded">
            <div className="font-medium text-green-900">Highest Impact</div>
            <ul className="mt-2 space-y-1 text-sm text-green-800">
              <li>• Fee rate: +5 bps = +$307M profit, +1.6pp RAROC</li>
              <li>• Capital efficiency: -10% = +$198M profit, +2.1pp RAROC</li>
              <li>• Cost reduction: -$1K/client = +$285M profit</li>
            </ul>
          </div>
          <div className="p-4 bg-blue-50 rounded">
            <div className="font-medium text-blue-900">Best ROI (High Feasibility)</div>
            <ul className="mt-2 space-y-1 text-sm text-blue-800">
              <li>• Client acquisition: +10 clients in 6-12mo</li>
              <li>• Cost optimization: High feasibility, $285M potential</li>
              <li>• Transaction revenue: +10% = +$95M profit</li>
            </ul>
          </div>
          <div className="p-4 bg-amber-50 rounded">
            <div className="font-medium text-amber-900">Strategic Priorities</div>
            <ul className="mt-2 space-y-1 text-sm text-amber-800">
              <li>• Focus on AUM growth (1.1pp RAROC impact per $1B)</li>
              <li>• Fee optimization requires market positioning work</li>
              <li>• Capital efficiency gains need 12-24 month horizon</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bridge to Target */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">RAROC Bridge: 2024 Actual → 2025 Target (12.5%)</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={bridgeData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-15} textAnchor="end" height={100} />
            <YAxis domain={[0, 14]} />
            <Tooltip />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {bridgeData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.type === 'actual' ? '#6b7280' :
                    entry.type === 'target' ? '#10b981' :
                    entry.type === 'positive' ? '#3b82f6' :
                    '#ef4444'
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 p-4 bg-indigo-50 rounded">
          <div className="font-medium text-indigo-900 mb-2">Path to Target</div>
          <div className="grid grid-cols-2 gap-4 text-sm text-indigo-800">
            <div>
              <div className="font-medium">Required Actions (2024-2025)</div>
              <ul className="mt-1 space-y-1">
                <li>• Add 23 new clients (+8% growth) = +0.8pp RAROC</li>
                <li>• Grow AUM/client $2.6B (+12%) = +1.2pp RAROC</li>
                <li>• Implement pricing actions (+0.5 bps) = +0.9pp RAROC</li>
                <li>• Execute efficiency initiatives = +0.6pp RAROC</li>
                <li>• Optimize capital allocation = +0.4pp RAROC</li>
              </ul>
            </div>
            <div>
              <div className="font-medium">Risk Factors</div>
              <ul className="mt-1 space-y-1">
                <li>• Market volatility: -1.2pp downside to RAROC</li>
                <li>• Competitive pricing pressure on custody fees</li>
                <li>• Client retention during market stress</li>
                <li>• Execution risk on cost initiatives (timing)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
