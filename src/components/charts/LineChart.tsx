import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface LineChartProps {
  data: Array<Record<string, any>>
  lines: Array<{
    dataKey: string
    name: string
    color: string
  }>
  xAxisKey: string
  height?: number
  valueFormatter?: (value: number) => string
}

export default function LineChart({
  data,
  lines,
  xAxisKey,
  height = 300,
  valueFormatter,
}: LineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
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
        <Tooltip
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '6px',
          }}
          formatter={valueFormatter}
        />
        <Legend />
        {lines.map((line) => (
          <Line
            key={line.dataKey}
            type="monotone"
            dataKey={line.dataKey}
            name={line.name}
            stroke={line.color}
            strokeWidth={2}
            dot={false}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  )
}
