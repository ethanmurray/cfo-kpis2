import { getAUCData } from '../data/mockData'
import { formatCurrency } from '../utils/dataGenerators'
import MetricCard from '../components/MetricCard'
import LineChart from '../components/charts/LineChart'
import BarChart from '../components/charts/BarChart'
import DataTable from '../components/DataTable'

export default function AssetsUnderCustody() {
  const data = getAUCData()

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Assets Under Custody</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <MetricCard
          title="Total AUC"
          value={data.total}
          format="currency"
          decimals={2}
          change={data.change.yearly}
          changeLabel="YoY"
        />
        <MetricCard
          title="Monthly Change"
          value={data.change.monthly}
          format="percentage"
          decimals={2}
          subtitle="Month-over-month growth"
        />
        <MetricCard
          title="Daily Change"
          value={data.change.daily}
          format="percentage"
          decimals={2}
          subtitle="Day-over-day change"
        />
        <MetricCard
          title="YoY Growth"
          value={data.change.yearly}
          format="percentage"
          decimals={1}
          subtitle="Year-over-year growth"
        />
      </div>

      <div className="metric-card mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">AUC Trend (36 Months)</h2>
        <LineChart
          data={data.timeSeries}
          lines={[{ dataKey: 'value', name: 'AUC', color: '#14b8a6' }]}
          xAxisKey="date"
          height={300}
          valueFormatter={(value) => formatCurrency(value, 2)}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="metric-card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">AUC by Asset Class</h2>
          <BarChart
            data={data.byAssetClass}
            bars={[{ dataKey: 'value', name: 'AUC', color: '#0ea5e9' }]}
            xAxisKey="class"
            height={300}
            valueFormatter={(value) => formatCurrency(value, 1)}
          />
        </div>

        <div className="metric-card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">AUC by Region</h2>
          <BarChart
            data={data.byRegion}
            bars={[{ dataKey: 'value', name: 'AUC', color: '#06b6d4' }]}
            xAxisKey="region"
            height={300}
            valueFormatter={(value) => formatCurrency(value, 1)}
          />
        </div>
      </div>

      <div className="metric-card mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">AUC by Client Segment</h2>
        <BarChart
          data={data.byClientSegment}
          bars={[{ dataKey: 'value', name: 'AUC', color: '#10b981' }]}
          xAxisKey="segment"
          height={300}
          valueFormatter={(value) => formatCurrency(value, 1)}
        />
      </div>

      <div className="metric-card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Top 20 Clients by AUC</h2>
        <DataTable
          columns={[
            { header: '#', accessor: 'rank', format: (_value, _row, idx) => String((idx ?? 0) + 1) },
            { header: 'Client', accessor: 'clientName' },
            {
              header: 'AUC',
              accessor: 'auc',
              format: (v: number) => formatCurrency(v, 2),
            },
            {
              header: '% of Total',
              accessor: 'percentage',
              format: (v: number) => `${v.toFixed(2)}%`,
            },
          ]}
          data={data.topClients}
        />
      </div>
    </div>
  )
}
