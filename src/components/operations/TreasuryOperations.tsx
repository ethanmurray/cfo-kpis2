import { useMemo } from 'react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, Area, AreaChart } from 'recharts'
import { DollarSign, TrendingUp, AlertCircle, Clock } from 'lucide-react'
import MetricTile from '../MetricTile'
import MetricGroup from '../MetricGroup'
import { formatCurrency } from '../../utils/dataGenerators'

export default function TreasuryOperations() {
  // Daily Cash Position by Currency
  const cashPositionByCurrency = useMemo(() => [
    { currency: 'USD', opening: 12450, inflows: 8920, outflows: 8340, closing: 13030, requiredMin: 8500 },
    { currency: 'EUR', opening: 3280, inflows: 2150, outflows: 2080, closing: 3350, requiredMin: 2200 },
    { currency: 'GBP', opening: 1950, inflows: 1420, outflows: 1380, closing: 1990, requiredMin: 1200 },
    { currency: 'JPY', opening: 820, inflows: 580, outflows: 640, closing: 760, requiredMin: 500 },
    { currency: 'CHF', opening: 640, inflows: 390, outflows: 420, closing: 610, requiredMin: 400 },
  ], [])

  const totalCashPosition = cashPositionByCurrency.reduce((sum, item) => sum + item.closing, 0)

  // Intraday Liquidity Usage (hourly pattern)
  const intradayLiquidity = useMemo(() => [
    { hour: '09:00', used: 2850, limit: 15000, utilization: 19 },
    { hour: '10:00', used: 5620, limit: 15000, utilization: 37 },
    { hour: '11:00', used: 8940, limit: 15000, utilization: 60 },
    { hour: '12:00', used: 11280, limit: 15000, utilization: 75 },
    { hour: '13:00', used: 12840, limit: 15000, utilization: 86 },
    { hour: '14:00', used: 11950, limit: 15000, utilization: 80 },
    { hour: '15:00', used: 9820, limit: 15000, utilization: 65 },
    { hour: '16:00', used: 6540, limit: 15000, utilization: 44 },
    { hour: '17:00', used: 3280, limit: 15000, utilization: 22 },
  ], [])

  const peakLiquidityUsage = Math.max(...intradayLiquidity.map(item => item.used))
  const peakUtilization = Math.max(...intradayLiquidity.map(item => item.utilization))

  // Collateral Management
  const collateralPositions = useMemo(() => [
    { counterparty: 'JPMorgan Chase', posted: 1850, required: 1720, excess: 130, rating: 'A+', type: 'Treasury Securities' },
    { counterparty: 'BNY Mellon', posted: 1420, required: 1480, excess: -60, rating: 'AA-', type: 'Agency MBS' },
    { counterparty: 'State Street', posted: 980, required: 920, excess: 60, rating: 'AA', type: 'Treasury Securities' },
    { counterparty: 'Citi', posted: 750, required: 680, excess: 70, rating: 'A', type: 'Corporate Bonds' },
    { counterparty: 'Goldman Sachs', posted: 640, required: 710, excess: -70, rating: 'A', type: 'Agency MBS' },
  ], [])

  const totalPosted = collateralPositions.reduce((sum, item) => sum + item.posted, 0)
  const totalRequired = collateralPositions.reduce((sum, item) => sum + item.required, 0)
  const netExcess = totalPosted - totalRequired
  const marginCallCount = collateralPositions.filter(item => item.excess < 0).length

  // Fed Funds Activity
  const fedFundsActivity = useMemo(() => [
    { date: 'Mon', borrowed: 2850, lent: 1420, netPosition: -1430, rate: 5.33 },
    { date: 'Tue', borrowed: 3120, lent: 1680, netPosition: -1440, rate: 5.35 },
    { date: 'Wed', borrowed: 2640, lent: 2050, netPosition: -590, rate: 5.32 },
    { date: 'Thu', borrowed: 2980, lent: 1890, netPosition: -1090, rate: 5.34 },
    { date: 'Fri', borrowed: 3280, lent: 1540, netPosition: -1740, rate: 5.36 },
  ], [])

  const avgFedFundsRate = (fedFundsActivity.reduce((sum, item) => sum + item.rate, 0) / fedFundsActivity.length).toFixed(2)

  // Investment Portfolio Activity (last 5 days)
  const investmentActivity = useMemo(() => [
    { day: 'Mon', purchases: 1850, sales: 1240, netInvestment: 610, avgYield: 4.85 },
    { day: 'Tue', purchases: 2120, sales: 980, netInvestment: 1140, avgYield: 4.92 },
    { day: 'Wed', purchases: 1640, sales: 1850, netInvestment: -210, avgYield: 4.88 },
    { day: 'Thu', purchases: 1980, sales: 1420, netInvestment: 560, avgYield: 4.90 },
    { day: 'Fri', purchases: 2340, sales: 1680, netInvestment: 660, avgYield: 4.87 },
  ], [])

  // FX Settlement Risk
  const fxSettlementRisk = useMemo(() => [
    { pair: 'EUR/USD', outstanding: 3840, settling: 2150, aged: 280, risk: 'Low' },
    { pair: 'GBP/USD', outstanding: 2920, settling: 1680, aged: 180, risk: 'Low' },
    { pair: 'USD/JPY', outstanding: 1850, settling: 1240, aged: 95, risk: 'Low' },
    { pair: 'USD/CHF', outstanding: 1420, settling: 980, aged: 140, risk: 'Medium' },
    { pair: 'EUR/GBP', outstanding: 980, settling: 640, aged: 85, risk: 'Low' },
  ], [])

  const totalFXOutstanding = fxSettlementRisk.reduce((sum, item) => sum + item.outstanding, 0)
  const totalFXAged = fxSettlementRisk.reduce((sum, item) => sum + item.aged, 0)

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899']

  return (
    <div className="space-y-6">
      {/* Summary Metrics */}
      <MetricGroup title="Treasury Snapshot" columns={5}>
        <MetricTile
          title="Total Cash Position"
          value={totalCashPosition}
          format="currency"
          decimals={0}
          size="lg"
        />
        <MetricTile
          title="Peak Intraday Liquidity"
          value={peakLiquidityUsage}
          format="currency"
          decimals={0}
          threshold={{ red: 14000, amber: 12000, green: 10000 }}
          inverse={true}
        />
        <MetricTile
          title="Peak Utilization"
          value={peakUtilization}
          format="percentage"
          decimals={0}
          threshold={{ red: 90, amber: 80, green: 70 }}
          inverse={true}
        />
        <MetricTile
          title="Net Collateral Excess"
          value={netExcess}
          format="currency"
          decimals={0}
          threshold={{ red: -100, amber: 0, green: 100 }}
        />
        <MetricTile
          title="Margin Calls"
          value={marginCallCount}
          threshold={{ red: 3, amber: 2, green: 0 }}
          inverse={true}
        />
      </MetricGroup>

      {/* Cash Position by Currency */}
      <div className="metric-card">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-green-100">
            <DollarSign className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Daily Cash Position by Currency</h2>
            <p className="text-sm text-gray-600">Opening, inflows, outflows, and closing balances ($M)</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={cashPositionByCurrency}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="currency" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} label={{ value: 'Amount ($M)', angle: -90, position: 'insideLeft', style: { fontSize: 11 } }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="opening" name="Opening" fill="#94a3b8" />
                <Bar dataKey="closing" name="Closing" fill="#10b981" />
                <Bar dataKey="requiredMin" name="Required Min" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-3">
            {cashPositionByCurrency.map((item, idx) => {
              const exceedMin = item.closing > item.requiredMin
              const buffer = item.closing - item.requiredMin
              return (
                <div key={idx} className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-gray-900">{item.currency}</span>
                    <span className={`text-xs font-semibold px-2 py-1 rounded ${exceedMin ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {exceedMin ? 'OK' : 'Below Min'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <div className="text-gray-600">Closing</div>
                      <div className="font-semibold text-gray-900">{formatCurrency(item.closing, 0)}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Buffer</div>
                      <div className={`font-semibold ${buffer >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(buffer, 0)}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Intraday Liquidity Usage */}
      <div className="metric-card">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-blue-100">
            <Clock className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Intraday Liquidity Usage Pattern</h2>
            <p className="text-sm text-gray-600">Hourly liquidity utilization vs. $15B limit</p>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={intradayLiquidity}>
            <defs>
              <linearGradient id="colorUsed" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="hour" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} label={{ value: 'Amount ($M)', angle: -90, position: 'insideLeft', style: { fontSize: 11 } }} />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="used" stroke="#3b82f6" fillOpacity={1} fill="url(#colorUsed)" name="Liquidity Used" />
            <Line type="monotone" dataKey="limit" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" name="Limit" />
          </AreaChart>
        </ResponsiveContainer>

        <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-center gap-2 text-sm">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <span className="font-semibold text-amber-900">Peak at 13:00: {formatCurrency(peakLiquidityUsage, 0)} ({peakUtilization}% utilization)</span>
          </div>
        </div>
      </div>

      {/* Collateral Management */}
      <div className="metric-card">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-purple-100">
            <TrendingUp className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Collateral Management</h2>
            <p className="text-sm text-gray-600">Posted vs. required collateral by counterparty ($M)</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Counterparty</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Posted</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Required</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Excess/(Deficit)</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {collateralPositions.map((item, index) => (
                <tr key={index} className={`hover:bg-gray-50 ${item.excess < 0 ? 'bg-red-50' : ''}`}>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.counterparty}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{item.rating}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{item.type}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">{formatCurrency(item.posted, 0)}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">{formatCurrency(item.required, 0)}</td>
                  <td className={`px-4 py-3 text-sm font-semibold text-right ${item.excess >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(item.excess, 0)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {item.excess < 0 ? (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                        Margin Call
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        OK
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50">
              <tr>
                <td colSpan={3} className="px-4 py-3 text-sm font-bold text-gray-900">Total</td>
                <td className="px-4 py-3 text-sm font-bold text-gray-900 text-right">{formatCurrency(totalPosted, 0)}</td>
                <td className="px-4 py-3 text-sm font-bold text-gray-900 text-right">{formatCurrency(totalRequired, 0)}</td>
                <td className={`px-4 py-3 text-sm font-bold text-right ${netExcess >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(netExcess, 0)}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Fed Funds & FX Settlement */}
      <div className="grid grid-cols-2 gap-6">
        {/* Fed Funds Activity */}
        <div className="metric-card">
          <div className="flex items-center gap-3 mb-6">
            <h3 className="text-md font-semibold text-gray-900">Fed Funds Activity (Last 5 Days)</h3>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={fedFundsActivity}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} label={{ value: 'Amount ($M)', angle: -90, position: 'insideLeft', style: { fontSize: 11 } }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="borrowed" name="Borrowed" fill="#ef4444" />
              <Bar dataKey="lent" name="Lent" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="text-sm text-gray-600">Average Fed Funds Rate</div>
            <div className="text-2xl font-bold text-blue-600">{avgFedFundsRate}%</div>
          </div>
        </div>

        {/* FX Settlement Risk */}
        <div className="metric-card">
          <div className="flex items-center gap-3 mb-6">
            <h3 className="text-md font-semibold text-gray-900">FX Settlement Risk</h3>
          </div>
          <div className="space-y-3 mb-4">
            {fxSettlementRisk.map((item, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-gray-900">{item.pair}</span>
                  <span className={`text-xs font-semibold px-2 py-1 rounded ${
                    item.risk === 'Low' ? 'bg-green-100 text-green-700' :
                    item.risk === 'Medium' ? 'bg-amber-100 text-amber-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {item.risk}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <div className="text-gray-600">Outstanding</div>
                    <div className="font-semibold text-gray-900">{formatCurrency(item.outstanding, 0)}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Settling Today</div>
                    <div className="font-semibold text-blue-600">{formatCurrency(item.settling, 0)}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Aged &gt;2 Days</div>
                    <div className="font-semibold text-amber-600">{formatCurrency(item.aged, 0)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="pt-3 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-xs text-gray-600">Total Outstanding</div>
                <div className="text-lg font-bold text-blue-600">{formatCurrency(totalFXOutstanding, 0)}</div>
              </div>
              <div className="p-3 bg-amber-50 rounded-lg">
                <div className="text-xs text-gray-600">Total Aged</div>
                <div className="text-lg font-bold text-amber-600">{formatCurrency(totalFXAged, 0)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
