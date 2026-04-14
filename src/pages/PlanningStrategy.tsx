import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/Tabs'
import DriverTreesView from '../components/forward/DriverTreesView'
import DriverTreesEnhanced from '../components/forward/DriverTreesEnhanced'
import ForecastsView from '../components/forward/ForecastsView'
import ScenariosView from '../components/forward/ScenariosView'
import StressTestView from '../components/forward/StressTestView'
import SensitivitiesView from '../components/forward/SensitivitiesView'
import CompactMetricCard from '../components/CompactMetricCard'
import StrategicInitiativesTracker from '../components/planning/StrategicInitiativesTracker'
import InteractiveScenarioBuilder from '../components/planning/InteractiveScenarioBuilder'
import { Target, TrendingUp, AlertCircle, CheckCircle2, Clock } from 'lucide-react'

export default function PlanningStrategy() {
  const strategicTargets = [
    { target: 'RAROC', current: 9.8, target2025: 12.5, status: 78, initiative: 'Client growth + pricing optimization' },
    { target: 'Client Count', current: 285, target2025: 308, status: 93, initiative: 'New business pipeline: 23 prospects' },
    { target: 'Cost/Income', current: 62.5, target2025: 58.5, status: 88, initiative: 'Efficiency initiatives: $638M savings' },
    { target: 'AUM ($T)', current: 6.1, target2025: 6.5, status: 94, initiative: 'Organic growth + market recovery' },
    { target: 'Wallet Share (%)', current: 30, target2025: 45, status: 67, initiative: 'Cross-sell program: $588M opportunity' },
    { target: 'STP Rate (%)', current: 87.5, target2025: 95.0, status: 92, initiative: 'Automation investment: $25M' },
  ]

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-nt-forest">Planning & Strategy</h1>
          <p className="text-xs mt-1 text-gray-600">
            Strategic initiatives, interactive scenario modeling, driver trees, and forecasts
          </p>
        </div>
        <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg shadow-md" style={{
          background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.12) 0%, rgba(212, 175, 55, 0.04) 100%)',
          border: '1px solid rgba(212, 175, 55, 0.25)'
        }}>
          <Target className="h-5 w-5 text-nt-gold" />
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wide text-gray-600">2025 Target</div>
            <div className="flex items-baseline gap-1.5">
              <div className="text-lg font-bold text-nt-gold">12.5% RAROC</div>
              <div className="text-[10px] font-semibold text-green-600">+0.2%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="executive-summary">
        <div className="flex items-center gap-2.5 mb-3.5">
          <div className="p-1.5 rounded-lg bg-nt-gold bg-opacity-20">
            <TrendingUp className="h-5 w-5 text-nt-gold" />
          </div>
          <h2 className="text-base font-bold text-nt-forest">Executive Summary</h2>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="summary-card">
            <div className="flex items-center gap-1.5 mb-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span className="font-semibold text-xs text-nt-forest">On Track</span>
            </div>
            <ul className="space-y-0.5 text-xs text-gray-600 leading-tight">
              <li>• 5 of 6 strategic initiatives progressing well</li>
              <li>• $946M realized returns YTD vs $1.65B target</li>
              <li>• Client acquisition 78% complete (23 new clients)</li>
              <li>• Capital optimization ahead of schedule (85%)</li>
            </ul>
          </div>

          <div className="summary-card">
            <div className="flex items-center gap-1.5 mb-2">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <span className="font-semibold text-xs text-nt-forest">Action Required</span>
            </div>
            <ul className="space-y-0.5 text-xs text-gray-600 leading-tight">
              <li>• Cross-sell program at risk (42% vs 65% target)</li>
              <li>• Training completion overdue by 1 week</li>
              <li>• $588M opportunity at stake (largest initiative)</li>
              <li>• Recommend executive steering committee meeting</li>
            </ul>
          </div>

          <div className="summary-card">
            <div className="flex items-center gap-1.5 mb-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="font-semibold text-xs text-nt-forest">Path to Target</span>
            </div>
            <ul className="space-y-0.5 text-xs text-gray-600 leading-tight">
              <li>• Current RAROC: 9.8% vs target 12.5%</li>
              <li>• Gap: +2.7pp to close by end of 2025</li>
              <li>• Scenario modeling shows path with +8% clients,</li>
              <li>  +12% AUM, +0.5bps fees, -8% costs achieves target</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Strategic Targets Summary */}
      <div className="rounded-2xl p-6 shadow-lg" style={{
        background: 'linear-gradient(135deg, #ffffff 0%, rgba(248, 249, 250, 0.5) 100%)',
        border: '1px solid rgba(0, 77, 53, 0.08)'
      }}>
        <h2 className="font-bold text-sm tracking-wide uppercase mb-4" style={{ color: '#006747', letterSpacing: '0.05em' }}>
          2025 Strategic Targets Progress
        </h2>
        <div className="grid grid-cols-6 gap-3 mb-4">
          <CompactMetricCard label="RAROC Target" value="9.8" unit="%" status="warning" target="12.5" change={1.6} />
          <CompactMetricCard label="Client Target" value="285" status="good" target="308" change={5.2} />
          <CompactMetricCard label="C/I Target" value="62.5" unit="%" status="good" target="58.5" change={-3.2} />
          <CompactMetricCard label="AUM Target" value="$6.1" unit="T" status="good" target="$6.5" change={6.8} />
          <CompactMetricCard label="Wallet Share" value="30" unit="%" status="warning" target="45" change={2.5} />
          <CompactMetricCard label="STP Target" value="87.5" unit="%" status="good" target="95.0" change={2.3} />
        </div>
        <table className="min-w-full text-xs">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left font-medium text-gray-600">Target</th>
              <th className="px-3 py-2 text-right font-medium text-gray-600">Current</th>
              <th className="px-3 py-2 text-right font-medium text-gray-600">2025 Target</th>
              <th className="px-3 py-2 text-right font-medium text-gray-600">Progress</th>
              <th className="px-3 py-2 text-left font-medium text-gray-600">Key Initiative</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {strategicTargets.map((item, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="px-3 py-2 font-medium text-gray-900">{item.target}</td>
                <td className="px-3 py-2 text-right text-gray-900">{item.current}</td>
                <td className="px-3 py-2 text-right font-semibold text-gray-900">{item.target2025}</td>
                <td className="px-3 py-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full ${item.status >= 90 ? 'bg-green-600' : item.status >= 75 ? 'bg-blue-600' : 'bg-amber-600'}`}
                        style={{ width: `${item.status}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold w-10 text-right">{item.status}%</span>
                  </div>
                </td>
                <td className="px-3 py-2 text-gray-700">{item.initiative}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Tabs defaultValue="initiatives">
        <TabsList>
          <TabsTrigger value="initiatives">Strategic Initiatives</TabsTrigger>
          <TabsTrigger value="scenario-builder">Scenario Builder</TabsTrigger>
          <TabsTrigger value="drivertrees">Driver Trees</TabsTrigger>
          <TabsTrigger value="scenarios">Scenarios & Forecasts</TabsTrigger>
          <TabsTrigger value="stress">Stress Tests</TabsTrigger>
        </TabsList>

        <TabsContent value="initiatives">
          <StrategicInitiativesTracker />
        </TabsContent>

        <TabsContent value="scenario-builder">
          <InteractiveScenarioBuilder />
        </TabsContent>

        <TabsContent value="drivertrees">
          <DriverTreesEnhanced />
        </TabsContent>

        <TabsContent value="scenarios">
          <div className="space-y-4">
            <ScenariosView />
            <div className="mt-6">
              <ForecastsView />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="stress">
          <StressTestView />
        </TabsContent>
      </Tabs>
    </div>
  )
}
