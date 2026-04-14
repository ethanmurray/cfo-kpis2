import { useState, useMemo } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/Tabs'
import ScoreboardView from '../components/peer/ScoreboardView'
import TrendsView from '../components/peer/TrendsView'
import ValuationView from '../components/peer/ValuationView'
import NewsView from '../components/peer/NewsView'

export default function PeerComparison() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Peer Comparison</h1>
        <p className="text-gray-600 mt-2">
          Market performance, valuation, fundamentals, and news sentiment
        </p>
      </div>

      <Tabs defaultValue="scoreboard">
        <TabsList>
          <TabsTrigger value="scoreboard">Scoreboard</TabsTrigger>
          <TabsTrigger value="trends">Time Series</TabsTrigger>
          <TabsTrigger value="valuation">Valuation vs Performance</TabsTrigger>
          <TabsTrigger value="news">News & Sentiment</TabsTrigger>
        </TabsList>

        <TabsContent value="scoreboard">
          <ScoreboardView />
        </TabsContent>

        <TabsContent value="trends">
          <TrendsView />
        </TabsContent>

        <TabsContent value="valuation">
          <ValuationView />
        </TabsContent>

        <TabsContent value="news">
          <NewsView />
        </TabsContent>
      </Tabs>
    </div>
  )
}
