import { getExecutiveSummaryData } from '../data/mockData'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import MetricCard from '../components/MetricCard'
import AlertBanner from '../components/AlertBanner'

export default function ExecutiveOverview() {
  const data = getExecutiveSummaryData()

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Executive Overview</h1>

      <AlertBanner alerts={data.alerts} />

      {/* Top Row - Shareholder Value Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <MetricCard
          title="Adjusted EPS (TTM)"
          value={data.eps.current}
          format="currency"
          decimals={2}
          change={data.eps.surprise}
          changeLabel="vs Consensus"
          subtitle={`Consensus: $${data.eps.consensusEstimate.toFixed(2)}`}
        />

        <MetricCard
          title="Tangible Book Value / Share"
          value={data.tangibleBookValuePerShare}
          format="currency"
          decimals={2}
          subtitle="Key valuation metric"
        />

        <MetricCard
          title="Market Cap"
          value={data.marketCap}
          format="currency"
          decimals={1}
          subtitle={`Div Yield: ${data.dividendYield.toFixed(2)}%`}
        />

        <MetricCard
          title="Return on Equity"
          value={13.8}
          format="percentage"
          decimals={1}
          subtitle="Target: 15.0%"
        />
      </div>

      {/* Second Row - Business Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Assets Under Custody"
          value={data.auc.value}
          format="currency"
          decimals={1}
          change={data.auc.yoyGrowth}
          changeLabel="YoY"
        />

        <MetricCard
          title="Revenue (YTD)"
          value={data.revenue.ytd}
          format="currency"
          decimals={1}
          change={data.revenue.ytdVsBudget}
          changeLabel="vs Budget"
        />

        <MetricCard
          title="Cost-to-Income Ratio"
          value={data.costToIncome.value}
          format="percentage"
          decimals={1}
          change={-1.5}
          changeLabel="vs Prior Quarter"
          subtitle="Target: 65.0%"
        />

        <MetricCard
          title="Pre-Tax Profit Margin"
          value={data.preTaxMargin.value}
          format="percentage"
          decimals={1}
          change={data.preTaxMargin.periodOverPeriod}
          changeLabel="vs Prior Period"
        />

        <div className="metric-card col-span-1 md:col-span-2 lg:col-span-3">
          <div className="card-title">Key Performance Indicators</div>
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div>
              <div className="text-xs text-gray-500">Return on Equity</div>
              <div className="text-2xl font-bold text-gray-900 mt-1">13.8%</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Return on Assets</div>
              <div className="text-2xl font-bold text-gray-900 mt-1">1.02%</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Client Retention</div>
              <div className="text-2xl font-bold text-gray-900 mt-1">97.8%</div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
            <div>
              <div className="text-xs text-gray-500">Settlement Fail Rate</div>
              <div className="text-2xl font-bold text-gray-900 mt-1">0.08%</div>
              <div className="text-xs text-green-600 mt-1">Well below threshold</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">STP Rate</div>
              <div className="text-2xl font-bold text-gray-900 mt-1">95.8%</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Market Share</div>
              <div className="text-2xl font-bold text-gray-900 mt-1">5.8%</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 metric-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Strategic Targets Overview</h2>
          <Link
            to="/strategic"
            className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            View Details
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
            <div className="text-sm font-medium text-blue-900 mb-1">Overall Score</div>
            <div className="text-3xl font-bold text-blue-600">{data.strategicTargets.overallScore}</div>
            <div className="text-xs text-blue-700 mt-1">Performance Index</div>
          </div>
          <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
            <div className="text-sm font-medium text-green-900 mb-1">On Track</div>
            <div className="text-3xl font-bold text-green-600">{data.strategicTargets.onTrack}</div>
            <div className="text-xs text-green-700 mt-1">of {data.strategicTargets.total} targets</div>
          </div>
          <div className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200">
            <div className="text-sm font-medium text-yellow-900 mb-1">At Risk</div>
            <div className="text-3xl font-bold text-yellow-600">{data.strategicTargets.atRisk}</div>
            <div className="text-xs text-yellow-700 mt-1">Need attention</div>
          </div>
          <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
            <div className="text-sm font-medium text-purple-900 mb-1">Achievement Rate</div>
            <div className="text-3xl font-bold text-purple-600">
              {Math.round((data.strategicTargets.onTrack / data.strategicTargets.total) * 100)}%
            </div>
            <div className="text-xs text-purple-700 mt-1">Success Rate</div>
          </div>
        </div>
        <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-700">
            <span className="font-semibold">{data.strategicTargets.onTrack}</span> of{' '}
            <span className="font-semibold">{data.strategicTargets.total}</span> strategic targets are on track.
            Key priorities: Efficiency Ratio (→65%), ROE (→15%), and Digital Adoption (→85%).
            <Link to="/strategic" className="text-blue-600 hover:text-blue-700 ml-1">
              View detailed progress, initiatives, and risks →
            </Link>
          </p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="metric-card">
          <div className="card-title">Regional Performance</div>
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Americas</span>
              <div className="flex items-center gap-2">
                <div className="h-2 w-32 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: '55%' }}></div>
                </div>
                <span className="text-sm font-medium text-gray-900 w-12">55%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">EMEA</span>
              <div className="flex items-center gap-2">
                <div className="h-2 w-32 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-500" style={{ width: '30%' }}></div>
                </div>
                <span className="text-sm font-medium text-gray-900 w-12">30%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">APAC</span>
              <div className="flex items-center gap-2">
                <div className="h-2 w-32 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-teal-500" style={{ width: '15%' }}></div>
                </div>
                <span className="text-sm font-medium text-gray-900 w-12">15%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="card-title">Asset Class Breakdown</div>
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Equities</span>
              <div className="flex items-center gap-2">
                <div className="h-2 w-32 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500" style={{ width: '48%' }}></div>
                </div>
                <span className="text-sm font-medium text-gray-900 w-12">48%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Fixed Income</span>
              <div className="flex items-center gap-2">
                <div className="h-2 w-32 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-lime-500" style={{ width: '32%' }}></div>
                </div>
                <span className="text-sm font-medium text-gray-900 w-12">32%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Alternatives</span>
              <div className="flex items-center gap-2">
                <div className="h-2 w-32 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-500" style={{ width: '12%' }}></div>
                </div>
                <span className="text-sm font-medium text-gray-900 w-12">12%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Cash & Other</span>
              <div className="flex items-center gap-2">
                <div className="h-2 w-32 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500" style={{ width: '8%' }}></div>
                </div>
                <span className="text-sm font-medium text-gray-900 w-12">8%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
