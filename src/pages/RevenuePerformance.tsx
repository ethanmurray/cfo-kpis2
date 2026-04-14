import { getRevenueData } from '../data/mockData'
import { formatCurrency } from '../utils/dataGenerators'
import LineChart from '../components/charts/LineChart'
import PieChart from '../components/charts/PieChart'
import DataTable from '../components/DataTable'

export default function RevenuePerformance() {
  const data = getRevenueData()

  const pieData = data.byCategory.map((cat) => ({
    name: cat.category,
    value: cat.actual,
  }))

  const tableColumns = [
    { header: 'Category', accessor: 'category' },
    { header: 'Actual', accessor: 'actual', format: (v: number) => formatCurrency(v, 1) },
    { header: 'Budget', accessor: 'budget', format: (v: number) => formatCurrency(v, 1) },
    { header: 'Prior Year', accessor: 'priorYear', format: (v: number) => formatCurrency(v, 1) },
    {
      header: 'vs Budget',
      accessor: 'budget',
      format: (v: number, row: any) => {
        const variance = ((row.actual - v) / v) * 100
        return `${variance > 0 ? '+' : ''}${variance.toFixed(1)}%`
      },
    },
  ]

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Revenue Performance</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="metric-card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend (36 Months)</h2>
          <LineChart
            data={data.timeSeries}
            lines={[{ dataKey: 'value', name: 'Revenue', color: '#0ea5e9' }]}
            xAxisKey="date"
            height={300}
            valueFormatter={(value) => formatCurrency(value, 1)}
          />
        </div>

        <div className="metric-card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Category</h2>
          <PieChart
            data={pieData}
            height={300}
            valueFormatter={(value) => formatCurrency(value, 1)}
          />
        </div>
      </div>

      <div className="metric-card mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Revenue Performance by Category
        </h2>
        <DataTable columns={tableColumns} data={data.byCategory} />
      </div>

      <div className="metric-card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Top 10 Clients by Revenue</h2>
        <DataTable
          columns={[
            { header: 'Client', accessor: 'clientName' },
            {
              header: 'Revenue',
              accessor: 'revenue',
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
