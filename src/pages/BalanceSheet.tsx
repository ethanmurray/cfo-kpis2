import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/Tabs'
import OverviewTab from '../components/balancesheet/OverviewTab'
import FundingTab from '../components/balancesheet/FundingTab'
import AssetsTab from '../components/balancesheet/AssetsTab'
import CapitalTab from '../components/balancesheet/CapitalTab'

export default function BalanceSheet() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Balance Sheet</h1>
          <p className="text-sm text-gray-600 mt-1">Asset, liability, and capital composition analysis</p>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="funding">Funding</TabsTrigger>
          <TabsTrigger value="assets">Assets</TabsTrigger>
          <TabsTrigger value="capital">Capital</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab />
        </TabsContent>

        <TabsContent value="funding">
          <FundingTab />
        </TabsContent>

        <TabsContent value="assets">
          <AssetsTab />
        </TabsContent>

        <TabsContent value="capital">
          <CapitalTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
