interface Column {
  header: string
  accessor: string
  format?: (value: any, row?: any, index?: number) => string
}

interface DataTableProps {
  columns: Column[]
  data: Array<Record<string, any>>
}

export default function DataTable({ columns, data }: DataTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.accessor}
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-50">
              {columns.map((column) => {
                const value = row[column.accessor]
                const formattedValue = column.format ? column.format(value, row, rowIndex) : value
                return (
                  <td
                    key={column.accessor}
                    className="whitespace-nowrap px-6 py-4 text-sm text-gray-900"
                  >
                    {formattedValue}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
