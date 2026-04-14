import { useState } from 'react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, ComposedChart, Area } from 'recharts'
import { ChevronDown, ChevronRight, TrendingUp, TrendingDown, Target, AlertTriangle, ArrowRight } from 'lucide-react'

export default function DriverTreesEnhanced() {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['revenue', 'economic-profit']))
  const [selectedScenario, setSelectedScenario] = useState<'base' | 'optimistic' | 'pessimistic'>('base')
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)

  // Base case drivers (2024)
  const baseDrivers = {
    revenue: 5390,
    economicProfit: 1854,
    raroc: 9.8,
    numClients: 285,
    aumPerClient: 21.5, // $B
    feeRate: 8.8, // bps
    directCosts: 2156,
    allocatedOverhead: 1380,
    allocatedCapital: 18900,
    costPerTransaction: 1.60,
  }

  // Historical trends for mini sparklines
  const trends = {
    revenue: [4850, 5020, 5180, 5270, 5390],
    raroc: [8.2, 8.6, 9.0, 9.4, 9.8],
    clients: [258, 265, 272, 278, 285],
    aumPerClient: [18.2, 19.1, 19.8, 20.6, 21.5],
    feeRate: [9.5, 9.3, 9.1, 8.9, 8.8],
    costs: [3680, 3590, 3540, 3450, 3536],
  }

  const Sparkline = ({ data, color = '#3b82f6' }: { data: number[], color?: string }) => (
    <svg width="60" height="20" className="inline-block">
      {data.map((val, idx) => {
        if (idx === data.length - 1) return null
        const x1 = (idx / (data.length - 1)) * 60
        const x2 = ((idx + 1) / (data.length - 1)) * 60
        const minVal = Math.min(...data)
        const maxVal = Math.max(...data)
        const range = maxVal - minVal || 1
        const y1 = 20 - ((val - minVal) / range) * 18
        const y2 = 20 - ((data[idx + 1] - minVal) / range) * 18
        return <line key={idx} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="2" />
      })}
    </svg>
  )

  const VisualDriverNode = ({
    id,
    label,
    value,
    unit = 'M',
    contribution,
    level = 0,
    children,
    formula,
    trendData,
    change
  }: {
    id: string
    label: string
    value: number
    unit?: string
    contribution?: number
    level?: number
    children?: React.ReactNode
    formula?: string
    trendData?: number[]
    change?: number
  }) => {
    const isExpanded = expandedNodes.has(id)
    const hasChildren = !!children
    const isHovered = hoveredNode === id

    return (
      <div className="relative">
        {/* Connector Line */}
        {level > 0 && (
          <div className="absolute left-0 top-0 w-8 h-1/2 border-l-2 border-b-2 rounded-bl-lg" style={{
            borderColor: 'rgba(var(--client-accent-rgb), 0.3)',
            marginLeft: `-${level * 32}px`
          }} />
        )}

        <div
          className="rounded-xl p-4 mb-3 cursor-pointer transition-all duration-200 hover:shadow-lg"
          style={{
            marginLeft: `${level * 32}px`,
            background: isHovered
              ? 'linear-gradient(135deg, rgba(var(--client-accent-rgb), 0.15) 0%, rgba(var(--client-accent-rgb), 0.05) 100%)'
              : 'linear-gradient(135deg, #ffffff 0%, rgba(248, 249, 250, 0.5) 100%)',
            border: `2px solid ${isHovered ? 'rgba(var(--client-accent-rgb), 0.4)' : 'rgba(var(--client-primary-rgb), 0.08)'}`,
            transform: isHovered ? 'translateX(4px)' : 'translateX(0)'
          }}
          onClick={() => hasChildren && toggleNode(id)}
          onMouseEnter={() => setHoveredNode(id)}
          onMouseLeave={() => setHoveredNode(null)}
        >
          <div className="flex items-center justify-between">
            {/* Left: Label & Formula */}
            <div className="flex items-center gap-3 flex-1">
              {hasChildren && (
                <div className="flex-shrink-0">
                  {isExpanded ? (
                    <ChevronDown className="h-5 w-5" style={{ color: 'var(--client-accent)' }} />
                  ) : (
                    <ChevronRight className="h-5 w-5" style={{ color: 'var(--client-accent)' }} />
                  )}
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm" style={{ color: 'var(--client-primary)' }}>{label}</span>
                  {formula && (
                    <span className="text-xs font-mono px-2 py-0.5 rounded" style={{
                      backgroundColor: 'rgba(var(--client-primary-rgb), 0.05)',
                      color: '#6b7280'
                    }}>
                      {formula}
                    </span>
                  )}
                </div>
                {contribution !== undefined && (
                  <div className="mt-1">
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-1.5">
                        <div
                          className="h-1.5 rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.abs(contribution)}%`,
                            backgroundColor: contribution >= 0 ? '#10b981' : '#ef4444'
                          }}
                        />
                      </div>
                      <span className="text-xs font-semibold" style={{
                        color: contribution >= 0 ? '#10b981' : '#ef4444'
                      }}>
                        {contribution >= 0 ? '+' : ''}{contribution.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Center: Trend Sparkline */}
            {trendData && (
              <div className="flex-shrink-0 mx-4">
                <Sparkline data={trendData} color={change && change > 0 ? '#10b981' : change && change < 0 ? '#ef4444' : '#3b82f6'} />
              </div>
            )}

            {/* Right: Value & Change */}
            <div className="flex items-center gap-4 flex-shrink-0">
              <div className="text-right">
                <div className="text-2xl font-bold" style={{ color: 'var(--client-accent)' }}>
                  {unit === '$' ? '$' : ''}{value.toLocaleString(undefined, { maximumFractionDigits: unit === 'bps' ? 1 : 0 })}{unit === 'M' ? 'M' : unit === '%' ? '%' : unit === 'bps' ? ' bps' : unit === 'B' ? 'B' : ''}
                </div>
                {change !== undefined && (
                  <div className={`text-sm font-semibold flex items-center justify-end gap-1 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {change >= 0 ? '+' : ''}{change.toFixed(1)}%
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Children */}
        {isExpanded && hasChildren && (
          <div className="ml-4 border-l-2 pl-4" style={{ borderColor: 'rgba(var(--client-accent-rgb), 0.2)' }}>
            {children}
          </div>
        )}
      </div>
    )
  }

  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes)
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId)
    } else {
      newExpanded.add(nodeId)
    }
    setExpandedNodes(newExpanded)
  }

  // Waterfall data for Revenue decomposition
  const revenueWaterfall = [
    { name: 'Clients', value: 285, contribution: 28 },
    { name: 'AUM/Client', value: 21.5, contribution: 35 },
    { name: 'Fee Rate', value: 8.8, contribution: 24 },
    { name: 'Transaction', value: 1245, contribution: 23 },
    { name: 'Performance', value: 485, contribution: 9 },
    { name: 'Other', value: 220, contribution: 4 },
  ]

  return (
    <div className="space-y-6">
      {/* Header with Scenario Selector */}
      <div className="rounded-2xl p-6 shadow-lg" style={{
        background: 'linear-gradient(135deg, rgba(var(--client-primary-rgb), 0.05) 0%, rgba(var(--client-primary-rgb), 0.02) 100%)',
        border: '1px solid rgba(var(--client-primary-rgb), 0.15)'
      }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold" style={{ color: 'var(--client-primary)' }}>Visual Driver Trees</h2>
            <p className="text-sm mt-1" style={{ color: '#6b7280' }}>Interactive decomposition with historical trends and contribution analysis</p>
          </div>
          <div className="flex gap-2">
            {(['base', 'optimistic', 'pessimistic'] as const).map(s => (
              <button
                key={s}
                onClick={() => setSelectedScenario(s)}
                className="px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200"
                style={{
                  backgroundColor: selectedScenario === s ? 'var(--client-accent)' : 'rgba(var(--client-accent-rgb), 0.1)',
                  color: selectedScenario === s ? '#ffffff' : 'var(--client-accent)'
                }}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6 text-xs" style={{ color: '#6b7280' }}>
          <div className="flex items-center gap-2">
            <div className="w-12 h-1 rounded" style={{ backgroundColor: '#10b981' }} />
            <span>Positive Driver</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-12 h-1 rounded" style={{ backgroundColor: '#ef4444' }} />
            <span>Negative Driver</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkline data={[1, 1.2, 1.5, 1.3, 1.6]} color="#3b82f6" />
            <span>5-Year Trend</span>
          </div>
        </div>
      </div>

      {/* Revenue Contribution Breakdown */}
      <div className="rounded-2xl p-6 shadow-lg" style={{
        background: 'linear-gradient(135deg, #ffffff 0%, rgba(248, 249, 250, 0.5) 100%)',
        border: '1px solid rgba(var(--client-primary-rgb), 0.08)'
      }}>
        <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--client-primary)' }}>Revenue Driver Contributions</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={revenueWaterfall} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 0, 0, 0.05)" />
            <XAxis dataKey="name" style={{ fontSize: '12px', fill: '#6b7280' }} />
            <YAxis style={{ fontSize: '12px', fill: '#6b7280' }} label={{ value: '% Contribution', angle: -90, position: 'insideLeft', style: { fill: '#6b7280' } }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid rgba(var(--client-primary-rgb), 0.2)',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Bar dataKey="contribution" radius={[8, 8, 0, 0]}>
              {revenueWaterfall.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index < 3 ? 'var(--client-accent)' : 'var(--client-primary)'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Interactive Tree Structure */}
      <div className="rounded-2xl p-6 shadow-lg" style={{
        background: 'linear-gradient(135deg, #ffffff 0%, rgba(248, 249, 250, 0.5) 100%)',
        border: '1px solid rgba(var(--client-primary-rgb), 0.08)'
      }}>
        <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--client-primary)' }}>Revenue Tree (Interactive)</h3>

        <VisualDriverNode
          id="revenue"
          label="Total Revenue"
          value={5390}
          trendData={trends.revenue}
          change={8.2}
        >
          <VisualDriverNode
            id="clients"
            label="Number of Clients"
            value={285}
            unit=""
            contribution={28}
            trendData={trends.clients}
            change={5.3}
            level={1}
          />
          <VisualDriverNode
            id="revenue-per-client"
            label="Revenue per Client"
            value={18.9}
            unit="M"
            formula="= Revenue / Clients"
            contribution={72}
            level={1}
          >
            <VisualDriverNode
              id="aum-per-client"
              label="AUM per Client"
              value={21.5}
              unit="B"
              contribution={49}
              trendData={trends.aumPerClient}
              change={8.7}
              level={2}
            />
            <VisualDriverNode
              id="fee-rate"
              label="Fee Rate"
              value={8.8}
              unit="bps"
              contribution={34}
              trendData={trends.feeRate}
              change={-7.4}
              level={2}
            />
            <VisualDriverNode
              id="transaction-revenue"
              label="Transaction Revenue"
              value={1245}
              contribution={23}
              level={2}
            />
            <VisualDriverNode
              id="performance-fees"
              label="Performance Fees"
              value={485}
              contribution={9}
              level={2}
            />
          </VisualDriverNode>
        </VisualDriverNode>
      </div>

      {/* Economic Profit Tree */}
      <div className="rounded-2xl p-6 shadow-lg" style={{
        background: 'linear-gradient(135deg, #ffffff 0%, rgba(248, 249, 250, 0.5) 100%)',
        border: '1px solid rgba(var(--client-primary-rgb), 0.08)'
      }}>
        <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--client-primary)' }}>Economic Profit Tree (Interactive)</h3>

        <VisualDriverNode
          id="economic-profit"
          label="Economic Profit"
          value={1854}
          formula="= Revenue - Costs - Capital Charge"
          trendData={[1550, 1620, 1710, 1780, 1854]}
          change={12.3}
        >
          <VisualDriverNode
            id="total-revenue-2"
            label="Total Revenue"
            value={5390}
            contribution={100}
            level={1}
          />
          <VisualDriverNode
            id="total-costs"
            label="Total Costs"
            value={3536}
            contribution={-65}
            trendData={trends.costs}
            change={-1.8}
            level={1}
          >
            <VisualDriverNode
              id="direct-costs"
              label="Direct Costs"
              value={2156}
              contribution={-40}
              level={2}
            />
            <VisualDriverNode
              id="overhead"
              label="Allocated Overhead"
              value={1380}
              contribution={-26}
              level={2}
            />
          </VisualDriverNode>
          <VisualDriverNode
            id="capital-charge"
            label="Capital Charge"
            value={1985}
            formula="= Capital × 10.5%"
            contribution={-37}
            level={1}
          />
        </VisualDriverNode>
      </div>

      {/* RAROC Decomposition with Sankey-style Visual */}
      <div className="rounded-2xl p-6 shadow-lg" style={{
        background: 'linear-gradient(135deg, rgba(var(--client-accent-rgb), 0.05) 0%, rgba(var(--client-accent-rgb), 0.02) 100%)',
        border: '1px solid rgba(var(--client-accent-rgb), 0.2)'
      }}>
        <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--client-primary)' }}>RAROC Decomposition (9.8%)</h3>
        <div className="grid grid-cols-3 gap-8 items-center">
          <div className="text-center p-6 rounded-xl" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
            <div className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: '#6b7280' }}>
              Economic Profit
            </div>
            <div className="text-4xl font-bold text-green-600">$1,854M</div>
          </div>

          <div className="text-center">
            <ArrowRight className="h-12 w-12 mx-auto" style={{ color: 'var(--client-accent)' }} />
            <div className="text-xs font-semibold mt-2" style={{ color: '#6b7280' }}>÷ Allocated Capital</div>
          </div>

          <div className="text-center p-6 rounded-xl" style={{ backgroundColor: 'rgba(var(--client-accent-rgb), 0.15)' }}>
            <div className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: '#6b7280' }}>
              RAROC
            </div>
            <div className="text-4xl font-bold" style={{ color: 'var(--client-accent)' }}>9.8%</div>
            <div className="text-xs mt-2" style={{ color: '#6b7280' }}>
              Target: 12.5% (+2.7pp gap)
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6" style={{ borderTop: '1px solid rgba(var(--client-accent-rgb), 0.2)' }}>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="font-semibold mb-2" style={{ color: 'var(--client-primary)' }}>Key Drivers to Close Gap:</div>
              <ul className="space-y-1" style={{ color: '#6b7280' }}>
                <li>• Revenue Growth: +8% clients, +12% AUM → +$720M</li>
                <li>• Fee Optimization: +0.5 bps → +$307M</li>
                <li>• Cost Reduction: -8% costs → +$283M</li>
                <li>• Capital Efficiency: -10% capital → +$198M</li>
              </ul>
            </div>
            <div>
              <div className="font-semibold mb-2" style={{ color: 'var(--client-primary)' }}>Historical Progress:</div>
              <div className="space-y-2">
                {[
                  { year: '2022', raroc: 8.2 },
                  { year: '2023', raroc: 9.0 },
                  { year: '2024', raroc: 9.8 },
                  { year: '2025 Target', raroc: 12.5 }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span style={{ color: '#6b7280' }}>{item.year}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all duration-500"
                          style={{
                            width: `${(item.raroc / 12.5) * 100}%`,
                            backgroundColor: item.raroc >= 12.5 ? '#10b981' : 'var(--client-accent)'
                          }}
                        />
                      </div>
                      <span className="font-bold w-12 text-right" style={{ color: 'var(--client-primary)' }}>{item.raroc}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
