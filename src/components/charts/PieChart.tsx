import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface PieChartProps {
  data: Array<{
    name: string
    value: number
  }>
  height?: number
  colors?: string[]
  valueFormatter?: (value: number) => string
}

const DEFAULT_COLORS = [
  '#0ea5e9',
  '#06b6d4',
  '#14b8a6',
  '#10b981',
  '#84cc16',
  '#eab308',
  '#f59e0b',
  '#f97316',
]

export default function PieChart({
  data,
  height = 300,
  colors = DEFAULT_COLORS,
  valueFormatter,
}: PieChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsPieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '6px',
          }}
          formatter={valueFormatter}
        />
        <Legend />
      </RechartsPieChart>
    </ResponsiveContainer>
  )
}
