import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/Tabs'
import DailyPulseView from '../components/businessflow/DailyPulseView'
import CustodyView from '../components/businessflow/CustodyView'
import TreasuryOperations from '../components/operations/TreasuryOperations'
import MonthEndClose from '../components/operations/MonthEndClose'
import ReconciliationControls from '../components/operations/ReconciliationControls'
import { TrendingUp, CheckCircle2, AlertCircle, Clock } from 'lucide-react'

export default function Operations() {
  return (
    <div className="space-y-4">
      <div className="page-header">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-nt-forest">Finance Operations</h1>
          <p className="text-xs mt-1 text-gray-600">
            Treasury, reconciliations, month-end close, custody operations, and daily metrics
          </p>
        </div>
        <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg shadow-md" style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(16, 185, 129, 0.04) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.25)'
        }}>
          <CheckCircle2 className="h-5 w-5" style={{ color: '#10b981' }} />
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wide text-gray-600">STP Rate</div>
            <div className="flex items-baseline gap-1.5">
              <div className="text-lg font-bold" style={{ color: '#10b981' }}>87.5%</div>
              <div className="text-[10px] font-semibold text-green-600">+1.2%</div>
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
              <span className="font-semibold text-xs text-nt-forest">Operational Excellence</span>
            </div>
            <ul className="space-y-0.5 text-xs text-gray-600 leading-tight">
              <li>• STP rate: 87.5% (target 95%)</li>
              <li>• Settlement fail rate: 0.08% (industry-leading)</li>
              <li>• Month-end close: D+3 (on schedule)</li>
              <li>• All critical recons current (0 breaks &gt; 30 days)</li>
            </ul>
          </div>

          <div className="summary-card">
            <div className="flex items-center gap-1.5 mb-2">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <span className="font-semibold text-xs text-nt-forest">Focus Areas</span>
            </div>
            <ul className="space-y-0.5 text-xs text-gray-600 leading-tight">
              <li>• 23 outstanding reconciliation items (aging &gt; 5 days)</li>
              <li>• Treasury operations: $2.3B intraday peak usage</li>
              <li>• 142 manual journal entries last close (vs 95 target)</li>
              <li>• Suspense aging: $18M over 10 days</li>
            </ul>
          </div>

          <div className="summary-card">
            <div className="flex items-center gap-1.5 mb-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="font-semibold text-xs text-nt-forest">Automation Priorities</span>
            </div>
            <ul className="space-y-0.5 text-xs text-gray-600 leading-tight">
              <li>• Deploy RPA for recon matching (Q2 target)</li>
              <li>• Automate 60% of manual JEs by year-end</li>
              <li>• Implement real-time treasury dashboard</li>
              <li>• Target D+2 close by Q4</li>
            </ul>
          </div>
        </div>
      </div>

      <Tabs defaultValue="pulse">
        <TabsList>
          <TabsTrigger value="pulse">Daily Pulse</TabsTrigger>
          <TabsTrigger value="custody">Custody & Settlement</TabsTrigger>
          <TabsTrigger value="treasury">Treasury Operations</TabsTrigger>
          <TabsTrigger value="close">Month-End Close</TabsTrigger>
          <TabsTrigger value="recon">Reconciliation & Controls</TabsTrigger>
        </TabsList>

        <TabsContent value="pulse">
          <DailyPulseView />
        </TabsContent>

        <TabsContent value="custody">
          <CustodyView />
        </TabsContent>

        <TabsContent value="treasury">
          <TreasuryOperations />
        </TabsContent>

        <TabsContent value="close">
          <MonthEndClose />
        </TabsContent>

        <TabsContent value="recon">
          <ReconciliationControls />
        </TabsContent>
      </Tabs>
    </div>
  )
}
