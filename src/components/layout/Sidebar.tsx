import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Target as TargetIcon,
  DollarSign,
  Zap,
  ChevronLeft,
  ChevronRight,
  Package,
  TrendingUp,
  Shield,
  Building2,
  Activity,
  BarChart2,
  UserCog,
} from 'lucide-react'
import NorthernTrustLogo from '../NorthernTrustLogo'

const navigation = [
  { name: 'Executive Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Group Financials', path: '/financials', icon: DollarSign },
  { name: 'Business Economics', path: '/business-economics', icon: Building2 },
  { name: 'Client Economics', path: '/clients', icon: Users },
  { name: 'Product Economics', path: '/products', icon: Package },
  { name: 'Finance Operations', path: '/operations', icon: Zap },
  { name: 'Workforce Analytics', path: '/workforce-analytics', icon: UserCog },
  { name: 'ALM & Treasury', path: '/alm', icon: Activity },
  { name: 'Planning & Strategy', path: '/planning', icon: TargetIcon },
  { name: 'Forecast Performance', path: '/forecast-performance', icon: BarChart2 },
  { name: 'External Positioning', path: '/external-positioning', icon: TrendingUp },
  { name: 'Risk & Compliance', path: '/risk-compliance', icon: Shield },
]

interface SidebarProps {
  isCollapsed: boolean
  setIsCollapsed: (value: boolean) => void
}

export default function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  const location = useLocation()

  return (
    <div
      className={`flex h-screen flex-col transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-20' : 'w-72'
      }`}
      style={{
        background: 'linear-gradient(180deg, #004d35 0%, #003829 100%)',
        borderRight: '1px solid rgba(212, 175, 55, 0.1)'
      }}
    >
      {/* Header with Logo */}
      <div className="flex h-20 items-center px-5 border-b" style={{ borderColor: 'rgba(212, 175, 55, 0.15)' }}>
        {!isCollapsed ? (
          <div className="flex-1">
            <NorthernTrustLogo variant="full" className="h-12" />
            <div className="mt-1 text-xs font-medium tracking-wide" style={{ color: '#D4AF37' }}>
              CFO ANALYTICS
            </div>
          </div>
        ) : (
          <div className="flex-1 flex justify-center">
            <NorthernTrustLogo variant="icon" className="h-12 w-12" />
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="rounded-lg p-2 transition-all duration-200 hover:scale-110"
          style={{ color: '#D4AF37' }}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = location.pathname === item.path
          const Icon = item.icon
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isCollapsed ? 'justify-center' : ''
              }`}
              style={{
                backgroundColor: isActive ? 'rgba(212, 175, 55, 0.15)' : 'transparent',
                color: isActive ? '#D4AF37' : 'rgba(255, 255, 255, 0.7)',
                boxShadow: isActive ? '0 2px 8px rgba(212, 175, 55, 0.2)' : 'none',
                transform: isActive ? 'translateX(4px)' : 'translateX(0)'
              }}
              title={isCollapsed ? item.name : undefined}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.08)'
                  e.currentTarget.style.color = '#D4AF37'
                  e.currentTarget.style.transform = 'translateX(4px)'
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)'
                  e.currentTarget.style.transform = 'translateX(0)'
                }
              }}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && (
                <span className="tracking-wide">{item.name}</span>
              )}
              {!isCollapsed && isActive && (
                <div className="ml-auto w-1 h-1 rounded-full" style={{ backgroundColor: '#D4AF37' }} />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="px-5 py-4 border-t" style={{ borderColor: 'rgba(212, 175, 55, 0.15)' }}>
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg" style={{ backgroundColor: 'rgba(212, 175, 55, 0.05)' }}>
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#10b981' }} />
            <div>
              <div className="text-xs font-medium" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                Live Data
              </div>
              <div className="text-xs" style={{ color: 'rgba(212, 175, 55, 0.7)' }}>
                Updated {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
