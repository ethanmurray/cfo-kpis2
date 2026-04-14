import { useClientStore } from '../stores/clientStore'

export default function ExecutiveSummaryMinimal() {
  const config = useClientStore((s) => s.config)

  return (
    <div className="p-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Executive Summary</h1>
        <p className="text-gray-600 mt-2">{config.shortName} CFO Dashboard</p>
      </div>

      <div className="metric-card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Dashboard Status</h2>
        <p className="text-green-600 font-medium">✓ Application is running successfully</p>
        <p className="text-sm text-gray-600 mt-2">If you see this message, the routing and basic components are working.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="metric-card">
          <div className="text-sm text-gray-600 mb-1">Test Metric 1</div>
          <div className="text-2xl font-bold text-gray-900">100%</div>
        </div>
        <div className="metric-card">
          <div className="text-sm text-gray-600 mb-1">Test Metric 2</div>
          <div className="text-2xl font-bold text-blue-600">$123.4B</div>
        </div>
        <div className="metric-card">
          <div className="text-sm text-gray-600 mb-1">Test Metric 3</div>
          <div className="text-2xl font-bold text-green-600">12.5%</div>
        </div>
      </div>

      <div className="metric-card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Next Steps</h2>
        <p className="text-sm text-gray-600">
          The full Executive Summary with live data will be loaded once we verify all data generators are working.
        </p>
      </div>
    </div>
  )
}
