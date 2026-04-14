import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/Tabs'
import ClientProfitability from '../components/client/ClientProfitability'
import WalletShareAnalysis from '../components/client/WalletShareAnalysis'
import RelationshipDepth from '../components/client/RelationshipDepth'
import ProfitabilityAttribution from '../components/client/ProfitabilityAttribution'
import ClientActivityView from '../components/businessflow/ClientActivityView'
import DepositsCommitmentsView from '../components/businessflow/DepositsCommitmentsView'
import { TrendingUp, CheckCircle2, AlertCircle, Clock, Users } from 'lucide-react'

export default function ClientEconomics() {
  return (
    <div className="space-y-4">
      <div className="page-header">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-nt-forest">Client Economics</h1>
          <p className="text-xs mt-1 text-gray-600">
            Client profitability, wallet share, relationship health, deposits, and activity analytics
          </p>
        </div>
        <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg shadow-md" style={{
          background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.12) 0%, rgba(212, 175, 55, 0.04) 100%)',
          border: '1px solid rgba(212, 175, 55, 0.25)'
        }}>
          <Users className="h-5 w-5 text-nt-gold" />
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wide text-gray-600">Total Clients</div>
            <div className="flex items-baseline gap-1.5">
              <div className="text-lg font-bold text-nt-gold">285</div>
              <div className="text-[10px] font-semibold text-green-600">+3</div>
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
              <span className="font-semibold text-xs text-nt-forest">Client Performance</span>
            </div>
            <ul className="space-y-0.5 text-xs text-gray-600 leading-tight">
              <li>• 285 clients generating $5.4B revenue (+8.2% YoY)</li>
              <li>• Top 20 clients: $3.8B revenue (70% of total)</li>
              <li>• Average RAROC 10.2% (above 10% hurdle)</li>
              <li>• Client retention 97.8% (industry-leading)</li>
            </ul>
          </div>

          <div className="summary-card">
            <div className="flex items-center gap-1.5 mb-2">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <span className="font-semibold text-xs text-nt-forest">Growth Opportunities</span>
            </div>
            <ul className="space-y-0.5 text-xs text-gray-600 leading-tight">
              <li>• Wallet share at 30% (target 45%)</li>
              <li>• $588M identified cross-sell opportunity</li>
              <li>• 85 clients below 20% wallet share</li>
              <li>• Product penetration: 2.3 per client (vs 3.5 target)</li>
            </ul>
          </div>

          <div className="summary-card">
            <div className="flex items-center gap-1.5 mb-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="font-semibold text-xs text-nt-forest">Strategic Actions</span>
            </div>
            <ul className="space-y-0.5 text-xs text-gray-600 leading-tight">
              <li>• Launch targeted cross-sell campaign (Q2)</li>
              <li>• Deepen top 50 relationships (+15% wallet target)</li>
              <li>• Focus on fund admin & FX services expansion</li>
              <li>• Address 12 at-risk clients ($420M revenue)</li>
            </ul>
          </div>
        </div>
      </div>

      <Tabs defaultValue="raroc">
        <TabsList>
          <TabsTrigger value="raroc">Client RAROC</TabsTrigger>
          <TabsTrigger value="wallet">Wallet Share & Cross-Sell</TabsTrigger>
          <TabsTrigger value="relationship">Relationship Health</TabsTrigger>
          <TabsTrigger value="attribution">Profit Attribution</TabsTrigger>
          <TabsTrigger value="activity">Activity & Flow</TabsTrigger>
          <TabsTrigger value="deposits">Deposits & Commitments</TabsTrigger>
        </TabsList>

        <TabsContent value="raroc">
          <ClientProfitability />
        </TabsContent>

        <TabsContent value="wallet">
          <WalletShareAnalysis />
        </TabsContent>

        <TabsContent value="relationship">
          <RelationshipDepth />
        </TabsContent>

        <TabsContent value="attribution">
          <ProfitabilityAttribution />
        </TabsContent>

        <TabsContent value="activity">
          <ClientActivityView />
        </TabsContent>

        <TabsContent value="deposits">
          <DepositsCommitmentsView />
        </TabsContent>
      </Tabs>
    </div>
  )
}
