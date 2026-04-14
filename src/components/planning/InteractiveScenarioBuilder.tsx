import { useState } from 'react'
import { TrendingUp, TrendingDown, DollarSign, Users, Zap, AlertTriangle } from 'lucide-react'

export default function InteractiveScenarioBuilder() {
  const [sliders, setSliders] = useState({
    clientGrowth: 8,
    aumGrowth: 12,
    feeRate: 5,
    costReduction: -8,
    capitalEfficiency: -10
  })

  // Base case values
  const base = {
    clients: 285,
    aumPerClient: 21.5, // $B
    feeRate: 8.8, // bps
    revenue: 5390, // $M
    costs: 3367, // $M
    capital: 18900, // $M
    economicProfit: 1854, // $M
    raroc: 9.8 // %
  }

  // Calculate scenario values
  const scenario = {
    clients: Math.round(base.clients * (1 + sliders.clientGrowth / 100)),
    aumPerClient: (base.aumPerClient * (1 + sliders.aumGrowth / 100)).toFixed(1),
    feeRate: (base.feeRate + sliders.feeRate / 10).toFixed(1),
    costs: Math.round(base.costs * (1 + sliders.costReduction / 100)),
    capital: Math.round(base.capital * (1 + sliders.capitalEfficiency / 100))
  }

  // Calculate derived metrics
  const totalAum = scenario.clients * parseFloat(scenario.aumPerClient)
  const custodyRevenue = (totalAum * parseFloat(scenario.feeRate)) / 10000
  const totalRevenue = custodyRevenue + 1950 // other revenue
  const capitalCharge = scenario.capital * 0.105
  const economicProfit = totalRevenue - scenario.costs - capitalCharge
  const raroc = (economicProfit / scenario.capital) * 100

  // Calculate deltas
  const deltas = {
    clients: scenario.clients - base.clients,
    aumPerClient: parseFloat(scenario.aumPerClient) - base.aumPerClient,
    feeRate: parseFloat(scenario.feeRate) - base.feeRate,
    revenue: totalRevenue - base.revenue,
    costs: scenario.costs - base.costs,
    economicProfit: economicProfit - base.economicProfit,
    raroc: raroc - base.raroc
  }

  const resetToBase = () => {
    setSliders({
      clientGrowth: 0,
      aumGrowth: 0,
      feeRate: 0,
      costReduction: 0,
      capitalEfficiency: 0
    })
  }

  const applyOptimistic = () => {
    setSliders({
      clientGrowth: 8,
      aumGrowth: 12,
      feeRate: 5,
      costReduction: -8,
      capitalEfficiency: -10
    })
  }

  const applyPessimistic = () => {
    setSliders({
      clientGrowth: -5,
      aumGrowth: -8,
      feeRate: -3,
      costReduction: 5,
      capitalEfficiency: 8
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl p-6 shadow-lg" style={{
        background: 'linear-gradient(135deg, rgba(var(--client-accent-rgb), 0.1) 0%, rgba(var(--client-accent-rgb), 0.05) 100%)',
        border: '1px solid rgba(var(--client-accent-rgb), 0.2)'
      }}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold" style={{ color: 'var(--client-text)' }}>Interactive Scenario Builder</h2>
            <p className="text-sm mt-1" style={{ color: '#6b7280' }}>
              Adjust levers below to see real-time impact on financial outcomes
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={resetToBase}
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:shadow-md"
              style={{
                backgroundColor: 'rgba(107, 114, 128, 0.1)',
                color: '#6b7280'
              }}
            >
              Reset to Base
            </button>
            <button
              onClick={applyOptimistic}
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:shadow-md"
              style={{
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                color: '#10b981'
              }}
            >
              Apply Optimistic
            </button>
            <button
              onClick={applyPessimistic}
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:shadow-md"
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                color: '#ef4444'
              }}
            >
              Apply Pessimistic
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Left: Sliders */}
        <div className="space-y-4">
          <div className="rounded-2xl p-6 shadow-lg" style={{
            background: 'linear-gradient(135deg, #ffffff 0%, rgba(248, 249, 250, 0.5) 100%)',
            border: '1px solid rgba(var(--client-primary-rgb), 0.08)'
          }}>
            <h3 className="text-lg font-bold mb-6" style={{ color: 'var(--client-text)' }}>Adjust Key Levers</h3>

            {/* Client Growth */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" style={{ color: '#3b82f6' }} />
                  <span className="font-semibold text-sm" style={{ color: 'var(--client-text)' }}>Client Growth</span>
                </div>
                <span className="text-lg font-bold" style={{ color: 'var(--client-accent)' }}>
                  {sliders.clientGrowth > 0 ? '+' : ''}{sliders.clientGrowth}%
                </span>
              </div>
              <input
                type="range"
                min="-10"
                max="15"
                step="1"
                value={sliders.clientGrowth}
                onChange={(e) => setSliders({ ...sliders, clientGrowth: parseInt(e.target.value) })}
                className="w-full h-3 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #ef4444 0%, #f59e0b 50%, #10b981 100%)`,
                }}
              />
              <div className="flex justify-between text-xs mt-1" style={{ color: '#9ca3af' }}>
                <span>-10%</span>
                <span>0%</span>
                <span>+15%</span>
              </div>
            </div>

            {/* AUM Growth */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" style={{ color: '#10b981' }} />
                  <span className="font-semibold text-sm" style={{ color: 'var(--client-text)' }}>AUM per Client Growth</span>
                </div>
                <span className="text-lg font-bold" style={{ color: 'var(--client-accent)' }}>
                  {sliders.aumGrowth > 0 ? '+' : ''}{sliders.aumGrowth}%
                </span>
              </div>
              <input
                type="range"
                min="-15"
                max="20"
                step="1"
                value={sliders.aumGrowth}
                onChange={(e) => setSliders({ ...sliders, aumGrowth: parseInt(e.target.value) })}
                className="w-full h-3 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #ef4444 0%, #f59e0b 50%, #10b981 100%)`,
                }}
              />
              <div className="flex justify-between text-xs mt-1" style={{ color: '#9ca3af' }}>
                <span>-15%</span>
                <span>0%</span>
                <span>+20%</span>
              </div>
            </div>

            {/* Fee Rate Change */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" style={{ color: 'var(--client-accent)' }} />
                  <span className="font-semibold text-sm" style={{ color: 'var(--client-text)' }}>Fee Rate Change</span>
                </div>
                <span className="text-lg font-bold" style={{ color: 'var(--client-accent)' }}>
                  {sliders.feeRate > 0 ? '+' : ''}{(sliders.feeRate / 10).toFixed(1)} bps
                </span>
              </div>
              <input
                type="range"
                min="-5"
                max="10"
                step="1"
                value={sliders.feeRate}
                onChange={(e) => setSliders({ ...sliders, feeRate: parseInt(e.target.value) })}
                className="w-full h-3 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #ef4444 0%, #f59e0b 50%, #10b981 100%)`,
                }}
              />
              <div className="flex justify-between text-xs mt-1" style={{ color: '#9ca3af' }}>
                <span>-0.5 bps</span>
                <span>0 bps</span>
                <span>+1.0 bps</span>
              </div>
            </div>

            {/* Cost Reduction */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5" style={{ color: '#f59e0b' }} />
                  <span className="font-semibold text-sm" style={{ color: 'var(--client-text)' }}>Cost Reduction</span>
                </div>
                <span className="text-lg font-bold" style={{ color: 'var(--client-accent)' }}>
                  {sliders.costReduction}%
                </span>
              </div>
              <input
                type="range"
                min="-15"
                max="10"
                step="1"
                value={sliders.costReduction}
                onChange={(e) => setSliders({ ...sliders, costReduction: parseInt(e.target.value) })}
                className="w-full h-3 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #10b981 0%, #f59e0b 50%, #ef4444 100%)`,
                }}
              />
              <div className="flex justify-between text-xs mt-1" style={{ color: '#9ca3af' }}>
                <span>-15% (save)</span>
                <span>0%</span>
                <span>+10% (increase)</span>
              </div>
            </div>

            {/* Capital Efficiency */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-5 w-5" style={{ color: '#3b82f6' }} />
                  <span className="font-semibold text-sm" style={{ color: 'var(--client-text)' }}>Capital Efficiency</span>
                </div>
                <span className="text-lg font-bold" style={{ color: 'var(--client-accent)' }}>
                  {sliders.capitalEfficiency}%
                </span>
              </div>
              <input
                type="range"
                min="-15"
                max="10"
                step="1"
                value={sliders.capitalEfficiency}
                onChange={(e) => setSliders({ ...sliders, capitalEfficiency: parseInt(e.target.value) })}
                className="w-full h-3 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #10b981 0%, #f59e0b 50%, #ef4444 100%)`,
                }}
              />
              <div className="flex justify-between text-xs mt-1" style={{ color: '#9ca3af' }}>
                <span>-15% (optimize)</span>
                <span>0%</span>
                <span>+10% (increase)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Results */}
        <div className="space-y-4">
          {/* Key Outcomes */}
          <div className="rounded-2xl p-6 shadow-lg" style={{
            background: 'linear-gradient(135deg, rgba(var(--client-accent-rgb), 0.15) 0%, rgba(var(--client-accent-rgb), 0.05) 100%)',
            border: '2px solid rgba(var(--client-accent-rgb), 0.3)'
          }}>
            <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--client-text)' }}>Scenario Outcomes</h3>

            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-white">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#6b7280' }}>RAROC</div>
                    <div className="text-3xl font-bold mt-1" style={{ color: 'var(--client-accent)' }}>{raroc.toFixed(1)}%</div>
                  </div>
                  <div className="text-right">
                    <div className={`text-xl font-bold ${deltas.raroc >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {deltas.raroc >= 0 ? '+' : ''}{deltas.raroc.toFixed(1)}pp
                    </div>
                    <div className="text-xs" style={{ color: '#9ca3af' }}>vs base {base.raroc}%</div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#6b7280' }}>Economic Profit</div>
                    <div className="text-3xl font-bold mt-1" style={{ color: 'var(--client-text)' }}>${economicProfit.toFixed(0)}M</div>
                  </div>
                  <div className="text-right">
                    <div className={`text-xl font-bold ${deltas.economicProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {deltas.economicProfit >= 0 ? '+' : ''}{deltas.economicProfit.toFixed(0)}M
                    </div>
                    <div className="text-xs" style={{ color: '#9ca3af' }}>vs base ${base.economicProfit}M</div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#6b7280' }}>Total Revenue</div>
                    <div className="text-2xl font-bold mt-1" style={{ color: 'var(--client-text)' }}>${totalRevenue.toFixed(0)}M</div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${deltas.revenue >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {deltas.revenue >= 0 ? '+' : ''}{deltas.revenue.toFixed(0)}M
                    </div>
                    <div className="text-xs" style={{ color: '#9ca3af' }}>vs base ${base.revenue}M</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Scenario Details */}
          <div className="rounded-2xl p-6 shadow-lg" style={{
            background: 'linear-gradient(135deg, #ffffff 0%, rgba(248, 249, 250, 0.5) 100%)',
            border: '1px solid rgba(var(--client-primary-rgb), 0.08)'
          }}>
            <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--client-text)' }}>Scenario Details</h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between p-2 rounded" style={{ backgroundColor: 'rgba(var(--client-primary-rgb), 0.02)' }}>
                <span style={{ color: '#6b7280' }}>Clients</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold" style={{ color: 'var(--client-text)' }}>{scenario.clients}</span>
                  <span className={`text-xs font-semibold ${deltas.clients >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ({deltas.clients >= 0 ? '+' : ''}{deltas.clients})
                  </span>
                </div>
              </div>

              <div className="flex justify-between p-2 rounded" style={{ backgroundColor: 'rgba(var(--client-primary-rgb), 0.02)' }}>
                <span style={{ color: '#6b7280' }}>AUM per Client</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold" style={{ color: 'var(--client-text)' }}>${scenario.aumPerClient}B</span>
                  <span className={`text-xs font-semibold ${deltas.aumPerClient >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ({deltas.aumPerClient >= 0 ? '+' : ''}{deltas.aumPerClient.toFixed(1)}B)
                  </span>
                </div>
              </div>

              <div className="flex justify-between p-2 rounded" style={{ backgroundColor: 'rgba(var(--client-primary-rgb), 0.02)' }}>
                <span style={{ color: '#6b7280' }}>Total AUM</span>
                <span className="font-bold" style={{ color: 'var(--client-text)' }}>${totalAum.toFixed(1)}B</span>
              </div>

              <div className="flex justify-between p-2 rounded" style={{ backgroundColor: 'rgba(var(--client-primary-rgb), 0.02)' }}>
                <span style={{ color: '#6b7280' }}>Fee Rate</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold" style={{ color: 'var(--client-text)' }}>{scenario.feeRate} bps</span>
                  <span className={`text-xs font-semibold ${deltas.feeRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ({deltas.feeRate >= 0 ? '+' : ''}{deltas.feeRate.toFixed(1)} bps)
                  </span>
                </div>
              </div>

              <div className="flex justify-between p-2 rounded" style={{ backgroundColor: 'rgba(var(--client-primary-rgb), 0.02)' }}>
                <span style={{ color: '#6b7280' }}>Total Costs</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold" style={{ color: 'var(--client-text)' }}>${scenario.costs}M</span>
                  <span className={`text-xs font-semibold ${deltas.costs <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ({deltas.costs >= 0 ? '+' : ''}{deltas.costs}M)
                  </span>
                </div>
              </div>

              <div className="flex justify-between p-2 rounded" style={{ backgroundColor: 'rgba(var(--client-primary-rgb), 0.02)' }}>
                <span style={{ color: '#6b7280' }}>Allocated Capital</span>
                <span className="font-bold" style={{ color: 'var(--client-text)' }}>${scenario.capital}M</span>
              </div>
            </div>
          </div>

          {/* Assessment */}
          <div className="rounded-xl p-4 shadow-lg" style={{
            background: raroc >= 12.5 ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)' :
                       raroc >= 9.8 ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%)' :
                       'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)',
            border: `1px solid ${raroc >= 12.5 ? 'rgba(16, 185, 129, 0.3)' : raroc >= 9.8 ? 'rgba(245, 158, 11, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
          }}>
            <div className="flex items-center gap-2 mb-2">
              {raroc >= 12.5 ? <TrendingUp className="h-5 w-5 text-green-600" /> :
               raroc >= 9.8 ? <AlertTriangle className="h-5 w-5 text-amber-600" /> :
               <TrendingDown className="h-5 w-5 text-red-600" />}
              <span className="font-bold text-sm" style={{
                color: raroc >= 12.5 ? '#10b981' : raroc >= 9.8 ? '#f59e0b' : '#ef4444'
              }}>
                {raroc >= 12.5 ? 'Exceeds Target' : raroc >= 9.8 ? 'Below Target' : 'Significant Gap to Target'}
              </span>
            </div>
            <p className="text-xs" style={{ color: '#6b7280' }}>
              {raroc >= 12.5
                ? `This scenario achieves the 12.5% RAROC target. Economic profit of $${economicProfit.toFixed(0)}M represents strong value creation.`
                : raroc >= 9.8
                ? `RAROC is ${(12.5 - raroc).toFixed(1)}pp below the 12.5% target. Additional levers needed to close the gap.`
                : `Significant underperformance vs target. This scenario destroys value and requires major strategic shifts.`
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
