import { ReactNode } from 'react'

interface MetricGroupProps {
  title: string
  description?: string
  children: ReactNode
  columns?: 2 | 3 | 4
  action?: ReactNode
}

export default function MetricGroup({
  title,
  description,
  children,
  columns = 3,
  action
}: MetricGroupProps) {
  const gridClasses = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          {description && (
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>

      <div className={`grid ${gridClasses[columns]} gap-4`}>
        {children}
      </div>
    </div>
  )
}
