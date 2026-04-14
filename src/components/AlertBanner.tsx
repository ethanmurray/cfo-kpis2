import { AlertCircle, Info, AlertTriangle } from 'lucide-react'

interface Alert {
  id: string
  type: 'info' | 'warning' | 'critical'
  message: string
  timestamp: string
}

interface AlertBannerProps {
  alerts: Alert[]
}

export default function AlertBanner({ alerts }: AlertBannerProps) {
  if (alerts.length === 0) return null

  return (
    <div className="space-y-2 mb-6">
      {alerts.map((alert) => {
        const isInfo = alert.type === 'info'
        const isWarning = alert.type === 'warning'
        const isCritical = alert.type === 'critical'

        const bgColor = isInfo
          ? 'bg-blue-50 border-blue-200'
          : isWarning
          ? 'bg-yellow-50 border-yellow-200'
          : 'bg-red-50 border-red-200'

        const textColor = isInfo
          ? 'text-blue-800'
          : isWarning
          ? 'text-yellow-800'
          : 'text-red-800'

        const Icon = isInfo ? Info : isWarning ? AlertTriangle : AlertCircle

        return (
          <div
            key={alert.id}
            className={`flex items-start gap-3 rounded-lg border p-4 ${bgColor}`}
          >
            <Icon className={`h-5 w-5 mt-0.5 ${textColor}`} />
            <div className="flex-1">
              <p className={`text-sm font-medium ${textColor}`}>{alert.message}</p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(alert.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
