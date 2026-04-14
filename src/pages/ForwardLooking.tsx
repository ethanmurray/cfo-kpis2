import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/Tabs'
import ForecastsView from '../components/forward/ForecastsView'
import ScenariosView from '../components/forward/ScenariosView'
import DriversView from '../components/forward/DriversView'
import DriverTreesView from '../components/forward/DriverTreesView'
import SensitivitiesView from '../components/forward/SensitivitiesView'
import StressTestView from '../components/forward/StressTestView'
import CorrelationView from '../components/forward/CorrelationView'

export default function ForwardLooking() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Forward Looking</h1>
        <p className="text-gray-600 mt-2">
          Forecasts, scenarios, stress tests, and predictive analytics
        </p>
      </div>

      <Tabs defaultValue="drivertrees">
        <TabsList>
          <TabsTrigger value="drivertrees">Driver Trees</TabsTrigger>
          <TabsTrigger value="forecasts">Forecasts</TabsTrigger>
          <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
          <TabsTrigger value="stresstest">Stress Tests</TabsTrigger>
          <TabsTrigger value="drivers">Drivers</TabsTrigger>
          <TabsTrigger value="sensitivities">Sensitivities</TabsTrigger>
          <TabsTrigger value="correlation">Correlations</TabsTrigger>
        </TabsList>

        <TabsContent value="drivertrees">
          <DriverTreesView />
        </TabsContent>

        <TabsContent value="forecasts">
          <ForecastsView />
        </TabsContent>

        <TabsContent value="scenarios">
          <ScenariosView />
        </TabsContent>

        <TabsContent value="stresstest">
          <StressTestView />
        </TabsContent>

        <TabsContent value="drivers">
          <DriversView />
        </TabsContent>

        <TabsContent value="sensitivities">
          <SensitivitiesView />
        </TabsContent>

        <TabsContent value="correlation">
          <CorrelationView />
        </TabsContent>
      </Tabs>
    </div>
  )
}
