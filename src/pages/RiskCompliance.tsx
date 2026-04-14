import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/Tabs'
import CompactMetricCard from '../components/CompactMetricCard'
import MetricDetailModal from '../components/MetricDetailModal'
import { Shield, AlertTriangle, CheckCircle2, TrendingDown, Activity, TrendingUp, Clock, AlertCircle } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'

export default function RiskCompliance() {
  const [selectedMetric, setSelectedMetric] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleMetricClick = (metricData: any) => {
    setSelectedMetric(metricData)
    setIsModalOpen(true)
  }
  // Risk Metrics Data
  const riskByCategory = [
    { category: 'Credit Risk', metric: 'Expected Loss', value: 312, limit: 450, utilization: 69, trend: -2.1, unit: '$M' },
    { category: 'Market Risk', metric: 'VaR (99%, 1d)', value: 185, limit: 250, utilization: 74, trend: 1.8, unit: '$M' },
    { category: 'Operational Risk', metric: 'Op Risk Capital', value: 168, limit: 200, utilization: 84, trend: -0.5, unit: '$M' },
    { category: 'Liquidity Risk', metric: 'CFaR (30d)', value: 117, limit: 150, utilization: 78, trend: -3.2, unit: '$M' },
  ]

  const totalRiskCapital = riskByCategory.reduce((sum, item) => sum + item.value, 0)
  const totalLimit = riskByCategory.reduce((sum, item) => sum + item.limit, 0)
  const overallUtilization = (totalRiskCapital / totalLimit) * 100

  const riskMetricsTrend = [
    { month: 'Oct', credit: 325, market: 192, operational: 175, liquidity: 125 },
    { month: 'Nov', credit: 318, market: 188, operational: 171, liquidity: 122 },
    { month: 'Dec', credit: 315, market: 182, operational: 169, liquidity: 119 },
    { month: 'Jan', credit: 312, market: 185, operational: 168, liquidity: 117 },
  ]

  // Risk Appetite Framework
  const riskAppetiteMetrics = [
    { metric: 'Credit RWA ($B)', current: 42.5, limit: 48.0, utilization: 89, status: 'good' },
    { metric: 'Credit Expected Loss ($M)', current: 312, limit: 450, utilization: 69, status: 'good' },
    { metric: 'Market VaR ($M)', current: 185, limit: 250, utilization: 74, status: 'good' },
    { metric: 'Operational Risk Capital ($M)', current: 168, limit: 200, utilization: 84, status: 'good' },
    { metric: 'Liquidity Coverage Ratio (%)', current: 142, limit: 110, utilization: 100, status: 'excellent' },
    { metric: 'Net Stable Funding Ratio (%)', current: 128, limit: 105, utilization: 100, status: 'excellent' },
    { metric: 'NPL Ratio (%)', current: 0.8, limit: 2.5, utilization: 32, status: 'excellent' },
    { metric: 'Leverage Ratio (%)', current: 6.8, limit: 5.0, utilization: 100, status: 'excellent' },
  ]

  // Compliance Monitoring
  const complianceByCategory = [
    { category: 'AML/KYC', alerts: 248, investigations: 12, breaches: 0, status: 'good' },
    { category: 'Market Conduct', alerts: 87, investigations: 5, breaches: 0, status: 'good' },
    { category: 'Data Privacy', alerts: 156, investigations: 8, breaches: 1, status: 'warning' },
    { category: 'Sanctions Screening', alerts: 312, investigations: 18, breaches: 0, status: 'good' },
    { category: 'Securities Regulations', alerts: 94, investigations: 3, breaches: 0, status: 'good' },
  ]

  const complianceTrends = [
    { month: 'Oct', alerts: 932, investigations: 52, breaches: 1 },
    { month: 'Nov', alerts: 885, investigations: 48, breaches: 0 },
    { month: 'Dec', alerts: 897, investigations: 46, breaches: 2 },
    { month: 'Jan', alerts: 897, investigations: 46, breaches: 1 },
  ]

  // Regulatory Oversight
  const examStatus = [
    { regulator: 'Federal Reserve', status: 'In Progress', focus: 'Stress Testing & Capital Planning', dueDate: '2026-05-15', completion: 65 },
    { regulator: 'OCC', status: 'Completed', focus: 'Bank Secrecy Act / AML', dueDate: '2026-03-01', completion: 100 },
    { regulator: 'SEC', status: 'Scheduled', focus: 'Investment Advisory Compliance', dueDate: '2026-06-30', completion: 0 },
    { regulator: 'FINRA', status: 'In Progress', focus: 'Trading & Market Conduct', dueDate: '2026-04-20', completion: 42 },
  ]

  const upcomingRegChanges = [
    { regulation: 'Basel III Endgame', effectiveDate: '2027-07-01', impact: 'High', readiness: 68, description: 'Capital requirements revision' },
    { regulation: 'CECL Methodology Update', effectiveDate: '2026-12-31', impact: 'Medium', readiness: 85, description: 'Credit loss estimation changes' },
    { regulation: 'Enhanced Cyber Risk Rules', effectiveDate: '2026-09-01', impact: 'Medium', readiness: 92, description: 'Incident reporting requirements' },
    { regulation: 'Climate Risk Disclosure', effectiveDate: '2027-01-01', impact: 'High', readiness: 55, description: 'ESG and climate risk reporting' },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return '#10b981'
      case 'good': return '#3b82f6'
      case 'warning': return '#f59e0b'
      case 'critical': return '#ef4444'
      default: return '#6b7280'
    }
  }

  const getComplianceStatusColor = (status: string) => {
    switch (status) {
      case 'good': return { bg: '#10b981', light: 'rgba(16, 185, 129, 0.1)' }
      case 'warning': return { bg: '#f59e0b', light: 'rgba(245, 158, 11, 0.1)' }
      case 'critical': return { bg: '#ef4444', light: 'rgba(239, 68, 68, 0.1)' }
      default: return { bg: '#6b7280', light: 'rgba(107, 114, 128, 0.1)' }
    }
  }

  // Finance Controls Data
  const soxTestingStatus = {
    q1: { total: 485, tested: 485, passed: 472, failed: 13, deficiencies: 2, certReady: true },
    q2: { total: 485, tested: 485, passed: 478, failed: 7, deficiencies: 1, certReady: true },
    q3: { total: 492, tested: 485, passed: 468, failed: 17, deficiencies: 3, certReady: false },
    q4: { total: 492, tested: 125, passed: 118, failed: 7, deficiencies: 1, certReady: false },
  }

  const controlsByProcess = [
    { process: 'Record to Report (R2R)', totalControls: 142, keyControls: 38, tested: 142, passed: 135, passRate: 95.1, deficiencies: 1 },
    { process: 'Order to Cash (O2C)', totalControls: 98, keyControls: 24, tested: 98, passed: 96, passRate: 98.0, deficiencies: 0 },
    { process: 'Procure to Pay (P2P)', totalControls: 85, keyControls: 18, tested: 85, passed: 82, passRate: 96.5, deficiencies: 0 },
    { process: 'Treasury & Cash Mgmt', totalControls: 67, keyControls: 22, tested: 67, passed: 63, passRate: 94.0, deficiencies: 2 },
    { process: 'Financial Planning', totalControls: 52, keyControls: 12, tested: 52, passed: 51, passRate: 98.1, deficiencies: 0 },
    { process: 'Tax', totalControls: 48, keyControls: 15, tested: 48, passed: 46, passRate: 95.8, deficiencies: 0 },
  ]

  const controlKRIs = [
    { kri: 'Late Reconciliations (>30 days)', current: 8, target: 0, threshold: 15, status: 'warning', trend: -2 },
    { kri: 'Manual Journal Entries', current: 142, target: 95, threshold: 200, status: 'warning', trend: -12 },
    { kri: 'Unapproved Manual JEs', current: 3, target: 0, threshold: 5, status: 'warning', trend: -1 },
    { kri: 'Failed Automated Controls', current: 5, target: 0, threshold: 10, status: 'good', trend: 0 },
    { kri: 'SOD Conflicts (Open)', current: 12, target: 0, threshold: 25, status: 'good', trend: -3 },
    { kri: 'Access Violations', current: 2, target: 0, threshold: 5, status: 'good', trend: 0 },
    { kri: 'Days to Close (D+X)', current: 3, target: 2, threshold: 5, status: 'good', trend: 0 },
    { kri: 'Restatements (YTD)', current: 0, target: 0, threshold: 1, status: 'good', trend: 0 },
  ]

  const openDeficiencies = [
    {
      id: 'MW-2025-01',
      severity: 'Material Weakness',
      process: 'Treasury',
      issue: 'Inadequate review of interest rate hedge accounting',
      identified: '2024-12-15',
      owner: 'Treasury Controller',
      dueDate: '2025-03-31',
      status: 'In Progress',
      daysOpen: 47
    },
    {
      id: 'SD-2025-02',
      severity: 'Significant Deficiency',
      process: 'R2R',
      issue: 'Insufficient documentation for complex revenue transactions',
      identified: '2025-01-08',
      owner: 'Revenue Accounting',
      dueDate: '2025-04-30',
      status: 'In Progress',
      daysOpen: 23
    },
    {
      id: 'SD-2024-08',
      severity: 'Significant Deficiency',
      process: 'Treasury',
      issue: 'Manual processes for certain derivative valuations',
      identified: '2024-11-20',
      owner: 'Treasury Operations',
      dueDate: '2025-02-28',
      status: 'Remediation Plan Approved',
      daysOpen: 72
    },
    {
      id: 'CD-2025-03',
      severity: 'Control Deficiency',
      process: 'P2P',
      issue: 'Delayed approval of certain vendor invoices',
      identified: '2025-01-15',
      owner: 'AP Manager',
      dueDate: '2025-03-15',
      status: 'In Progress',
      daysOpen: 16
    },
  ]

  const itgcStatus = [
    { domain: 'Change Management', controls: 28, tested: 28, passed: 26, passRate: 92.9, issues: 2 },
    { domain: 'Access Controls', controls: 42, tested: 42, passed: 40, passRate: 95.2, issues: 2 },
    { domain: 'Computer Operations', controls: 18, tested: 18, passed: 18, passRate: 100.0, issues: 0 },
    { domain: 'Backup & Recovery', controls: 12, tested: 12, passed: 12, passRate: 100.0, issues: 0 },
  ]

  const certificationTimeline = [
    { milestone: 'Q4 2024 302/404 Certification', date: '2025-02-15', status: 'Completed', owner: 'CFO/CEO' },
    { milestone: 'Q1 2025 Testing Complete', date: '2025-04-15', status: 'In Progress', owner: 'Internal Audit' },
    { milestone: 'Q1 2025 302 Certification', date: '2025-05-10', status: 'Upcoming', owner: 'CFO/CEO' },
    { milestone: 'Q2 2025 Testing Start', date: '2025-05-01', status: 'Upcoming', owner: 'Internal Audit' },
  ]

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-nt-forest">Risk & Compliance</h1>
          <p className="text-xs mt-1 text-gray-600">
            Risk metrics, appetite framework, compliance monitoring, and regulatory oversight
          </p>
        </div>
        <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg shadow-md" style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(16, 185, 129, 0.04) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.25)'
        }}>
          <Shield className="h-5 w-5" style={{ color: '#10b981' }} />
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wide text-gray-600">Risk Status</div>
            <div className="flex items-baseline gap-1.5">
              <div className="text-lg font-bold" style={{ color: '#10b981' }}>Within Appetite</div>
              <div className="text-[10px] font-semibold text-green-600">-2.1%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="executive-summary">
        <div className="flex items-center gap-2.5 mb-3.5">
          <div className="p-1.5 rounded-lg bg-nt-gold bg-opacity-20">
            <TrendingUp className="h-5 w-5 text-nt-gold" />
          </div>
          <h2 className="text-base font-bold text-nt-forest">Executive Summary</h2>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="summary-card">
            <div className="flex items-center gap-1.5 mb-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span className="font-semibold text-xs text-nt-forest">Risk Profile</span>
            </div>
            <ul className="space-y-0.5 text-xs text-gray-600 leading-tight">
              <li>• All risk metrics within appetite limits</li>
              <li>• Market VaR: $185M (74% of $250M limit)</li>
              <li>• NPL ratio: 0.8% (well below 2.5% limit)</li>
              <li>• Zero compliance breaches in current period</li>
            </ul>
          </div>

          <div className="summary-card">
            <div className="flex items-center gap-1.5 mb-2">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <span className="font-semibold text-xs text-nt-forest">Areas of Focus</span>
            </div>
            <ul className="space-y-0.5 text-xs text-gray-600 leading-tight">
              <li>• Operational risk at 84% of limit (highest use)</li>
              <li>• 248 AML/KYC alerts under review (12 investigations)</li>
              <li>• Cybersecurity: 2 critical vulnerabilities open</li>
              <li>• Model risk governance enhancements needed</li>
            </ul>
          </div>

          <div className="summary-card">
            <div className="flex items-center gap-1.5 mb-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="font-semibold text-xs text-nt-forest">Regulatory Actions</span>
            </div>
            <ul className="space-y-0.5 text-xs text-gray-600 leading-tight">
              <li>• CCAR submission due March 31 (on track)</li>
              <li>• Basel III endgame implementation (2025)</li>
              <li>• Climate risk stress testing framework (Q3)</li>
              <li>• Enhanced AML controls deployment (Q2)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-6 gap-3">
        <CompactMetricCard
          label="Market VaR"
          value="$185"
          unit="M"
          status="good"
          change={1.8}
          description="Market Risk Value at Risk (99% confidence, 1-day horizon)"
          onClick={() => handleMetricClick({
            label: 'Market VaR',
            value: '$185',
            unit: 'M',
            change: 1.8,
            status: 'good',
            description: 'Market Risk Value at Risk (99% confidence, 1-day horizon) - potential loss from adverse market movements',
            historicalData: [
              { period: 'Oct', value: 192, comparison: 250 },
              { period: 'Nov', value: 188, comparison: 250 },
              { period: 'Dec', value: 182, comparison: 250 },
              { period: 'Jan', value: 185, comparison: 250 },
            ],
            breakdown: [
              { category: 'Interest Rate Risk', value: 78, percentage: 42.2 },
              { category: 'Equity Risk', value: 52, percentage: 28.1 },
              { category: 'FX Risk', value: 35, percentage: 18.9 },
              { category: 'Credit Spread Risk', value: 20, percentage: 10.8 },
            ]
          })}
        />
        <CompactMetricCard
          label="Credit RWA"
          value="$42.5"
          unit="B"
          status="good"
          change={-2.1}
          description="Credit Risk-Weighted Assets"
          onClick={() => handleMetricClick({
            label: 'Credit RWA',
            value: '$42.5',
            unit: 'B',
            change: -2.1,
            status: 'good',
            description: 'Credit Risk-Weighted Assets under Basel III framework',
            historicalData: [
              { period: 'Oct', value: 43.8, comparison: 48.0 },
              { period: 'Nov', value: 43.2, comparison: 48.0 },
              { period: 'Dec', value: 42.9, comparison: 48.0 },
              { period: 'Jan', value: 42.5, comparison: 48.0 },
            ],
            breakdown: [
              { category: 'Corporate Loans', value: 18.5, percentage: 43.5 },
              { category: 'Retail Mortgages', value: 12.3, percentage: 28.9 },
              { category: 'Interbank', value: 6.8, percentage: 16.0 },
              { category: 'Other', value: 4.9, percentage: 11.5 },
            ]
          })}
        />
        <CompactMetricCard
          label="NPL Ratio"
          value="0.8"
          unit="%"
          status="good"
          change={-0.1}
          description="Non-Performing Loan Ratio"
          onClick={() => handleMetricClick({
            label: 'NPL Ratio',
            value: '0.8',
            unit: '%',
            change: -0.1,
            status: 'good',
            description: 'Non-Performing Loan Ratio - loans 90+ days past due',
            historicalData: [
              { period: 'Oct', value: 0.9, comparison: 2.5 },
              { period: 'Nov', value: 0.85, comparison: 2.5 },
              { period: 'Dec', value: 0.82, comparison: 2.5 },
              { period: 'Jan', value: 0.8, comparison: 2.5 },
            ],
          })}
        />
        <CompactMetricCard
          label="LCR"
          value="142"
          unit="%"
          status="good"
          change={3.2}
          description="Liquidity Coverage Ratio"
          onClick={() => handleMetricClick({
            label: 'Liquidity Coverage Ratio',
            value: '142',
            unit: '%',
            change: 3.2,
            status: 'good',
            description: 'Ratio of high-quality liquid assets to net cash outflows over 30 days (minimum 100%)',
            historicalData: [
              { period: 'Oct', value: 135, comparison: 110 },
              { period: 'Nov', value: 138, comparison: 110 },
              { period: 'Dec', value: 140, comparison: 110 },
              { period: 'Jan', value: 142, comparison: 110 },
            ],
          })}
        />
        <CompactMetricCard
          label="Active Alerts"
          value="897"
          status="neutral"
          change={0}
          description="Total compliance alerts across all categories"
          onClick={() => handleMetricClick({
            label: 'Active Compliance Alerts',
            value: '897',
            change: 0,
            status: 'neutral',
            description: 'Total active compliance alerts requiring review across all monitoring categories',
            historicalData: [
              { period: 'Oct', value: 932 },
              { period: 'Nov', value: 885 },
              { period: 'Dec', value: 897 },
              { period: 'Jan', value: 897 },
            ],
            breakdown: [
              { category: 'Sanctions Screening', value: 312, percentage: 34.8 },
              { category: 'AML/KYC', value: 248, percentage: 27.6 },
              { category: 'Data Privacy', value: 156, percentage: 17.4 },
              { category: 'Securities Regulations', value: 94, percentage: 10.5 },
              { category: 'Market Conduct', value: 87, percentage: 9.7 },
            ]
          })}
        />
        <CompactMetricCard
          label="Open Investigations"
          value="46"
          status="good"
          change={-2}
          description="Compliance investigations in progress"
          onClick={() => handleMetricClick({
            label: 'Open Investigations',
            value: '46',
            change: -2,
            status: 'good',
            description: 'Active compliance investigations requiring deeper review',
            historicalData: [
              { period: 'Oct', value: 52 },
              { period: 'Nov', value: 48 },
              { period: 'Dec', value: 46 },
              { period: 'Jan', value: 46 },
            ],
            breakdown: [
              { category: 'Sanctions', value: 18, percentage: 39.1 },
              { category: 'AML/KYC', value: 12, percentage: 26.1 },
              { category: 'Data Privacy', value: 8, percentage: 17.4 },
              { category: 'Market Conduct', value: 5, percentage: 10.9 },
              { category: 'Securities', value: 3, percentage: 6.5 },
            ]
          })}
        />
      </div>

      <Tabs defaultValue="risk-metrics">
        <TabsList>
          <TabsTrigger value="risk-metrics">Risk Metrics</TabsTrigger>
          <TabsTrigger value="risk-appetite">Risk Appetite</TabsTrigger>
          <TabsTrigger value="compliance">Compliance Monitoring</TabsTrigger>
          <TabsTrigger value="regulatory">Regulatory Oversight</TabsTrigger>
          <TabsTrigger value="finance-controls">Finance Controls</TabsTrigger>
        </TabsList>

        {/* Risk Metrics Tab */}
        <TabsContent value="risk-metrics">
          <div className="space-y-6">
            {/* Risk Metrics by Category */}
            <div className="rounded-2xl p-6 shadow-lg" style={{
              background: 'linear-gradient(135deg, #ffffff 0%, rgba(248, 249, 250, 0.5) 100%)',
              border: '1px solid rgba(0, 77, 53, 0.08)'
            }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl" style={{ backgroundColor: 'rgba(212, 175, 55, 0.2)' }}>
                  <Activity className="h-6 w-6" style={{ color: 'var(--client-accent)' }} />
                </div>
                <div>
                  <h2 className="text-xl font-bold" style={{ color: 'var(--client-primary)' }}>Risk Metrics by Category</h2>
                  <p className="text-xs" style={{ color: '#6b7280' }}>Key risk measures across major risk types</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={riskByCategory}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="category" tick={{ fontSize: 11 }} angle={-15} textAnchor="end" height={80} />
                      <YAxis tick={{ fontSize: 11 }} label={{ value: 'Risk Capital ($M)', angle: -90, position: 'insideLeft', style: { fontSize: 11 } }} />
                      <Tooltip />
                      <Bar dataKey="value" name="Current" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                      <Bar dataKey="limit" name="Limit" fill="#d1d5db" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-3">
                  {riskByCategory.map((item, idx) => (
                    <div key={idx} className="p-4 rounded-xl" style={{
                      background: 'linear-gradient(135deg, rgba(0, 77, 53, 0.03) 0%, rgba(0, 77, 53, 0.01) 100%)',
                      border: '1px solid rgba(0, 77, 53, 0.1)'
                    }}>
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className="text-sm font-semibold" style={{ color: 'var(--client-primary)' }}>{item.category}</span>
                          <span className="text-xs block" style={{ color: '#6b7280' }}>{item.metric}</span>
                        </div>
                        <span className={`text-xs font-semibold ${item.trend < 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {item.trend > 0 ? '+' : ''}{item.trend}%
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl font-bold" style={{ color: '#1f2937' }}>${item.value}M</span>
                        <span className="text-xs" style={{ color: '#6b7280' }}>/ ${item.limit}M limit</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full"
                            style={{
                              width: `${item.utilization}%`,
                              backgroundColor: item.utilization >= 90 ? '#ef4444' : item.utilization >= 75 ? '#f59e0b' : '#3b82f6'
                            }}
                          />
                        </div>
                        <span className="text-xs font-semibold w-12 text-right">{item.utilization}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Historical Trends */}
            <div className="rounded-2xl p-6 shadow-lg" style={{
              background: 'linear-gradient(135deg, #ffffff 0%, rgba(248, 249, 250, 0.5) 100%)',
              border: '1px solid rgba(0, 77, 53, 0.08)'
            }}>
              <h3 className="font-bold text-sm tracking-wide uppercase mb-4" style={{ color: 'var(--client-primary)' }}>
                Risk Metrics Trend (Last 4 Months)
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={riskMetricsTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} label={{ value: 'Risk Capital ($M)', angle: -90, position: 'insideLeft', style: { fontSize: 11 } }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="credit" name="Credit EL" stroke="#3b82f6" strokeWidth={2} />
                  <Line type="monotone" dataKey="market" name="Market VaR" stroke="#f59e0b" strokeWidth={2} />
                  <Line type="monotone" dataKey="operational" name="Op Risk Capital" stroke="#8b5cf6" strokeWidth={2} />
                  <Line type="monotone" dataKey="liquidity" name="Liquidity CFaR" stroke="#10b981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </TabsContent>

        {/* Risk Appetite Tab */}
        <TabsContent value="risk-appetite">
          <div className="space-y-6">
            <div className="rounded-2xl p-6 shadow-lg" style={{
              background: 'linear-gradient(135deg, #ffffff 0%, rgba(248, 249, 250, 0.5) 100%)',
              border: '1px solid rgba(0, 77, 53, 0.08)'
            }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl" style={{ backgroundColor: 'rgba(212, 175, 55, 0.2)' }}>
                  <Shield className="h-6 w-6" style={{ color: 'var(--client-accent)' }} />
                </div>
                <h2 className="text-xl font-bold" style={{ color: 'var(--client-primary)' }}>Risk Appetite Framework</h2>
              </div>

              <div className="space-y-3">
                {riskAppetiteMetrics.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-white border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold" style={{ color: 'var(--client-primary)' }}>{item.metric}</span>
                        <div className="flex items-center gap-1">
                          {item.status === 'excellent' && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                          {item.status === 'good' && <CheckCircle2 className="h-4 w-4 text-blue-600" />}
                          {item.status === 'warning' && <AlertTriangle className="h-4 w-4 text-amber-600" />}
                          <span className={`text-xs font-medium ${
                            item.status === 'excellent' ? 'text-green-600' :
                            item.status === 'good' ? 'text-blue-600' : 'text-amber-600'
                          }`}>
                            {item.status === 'excellent' ? 'Excellent' : item.status === 'good' ? 'Within Appetite' : 'Monitor'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold" style={{ color: '#1f2937' }}>
                          {item.metric.includes('($B)') ? `$${item.current}B` :
                           item.metric.includes('($M)') ? `$${item.current}M` :
                           item.metric.includes('(%)') ? `${item.current}%` : item.current}
                        </span>
                        <span className="text-xs" style={{ color: '#6b7280' }}>
                          / {item.metric.includes('($B)') ? `$${item.limit}B` :
                             item.metric.includes('($M)') ? `$${item.limit}M` :
                             item.metric.includes('(%)') ? `${item.limit}%` : item.limit} {item.metric.includes('Ratio') || item.metric.includes('(%)') ? 'minimum' : 'limit'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width: `${Math.min(item.utilization, 100)}%`,
                            backgroundColor: getStatusColor(item.status)
                          }}
                        />
                      </div>
                      <span className="text-xs font-semibold w-12 text-right">{item.utilization}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Compliance Monitoring Tab */}
        <TabsContent value="compliance">
          <div className="space-y-6">
            {/* Compliance by Category */}
            <div className="rounded-2xl p-6 shadow-lg" style={{
              background: 'linear-gradient(135deg, #ffffff 0%, rgba(248, 249, 250, 0.5) 100%)',
              border: '1px solid rgba(0, 77, 53, 0.08)'
            }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl" style={{ backgroundColor: 'rgba(212, 175, 55, 0.2)' }}>
                  <CheckCircle2 className="h-6 w-6" style={{ color: 'var(--client-accent)' }} />
                </div>
                <h2 className="text-xl font-bold" style={{ color: 'var(--client-primary)' }}>Compliance Activity by Category</h2>
              </div>

              <div className="grid grid-cols-5 gap-3 mb-6">
                {complianceByCategory.map((item, idx) => {
                  const colors = getComplianceStatusColor(item.status)
                  return (
                    <div key={idx} className="p-4 rounded-xl" style={{
                      background: colors.light,
                      border: `2px solid ${colors.bg}20`
                    }}>
                      <div className="text-xs font-semibold mb-2" style={{ color: '#6b7280' }}>{item.category}</div>
                      <div className="space-y-2">
                        <div>
                          <div className="text-2xl font-bold" style={{ color: colors.bg }}>{item.alerts}</div>
                          <div className="text-xs" style={{ color: '#6b7280' }}>Alerts</div>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span style={{ color: '#6b7280' }}>Investigations:</span>
                          <span className="font-semibold" style={{ color: '#1f2937' }}>{item.investigations}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span style={{ color: '#6b7280' }}>Breaches:</span>
                          <span className={`font-semibold ${item.breaches > 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {item.breaches}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Compliance Trends */}
              <div className="mt-6">
                <h3 className="font-bold text-sm tracking-wide uppercase mb-4" style={{ color: 'var(--client-primary)' }}>
                  Compliance Trends (Last 4 Months)
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={complianceTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="alerts" name="Alerts" stroke="#3b82f6" strokeWidth={2} />
                    <Line type="monotone" dataKey="investigations" name="Investigations" stroke="#f59e0b" strokeWidth={2} />
                    <Line type="monotone" dataKey="breaches" name="Breaches" stroke="#ef4444" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Regulatory Oversight Tab */}
        <TabsContent value="regulatory">
          <div className="space-y-6">
            {/* Examination Status */}
            <div className="rounded-2xl p-6 shadow-lg" style={{
              background: 'linear-gradient(135deg, #ffffff 0%, rgba(248, 249, 250, 0.5) 100%)',
              border: '1px solid rgba(0, 77, 53, 0.08)'
            }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl" style={{ backgroundColor: 'rgba(212, 175, 55, 0.2)' }}>
                  <Activity className="h-6 w-6" style={{ color: 'var(--client-accent)' }} />
                </div>
                <h2 className="text-xl font-bold" style={{ color: 'var(--client-primary)' }}>Regulatory Examination Status</h2>
              </div>

              <div className="space-y-3">
                {examStatus.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-white border border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold" style={{ color: 'var(--client-primary)' }}>{item.regulator}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            item.status === 'Completed' ? 'bg-green-100 text-green-700' :
                            item.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {item.status}
                          </span>
                        </div>
                        <div className="text-xs mt-1" style={{ color: '#6b7280' }}>{item.focus}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs" style={{ color: '#6b7280' }}>Due Date</div>
                        <div className="text-sm font-semibold" style={{ color: '#1f2937' }}>{item.dueDate}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width: `${item.completion}%`,
                            backgroundColor: item.completion === 100 ? '#10b981' : item.completion >= 50 ? '#3b82f6' : '#f59e0b'
                          }}
                        />
                      </div>
                      <span className="text-xs font-semibold w-12 text-right">{item.completion}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Regulatory Changes */}
            <div className="rounded-2xl p-6 shadow-lg" style={{
              background: 'linear-gradient(135deg, #ffffff 0%, rgba(248, 249, 250, 0.5) 100%)',
              border: '1px solid rgba(0, 77, 53, 0.08)'
            }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl" style={{ backgroundColor: 'rgba(212, 175, 55, 0.2)' }}>
                  <TrendingDown className="h-6 w-6" style={{ color: 'var(--client-accent)' }} />
                </div>
                <h2 className="text-xl font-bold" style={{ color: 'var(--client-primary)' }}>Upcoming Regulatory Changes</h2>
              </div>

              <div className="space-y-3">
                {upcomingRegChanges.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-white border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold" style={{ color: 'var(--client-primary)' }}>{item.regulation}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            item.impact === 'High' ? 'bg-red-100 text-red-700' :
                            item.impact === 'Medium' ? 'bg-amber-100 text-amber-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {item.impact} Impact
                          </span>
                        </div>
                        <div className="text-xs mt-1" style={{ color: '#6b7280' }}>{item.description}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs" style={{ color: '#6b7280' }}>Effective</div>
                        <div className="text-sm font-semibold" style={{ color: '#1f2937' }}>{item.effectiveDate}</div>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span style={{ color: '#6b7280' }}>Implementation Readiness</span>
                        <span className="font-semibold" style={{ color: '#1f2937' }}>{item.readiness}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full"
                            style={{
                              width: `${item.readiness}%`,
                              backgroundColor: item.readiness >= 80 ? '#10b981' : item.readiness >= 60 ? '#3b82f6' : '#f59e0b'
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Finance Controls Tab */}
        <TabsContent value="finance-controls">
          <Tabs defaultValue="sox-compliance">
            <TabsList>
              <TabsTrigger value="sox-compliance">SOX Compliance & Testing</TabsTrigger>
              <TabsTrigger value="process-controls">Financial Process Controls</TabsTrigger>
              <TabsTrigger value="deficiencies">Deficiencies & Remediation</TabsTrigger>
            </TabsList>

            {/* SOX Compliance & Testing Sub-Tab */}
            <TabsContent value="sox-compliance">
              <div className="space-y-6">
                {/* Quarterly Testing Status */}
                <div className="rounded-2xl p-6 shadow-lg" style={{
                  background: 'linear-gradient(135deg, #ffffff 0%, rgba(248, 249, 250, 0.5) 100%)',
                  border: '1px solid rgba(0, 77, 53, 0.08)'
                }}>
                  <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--client-primary)' }}>SOX 302/404 Testing Status by Quarter</h3>
                  <div className="grid grid-cols-4 gap-4">
                    {Object.entries(soxTestingStatus).map(([quarter, data]) => (
                      <div key={quarter} className="p-4 rounded-xl bg-white border-2" style={{
                        borderColor: data.certReady ? '#10b981' : '#f59e0b'
                      }}>
                        <div className="text-xs font-bold uppercase tracking-wide text-gray-600 mb-2">{quarter.toUpperCase()} 2025</div>
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Total Controls:</span>
                            <span className="font-bold text-gray-900">{data.total}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Tested:</span>
                            <span className="font-bold text-gray-900">{data.tested}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Passed:</span>
                            <span className="font-bold text-green-600">{data.passed}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Failed:</span>
                            <span className="font-bold text-red-600">{data.failed}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Pass Rate:</span>
                            <span className="font-bold text-gray-900">{((data.passed / data.tested) * 100).toFixed(1)}%</span>
                          </div>
                          <div className="pt-2 mt-2 border-t border-gray-200">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Deficiencies:</span>
                              <span className={`font-bold ${data.deficiencies === 0 ? 'text-green-600' : 'text-amber-600'}`}>
                                {data.deficiencies}
                              </span>
                            </div>
                            <div className={`mt-2 px-2 py-1 rounded text-center text-xs font-bold ${
                              data.certReady ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                            }`}>
                              {data.certReady ? 'Cert Ready' : 'Testing In Progress'}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Certification Timeline */}
                <div className="rounded-2xl p-6 shadow-lg" style={{
                  background: 'linear-gradient(135deg, #ffffff 0%, rgba(248, 249, 250, 0.5) 100%)',
                  border: '1px solid rgba(0, 77, 53, 0.08)'
                }}>
                  <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--client-primary)' }}>Certification Timeline & Milestones</h3>
                  <div className="space-y-3">
                    {certificationTimeline.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4 p-4 rounded-xl bg-white border border-gray-100">
                        <div className={`w-3 h-3 rounded-full ${
                          item.status === 'Completed' ? 'bg-green-600' :
                          item.status === 'In Progress' ? 'bg-blue-600' :
                          'bg-gray-400'
                        }`} />
                        <div className="flex-1">
                          <div className="font-semibold text-sm text-gray-900">{item.milestone}</div>
                          <div className="text-xs text-gray-600 mt-1">Owner: {item.owner}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-600">Target Date</div>
                          <div className="font-semibold text-sm text-gray-900">{item.date}</div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                          item.status === 'Completed' ? 'bg-green-100 text-green-700' :
                          item.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {item.status}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* IT General Controls */}
                <div className="rounded-2xl p-6 shadow-lg" style={{
                  background: 'linear-gradient(135deg, #ffffff 0%, rgba(248, 249, 250, 0.5) 100%)',
                  border: '1px solid rgba(0, 77, 53, 0.08)'
                }}>
                  <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--client-primary)' }}>IT General Controls (ITGCs) Status</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-xs">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left font-bold text-gray-700">ITGC Domain</th>
                          <th className="px-4 py-3 text-right font-bold text-gray-700">Total Controls</th>
                          <th className="px-4 py-3 text-right font-bold text-gray-700">Tested</th>
                          <th className="px-4 py-3 text-right font-bold text-gray-700">Passed</th>
                          <th className="px-4 py-3 text-right font-bold text-gray-700">Pass Rate</th>
                          <th className="px-4 py-3 text-right font-bold text-gray-700">Issues</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {itgcStatus.map((row, idx) => (
                          <tr key={idx} className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-semibold text-gray-900">{row.domain}</td>
                            <td className="px-4 py-3 text-right text-gray-900">{row.controls}</td>
                            <td className="px-4 py-3 text-right text-gray-900">{row.tested}</td>
                            <td className="px-4 py-3 text-right font-bold text-green-600">{row.passed}</td>
                            <td className="px-4 py-3 text-right font-bold" style={{
                              color: row.passRate === 100 ? '#10b981' : row.passRate >= 95 ? '#3b82f6' : '#f59e0b'
                            }}>
                              {row.passRate.toFixed(1)}%
                            </td>
                            <td className="px-4 py-3 text-right">
                              <span className={`font-bold ${row.issues === 0 ? 'text-green-600' : 'text-amber-600'}`}>
                                {row.issues}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-4 p-4 rounded-lg bg-green-50">
                    <div className="text-sm font-bold text-green-900 mb-2">ITGC Program Performance</div>
                    <div className="grid grid-cols-3 gap-4 text-xs text-green-800">
                      <div>
                        <div className="font-semibold">Overall Pass Rate: 96.0%</div>
                        <div>96 of 100 controls passed</div>
                      </div>
                      <div>
                        <div className="font-semibold">Perfect Domains: 2 of 4</div>
                        <div>Computer Ops, Backup & Recovery at 100%</div>
                      </div>
                      <div>
                        <div className="font-semibold">Total Issues: 4</div>
                        <div>All in remediation, low severity</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Financial Process Controls Sub-Tab */}
            <TabsContent value="process-controls">
              <div className="space-y-6">
                {/* Controls by Process Area */}
                <div className="rounded-2xl p-6 shadow-lg" style={{
                  background: 'linear-gradient(135deg, #ffffff 0%, rgba(248, 249, 250, 0.5) 100%)',
                  border: '1px solid rgba(0, 77, 53, 0.08)'
                }}>
                  <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--client-primary)' }}>Control Effectiveness by Process Area</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-xs">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left font-bold text-gray-700">Process Area</th>
                          <th className="px-4 py-3 text-right font-bold text-gray-700">Total Controls</th>
                          <th className="px-4 py-3 text-right font-bold text-gray-700">Key Controls</th>
                          <th className="px-4 py-3 text-right font-bold text-gray-700">Tested</th>
                          <th className="px-4 py-3 text-right font-bold text-gray-700">Passed</th>
                          <th className="px-4 py-3 text-right font-bold text-gray-700">Pass Rate</th>
                          <th className="px-4 py-3 text-right font-bold text-gray-700">Deficiencies</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {controlsByProcess.map((row, idx) => (
                          <tr key={idx} className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-semibold text-gray-900">{row.process}</td>
                            <td className="px-4 py-3 text-right text-gray-900">{row.totalControls}</td>
                            <td className="px-4 py-3 text-right font-semibold text-nt-gold">{row.keyControls}</td>
                            <td className="px-4 py-3 text-right text-gray-900">{row.tested}</td>
                            <td className="px-4 py-3 text-right font-bold text-green-600">{row.passed}</td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <div className="w-16 bg-gray-200 rounded-full h-2">
                                  <div
                                    className="h-2 rounded-full"
                                    style={{
                                      width: `${row.passRate}%`,
                                      backgroundColor: row.passRate >= 98 ? '#10b981' : row.passRate >= 95 ? '#3b82f6' : '#f59e0b'
                                    }}
                                  />
                                </div>
                                <span className="font-bold w-12 text-right" style={{
                                  color: row.passRate >= 98 ? '#10b981' : row.passRate >= 95 ? '#3b82f6' : '#f59e0b'
                                }}>
                                  {row.passRate.toFixed(1)}%
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <span className={`font-bold ${row.deficiencies === 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {row.deficiencies}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-4 text-xs">
                    <div className="p-3 rounded-lg bg-green-50">
                      <div className="font-bold text-green-900 mb-1">Best Performing</div>
                      <div className="text-green-800">O2C at 98.0% pass rate. Strong revenue recognition and AR controls.</div>
                    </div>
                    <div className="p-3 rounded-lg bg-amber-50">
                      <div className="font-bold text-amber-900 mb-1">Focus Areas</div>
                      <div className="text-amber-800">Treasury (94.0%) and R2R (95.1%) below 95% target. 3 deficiencies in these areas.</div>
                    </div>
                    <div className="p-3 rounded-lg bg-blue-50">
                      <div className="font-bold text-blue-900 mb-1">Overall Program</div>
                      <div className="text-blue-800">492 total controls, 96.6% overall pass rate. Strong control environment.</div>
                    </div>
                  </div>
                </div>

                {/* Control KRIs Dashboard */}
                <div className="rounded-2xl p-6 shadow-lg" style={{
                  background: 'linear-gradient(135deg, #ffffff 0%, rgba(248, 249, 250, 0.5) 100%)',
                  border: '1px solid rgba(0, 77, 53, 0.08)'
                }}>
                  <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--client-primary)' }}>Key Control Risk Indicators (KRIs)</h3>
                  <div className="space-y-3">
                    {controlKRIs.map((kri, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-white border-l-4" style={{
                        borderLeftColor: kri.status === 'good' ? '#10b981' : kri.status === 'warning' ? '#f59e0b' : '#ef4444'
                      }}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-semibold text-sm text-gray-900">{kri.kri}</div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className="text-xs text-gray-600">Current</div>
                              <div className="text-lg font-bold text-gray-900">{kri.current}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-xs text-gray-600">Target</div>
                              <div className="text-sm font-semibold text-gray-700">{kri.target}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-xs text-gray-600">Threshold</div>
                              <div className="text-sm font-semibold text-red-600">{kri.threshold}</div>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                              kri.status === 'good' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                            }`}>
                              {kri.status === 'good' ? 'Within Tolerance' : 'Monitor'}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="h-2 rounded-full"
                              style={{
                                width: `${Math.min((kri.current / kri.threshold) * 100, 100)}%`,
                                backgroundColor: kri.status === 'good' ? '#10b981' : '#f59e0b'
                              }}
                            />
                          </div>
                          <span className={`text-xs font-semibold ${kri.trend < 0 ? 'text-green-600' : kri.trend > 0 ? 'text-red-600' : 'text-gray-600'}`}>
                            {kri.trend !== 0 && (kri.trend > 0 ? '+' : '')}{kri.trend} vs last month
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Deficiencies & Remediation Sub-Tab */}
            <TabsContent value="deficiencies">
              <div className="space-y-6">
                {/* Open Deficiencies Summary */}
                <div className="rounded-2xl p-6 shadow-lg" style={{
                  background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(239, 68, 68, 0.02) 100%)',
                  border: '1px solid rgba(239, 68, 68, 0.2)'
                }}>
                  <div className="flex items-center gap-3 mb-4">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                    <h3 className="text-lg font-bold text-red-900">Open Control Deficiencies</h3>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="p-4 rounded-xl bg-white border-2 border-red-300">
                      <div className="text-xs text-gray-600 mb-1">Material Weaknesses</div>
                      <div className="text-3xl font-bold text-red-600">1</div>
                      <div className="text-xs text-red-700 mt-1">Requires immediate attention</div>
                    </div>
                    <div className="p-4 rounded-xl bg-white border-2 border-amber-300">
                      <div className="text-xs text-gray-600 mb-1">Significant Deficiencies</div>
                      <div className="text-3xl font-bold text-amber-600">2</div>
                      <div className="text-xs text-amber-700 mt-1">In remediation</div>
                    </div>
                    <div className="p-4 rounded-xl bg-white border-2 border-blue-300">
                      <div className="text-xs text-gray-600 mb-1">Control Deficiencies</div>
                      <div className="text-3xl font-bold text-blue-600">1</div>
                      <div className="text-xs text-blue-700 mt-1">Lower risk items</div>
                    </div>
                  </div>
                </div>

                {/* Deficiency Detail Table */}
                <div className="rounded-2xl p-6 shadow-lg" style={{
                  background: 'linear-gradient(135deg, #ffffff 0%, rgba(248, 249, 250, 0.5) 100%)',
                  border: '1px solid rgba(0, 77, 53, 0.08)'
                }}>
                  <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--client-primary)' }}>Deficiency Details & Remediation Status</h3>
                  <div className="space-y-3">
                    {openDeficiencies.map((deficiency) => (
                      <div key={deficiency.id} className="p-4 rounded-xl bg-white border-l-4" style={{
                        borderLeftColor: deficiency.severity === 'Material Weakness' ? '#ef4444' :
                                        deficiency.severity === 'Significant Deficiency' ? '#f59e0b' : '#3b82f6'
                      }}>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="font-bold text-sm text-gray-900">{deficiency.id}</span>
                              <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                deficiency.severity === 'Material Weakness' ? 'bg-red-100 text-red-700' :
                                deficiency.severity === 'Significant Deficiency' ? 'bg-amber-100 text-amber-700' :
                                'bg-blue-100 text-blue-700'
                              }`}>
                                {deficiency.severity}
                              </span>
                              <span className="text-xs font-semibold text-gray-600">{deficiency.process}</span>
                            </div>
                            <div className="text-sm text-gray-900 mb-2">{deficiency.issue}</div>
                            <div className="grid grid-cols-4 gap-4 text-xs text-gray-600">
                              <div>
                                <span className="font-medium">Identified:</span> {deficiency.identified}
                              </div>
                              <div>
                                <span className="font-medium">Owner:</span> {deficiency.owner}
                              </div>
                              <div>
                                <span className="font-medium">Due Date:</span> {deficiency.dueDate}
                              </div>
                              <div>
                                <span className="font-medium">Days Open:</span> <span className={`font-bold ${
                                  deficiency.daysOpen > 60 ? 'text-red-600' : deficiency.daysOpen > 30 ? 'text-amber-600' : 'text-blue-600'
                                }`}>{deficiency.daysOpen}</span>
                              </div>
                            </div>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ml-4 ${
                            deficiency.status === 'Remediation Plan Approved' ? 'bg-blue-100 text-blue-700' :
                            'bg-amber-100 text-amber-700'
                          }`}>
                            {deficiency.status}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Remediation Actions & Timeline */}
                <div className="rounded-2xl p-6 shadow-lg" style={{
                  background: 'linear-gradient(135deg, #ffffff 0%, rgba(248, 249, 250, 0.5) 100%)',
                  border: '1px solid rgba(0, 77, 53, 0.08)'
                }}>
                  <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--client-primary)' }}>Required Remediation Actions</h3>
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-red-50">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        <span className="font-bold text-sm text-red-900">Material Weakness - Immediate Priority</span>
                      </div>
                      <div className="text-xs text-red-800 space-y-1">
                        <div>• <strong>MW-2025-01 (Treasury):</strong> Implement enhanced review procedures for hedge accounting effectiveness testing</div>
                        <div>• Hire additional technical accounting resource with hedge accounting expertise (by Feb 28)</div>
                        <div>• Deploy automated hedge effectiveness calculation tool (by Mar 15)</div>
                        <div>• Conduct full retesting by external auditors before Q1 certification (by Mar 31)</div>
                      </div>
                    </div>
                    <div className="p-4 rounded-lg bg-amber-50">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="h-4 w-4 text-amber-600" />
                        <span className="font-bold text-sm text-amber-900">Significant Deficiencies - High Priority</span>
                      </div>
                      <div className="text-xs text-amber-800 space-y-1">
                        <div>• <strong>SD-2025-02 (R2R):</strong> Create revenue recognition documentation templates and approval workflow</div>
                        <div>• <strong>SD-2024-08 (Treasury):</strong> Implement automated derivative valuation system to replace manual spreadsheets</div>
                        <div>• Both items targeted for remediation by Q2 2025</div>
                      </div>
                    </div>
                    <div className="p-4 rounded-lg bg-blue-50">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="h-4 w-4 text-blue-600" />
                        <span className="font-bold text-sm text-blue-900">Control Deficiency - Standard Timeline</span>
                      </div>
                      <div className="text-xs text-blue-800">
                        • <strong>CD-2025-03 (P2P):</strong> Enhance AP approval workflow and implement aging alerts. Target completion Mar 15.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>

      {/* Metric Detail Modal */}
      <MetricDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        metric={selectedMetric}
      />
    </div>
  )
}
