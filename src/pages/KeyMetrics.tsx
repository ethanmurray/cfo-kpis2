import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/Tabs'
import LiquidityView from '../components/keymetrics/LiquidityView'
import CapitalView from '../components/keymetrics/CapitalView'
import OrderFlowView from '../components/keymetrics/OrderFlowView'
import InterestRateView from '../components/keymetrics/InterestRateView'
import BalanceSheetView from '../components/keymetrics/BalanceSheetView'
import ExecutiveSnapshot from '../components/keymetrics/ExecutiveSnapshot'

export default function KeyMetrics() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Key Metrics</h1>
        <p className="text-gray-600 mt-2">
          Liquidity, Capital, Order/Flow, Interest Rate Disposition, and Balance Sheet
        </p>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Executive Snapshot</TabsTrigger>
          <TabsTrigger value="liquidity">Liquidity</TabsTrigger>
          <TabsTrigger value="capital">Capital</TabsTrigger>
          <TabsTrigger value="orderflow">Order / Flow</TabsTrigger>
          <TabsTrigger value="interestrate">Interest Rate</TabsTrigger>
          <TabsTrigger value="balancesheet">Balance Sheet</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <ExecutiveSnapshot />
        </TabsContent>

        <TabsContent value="liquidity">
          <LiquidityView />
        </TabsContent>

        <TabsContent value="capital">
          <CapitalView />
        </TabsContent>

        <TabsContent value="orderflow">
          <OrderFlowView />
        </TabsContent>

        <TabsContent value="interestrate">
          <InterestRateView />
        </TabsContent>

        <TabsContent value="balancesheet">
          <BalanceSheetView />
        </TabsContent>
      </Tabs>
    </div>
  )
}
