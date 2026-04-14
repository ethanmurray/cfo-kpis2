import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ZAxis, Cell } from 'recharts'

interface ScatterDataPoint {
  x: number
  y: number
  z?: number
  name: string
  isOwn?: boolean
}

interface ScatterPlotProps {
  data: ScatterDataPoint[]
  xAxisLabel: string
  yAxisLabel: string
  height?: number
  xFormatter?: (value: number) => string
  yFormatter?: (value: number) => string
}

export default function ScatterPlot({
  data,
  xAxisLabel,
  yAxisLabel,
  height = 400,
  xFormatter = (v) => v.toFixed(1),
  yFormatter = (v) => v.toFixed(1)
}: ScatterPlotProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ScatterChart margin={{ top: 20, right: 30, bottom: 60, left: 60 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          type="number"
          dataKey="x"
          name={xAxisLabel}
          tickFormatter={xFormatter}
          label={{
            value: xAxisLabel,
            position: 'bottom',
            offset: 40,
            style: { fontSize: 12, fill: '#6b7280' }
          }}
          tick={{ fontSize: 11 }}
        />
        <YAxis
          type="number"
          dataKey="y"
          name={yAxisLabel}
          tickFormatter={yFormatter}
          label={{
            value: yAxisLabel,
            angle: -90,
            position: 'left',
            offset: 40,
            style: { fontSize: 12, fill: '#6b7280' }
          }}
          tick={{ fontSize: 11 }}
        />
        <ZAxis type="number" dataKey="z" range={[100, 400]} />
        <Tooltip
          content={<CustomTooltip xFormatter={xFormatter} yFormatter={yFormatter} />}
          cursor={{ strokeDasharray: '3 3' }}
        />
        <Scatter data={data} fill="#0ea5e9">
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.isOwn ? '#f59e0b' : '#0ea5e9'}
              stroke={entry.isOwn ? '#d97706' : '#0284c7'}
              strokeWidth={entry.isOwn ? 3 : 1}
            />
          ))}
        </Scatter>
      </ScatterChart>
    </ResponsiveContainer>
  )
}

function CustomTooltip({
  active,
  payload,
  xFormatter,
  yFormatter
}: {
  active?: boolean
  payload?: any[]
  xFormatter: (value: number) => string
  yFormatter: (value: number) => string
}) {
  if (!active || !payload || !payload.length) return null

  const data = payload[0].payload

  return (
    <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
      <p className={`font-semibold mb-2 ${data.isOwn ? 'text-amber-600' : 'text-gray-900'}`}>
        {data.name}
      </p>
      <div className="space-y-1 text-sm">
        <p className="text-gray-600">
          {payload[0].name}: <span className="font-medium text-gray-900">{xFormatter(data.x)}</span>
        </p>
        <p className="text-gray-600">
          {payload[1].name}: <span className="font-medium text-gray-900">{yFormatter(data.y)}</span>
        </p>
        {data.z && (
          <p className="text-gray-600">
            Size: <span className="font-medium text-gray-900">${data.z.toFixed(0)}B</span>
          </p>
        )}
      </div>
    </div>
  )
}
