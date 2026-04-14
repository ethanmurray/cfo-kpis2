import { getMarketPositionData } from '../data/mockData'
import BarChart from '../components/charts/BarChart'
import DataTable from '../components/DataTable'

export default function MarketPosition() {
  const data = getMarketPositionData()

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Market Position & Benchmarking</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="metric-card">
          <div className="card-title">Global Market Share</div>
          <div className="metric-value">{data.marketShare.overall}%</div>
          <div className="text-sm text-gray-500 mt-2">Global custody market</div>
        </div>

        <div className="metric-card">
          <div className="card-title">Industry Ranking</div>
          <div className="metric-value">#{data.ranking}</div>
          <div className="text-sm text-gray-500 mt-2">By assets under custody</div>
        </div>

        <div className="metric-card">
          <div className="card-title">Americas Market Share</div>
          <div className="metric-value">
            {data.marketShare.byRegion.find(r => r.region === 'Americas')?.share}%
          </div>
          <div className="text-sm text-gray-500 mt-2">Regional position</div>
        </div>

        <div className="metric-card">
          <div className="card-title">Our Average Fee</div>
          <div className="metric-value">
            {(data.competitiveFees.find(c => c.competitor === 'Our Bank')?.averageFee || 0).toFixed(3)}%
          </div>
          <div className="text-sm text-gray-500 mt-2">Basis points on AUC</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="metric-card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Market Share by Region</h2>
          <BarChart
            data={data.marketShare.byRegion}
            bars={[{ dataKey: 'share', name: 'Market Share (%)', color: '#0ea5e9' }]}
            xAxisKey="region"
            height={300}
            valueFormatter={(value) => `${value}%`}
          />
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="text-sm text-gray-700">
              Strongest position in Americas (9.1%), opportunities for growth in APAC
            </div>
          </div>
        </div>

        <div className="metric-card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Competitive Fee Comparison</h2>
          <BarChart
            data={data.competitiveFees}
            bars={[{ dataKey: 'averageFee', name: 'Average Fee (%)', color: '#10b981' }]}
            xAxisKey="competitor"
            height={300}
            layout="horizontal"
            valueFormatter={(value) => `${(value * 100).toFixed(2)} bps`}
          />
          <div className="mt-4 p-3 bg-green-50 rounded-lg">
            <div className="text-sm text-gray-700">
              Our fees are competitive, positioned in mid-range for value proposition
            </div>
          </div>
        </div>
      </div>

      <div className="metric-card mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Competitive Landscape
        </h2>
        <DataTable
          columns={[
            { header: 'Competitor', accessor: 'competitor' },
            {
              header: 'Average Fee (bps)',
              accessor: 'averageFee',
              format: (v: number) => (v * 100).toFixed(2),
            },
            {
              header: 'Position vs Us',
              accessor: 'averageFee',
              format: (v: number) => {
                const ourFee = data.competitiveFees.find(c => c.competitor === 'Our Bank')?.averageFee || 0
                const diff = ((v - ourFee) / ourFee) * 100
                if (Math.abs(diff) < 1) return 'Similar'
                return diff > 0 ? `${diff.toFixed(1)}% higher` : `${Math.abs(diff).toFixed(1)}% lower`
              },
            },
          ]}
          data={data.competitiveFees}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="metric-card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Strategic Positioning</h2>
          <div className="space-y-3">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-sm font-medium text-gray-900 mb-2">Market Position</div>
              <div className="text-xs text-gray-600">
                Ranked #6 globally with 8.2% market share. Top-tier player with room for growth
                through strategic client acquisitions and geographic expansion.
              </div>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-sm font-medium text-gray-900 mb-2">Competitive Advantages</div>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Strong operational platform with 94.2% STP rate</li>
                <li>• Competitive pricing with value-added services</li>
                <li>• Global presence across Americas, EMEA, and APAC</li>
                <li>• Deep expertise in pension fund servicing</li>
              </ul>
            </div>

            <div className="p-4 bg-yellow-50 rounded-lg">
              <div className="text-sm font-medium text-gray-900 mb-2">Growth Opportunities</div>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Expand APAC market share (currently 7.5%)</li>
                <li>• Target high-growth alternative asset segment</li>
                <li>• Enhance digital capabilities for asset managers</li>
                <li>• Deepen securities lending penetration</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Market Trends & Outlook</h2>
          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium text-gray-700 mb-2">Industry Growth</div>
              <div className="text-xs text-gray-600 mb-3">
                Global custody market expected to grow 5-7% annually driven by institutional
                asset growth and regulatory requirements.
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500" style={{ width: '65%' }}></div>
              </div>
              <div className="text-xs text-gray-500 mt-1">Market maturity: 65%</div>
            </div>

            <div className="pt-3 border-t border-gray-200">
              <div className="text-sm font-medium text-gray-700 mb-2">Key Trends</div>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">→</span>
                  <span className="text-xs text-gray-600">
                    Digital transformation and automation driving efficiency
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">→</span>
                  <span className="text-xs text-gray-600">
                    Growth in alternative assets requiring specialized servicing
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">→</span>
                  <span className="text-xs text-gray-600">
                    Consolidation among mid-tier providers
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">→</span>
                  <span className="text-xs text-gray-600">
                    Increasing regulatory complexity requiring scale
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-200">
              <div className="text-sm font-medium text-gray-700 mb-2">Strategic Priorities</div>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="text-lg font-bold text-blue-600">1</div>
                  <div className="text-xs text-gray-600">Scale APAC</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="text-lg font-bold text-green-600">2</div>
                  <div className="text-xs text-gray-600">Digital Platform</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="text-lg font-bold text-purple-600">3</div>
                  <div className="text-xs text-gray-600">Alternatives</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="text-lg font-bold text-orange-600">4</div>
                  <div className="text-xs text-gray-600">Cost Efficiency</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
