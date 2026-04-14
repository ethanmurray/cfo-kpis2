export default function BoardPresentationMinimal() {
  return (
    <div className="p-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Board Presentation</h1>
        <p className="text-gray-600 mt-2">Simplified test version</p>
      </div>

      <div className="metric-card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Status</h2>
        <p className="text-green-600 font-medium">✓ Board Presentation route is working</p>
      </div>

      <div className="metric-card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Test Content</h2>
        <p className="text-sm text-gray-600">
          This is a minimal version to verify routing. The full board presentation with charts and data will be loaded once we fix the data import issues.
        </p>
      </div>
    </div>
  )
}
