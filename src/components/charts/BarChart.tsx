import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface BarChartProps {
  data: Array<Record<string, any>>
  bars: Array<{
    dataKey: string
    name: string
    color: string
  }>
  xAxisKey: string
  height?: number
  layout?: 'horizontal' | 'vertical'
  valueFormatter?: (value: number) => string
}

export default function BarChart({
  data,
  bars,
  xAxisKey,
  height = 300,
  layout = 'horizontal',
  valueFormatter,
}: BarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart
        data={data}
        layout={layout}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        {layout === 'horizontal' ? (
          <>
            <XAxis
              dataKey={xAxisKey}
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
            />
            <YAxis
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
              tickFormatter={valueFormatter}
            />
          </>
        ) : (
          <>
            <XAxis
              type="number"
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
              tickFormatter={valueFormatter}
            />
            <YAxis
              type="category"
              dataKey={xAxisKey}
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
              width={150}
            />
          </>
        )}
        <Tooltip
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '6px',
          }}
          formatter={valueFormatter}
        />
        <Legend />
        {bars.map((bar) => (
          <Bar
            key={bar.dataKey}
            dataKey={bar.dataKey}
            name={bar.name}
            fill={bar.color}
          />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  )
}
