import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/Tabs'
import DailyPulseView from '../components/businessflow/DailyPulseView'
import ClientActivityView from '../components/businessflow/ClientActivityView'
import CustodyView from '../components/businessflow/CustodyView'
import DepositsCommitmentsView from '../components/businessflow/DepositsCommitmentsView'
import AlertsView from '../components/businessflow/AlertsView'
import ClientProfitability from '../components/client/ClientProfitability'
import WalletShareAnalysis from '../components/client/WalletShareAnalysis'
import RelationshipDepth from '../components/client/RelationshipDepth'
import ProfitabilityAttribution from '../components/client/ProfitabilityAttribution'

export default function BusinessFlow() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Business Flow & Client Economics</h1>
        <p className="text-gray-600 mt-2">
          Daily operations, client activity, and client profitability analytics
        </p>
      </div>

      <Tabs defaultValue="pulse">
        <TabsList>
          <TabsTrigger value="pulse">Daily Pulse</TabsTrigger>
          <TabsTrigger value="clients">Client Activity</TabsTrigger>
          <TabsTrigger value="profitability">Client RAROC</TabsTrigger>
          <TabsTrigger value="wallet">Wallet Share</TabsTrigger>
          <TabsTrigger value="relationship">Relationship Health</TabsTrigger>
          <TabsTrigger value="attribution">Profit Attribution</TabsTrigger>
          <TabsTrigger value="custody">Custody Business</TabsTrigger>
          <TabsTrigger value="deposits">Deposits</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="pulse">
          <DailyPulseView />
        </TabsContent>

        <TabsContent value="clients">
          <ClientActivityView />
        </TabsContent>

        <TabsContent value="custody">
          <CustodyView />
        </TabsContent>

        <TabsContent value="deposits">
          <DepositsCommitmentsView />
        </TabsContent>

        <TabsContent value="profitability">
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

        <TabsContent value="alerts">
          <AlertsView />
        </TabsContent>
      </Tabs>
    </div>
  )
}
