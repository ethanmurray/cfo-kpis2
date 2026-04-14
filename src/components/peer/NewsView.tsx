import { useState, useMemo } from 'react'
import { generatePeerData, generateSentimentTrend } from '../../data/peerData'
import LineChart from '../charts/LineChart'
import { TrendingUp, TrendingDown, Minus, AlertCircle, Calendar } from 'lucide-react'
import { format } from 'date-fns'

export default function NewsView() {
  const [selectedTicker, setSelectedTicker] = useState<string>('NTRS')
  const [selectedTopic, setSelectedTopic] = useState<string>('All')
  const [sentimentFilter, setSentimentFilter] = useState<'all' | 'positive' | 'neutral' | 'negative'>('all')
  const [showEventsOnly, setShowEventsOnly] = useState(false)

  const peers = useMemo(() => generatePeerData(), [])
  const selectedPeer = peers.find(p => p.ticker === selectedTicker)

  const allTopics = useMemo(() => {
    if (!selectedPeer) return []
    const topics = new Set<string>()
    selectedPeer.news.forEach(item => {
      item.topicTags.forEach(tag => topics.add(tag))
    })
    return ['All', ...Array.from(topics)]
  }, [selectedPeer])

  const filteredNews = useMemo(() => {
    if (!selectedPeer) return []

    return selectedPeer.news.filter(item => {
      // Topic filter
      if (selectedTopic !== 'All' && !item.topicTags.includes(selectedTopic)) {
        return false
      }

      // Sentiment filter
      if (sentimentFilter !== 'all') {
        if (sentimentFilter === 'positive' && item.sentimentScore <= 0.2) return false
        if (sentimentFilter === 'neutral' && (item.sentimentScore < -0.2 || item.sentimentScore > 0.2)) return false
        if (sentimentFilter === 'negative' && item.sentimentScore >= -0.2) return false
      }

      // Events filter
      if (showEventsOnly && !item.eventFlag) return false

      return true
    })
  }, [selectedPeer, selectedTopic, sentimentFilter, showEventsOnly])

  const sentimentTrend = useMemo(() => {
    if (!selectedPeer) return []
    return generateSentimentTrend(selectedPeer.news, 30)
  }, [selectedPeer])

  const getSentimentColor = (score: number) => {
    if (score >= 0.4) return 'text-green-600 bg-green-50'
    if (score >= 0.2) return 'text-green-600 bg-green-50'
    if (score > -0.2) return 'text-gray-600 bg-gray-50'
    if (score > -0.4) return 'text-red-600 bg-red-50'
    return 'text-red-600 bg-red-50'
  }

  const getSentimentIcon = (score: number) => {
    if (score > 0.2) return <TrendingUp className="w-4 h-4" />
    if (score < -0.2) return <TrendingDown className="w-4 h-4" />
    return <Minus className="w-4 h-4" />
  }

  const getSentimentLabel = (score: number) => {
    if (score >= 0.4) return 'Very Positive'
    if (score >= 0.2) return 'Positive'
    if (score > -0.2) return 'Neutral'
    if (score > -0.4) return 'Negative'
    return 'Very Negative'
  }

  const avgSentiment = filteredNews.length > 0
    ? filteredNews.reduce((sum, item) => sum + item.sentimentScore, 0) / filteredNews.length
    : 0

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="metric-card">
        <div className="space-y-4">
          {/* Bank Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Bank</label>
            <div className="flex gap-2 flex-wrap">
              {peers.map(peer => (
                <button
                  key={peer.ticker}
                  onClick={() => setSelectedTicker(peer.ticker)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    selectedTicker === peer.ticker
                      ? peer.ticker === 'NTRS'
                        ? 'bg-amber-600 text-white'
                        : 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {peer.ticker}
                </button>
              ))}
            </div>
          </div>

          {/* Filters Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Topic Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Topic</label>
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                {allTopics.map(topic => (
                  <option key={topic} value={topic}>{topic}</option>
                ))}
              </select>
            </div>

            {/* Sentiment Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sentiment</label>
              <select
                value={sentimentFilter}
                onChange={(e) => setSentimentFilter(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="all">All Sentiment</option>
                <option value="positive">Positive</option>
                <option value="neutral">Neutral</option>
                <option value="negative">Negative</option>
              </select>
            </div>

            {/* Events Toggle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filters</label>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="events"
                  checked={showEventsOnly}
                  onChange={(e) => setShowEventsOnly(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="events" className="text-sm text-gray-700">
                  Events only
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="metric-card">
          <div className="text-sm text-gray-600">Total Articles</div>
          <div className="text-2xl font-bold text-gray-900">{filteredNews.length}</div>
        </div>
        <div className="metric-card">
          <div className="text-sm text-gray-600">Average Sentiment</div>
          <div className={`text-2xl font-bold ${
            avgSentiment > 0.2 ? 'text-green-600' : avgSentiment < -0.2 ? 'text-red-600' : 'text-gray-900'
          }`}>
            {avgSentiment.toFixed(2)}
          </div>
        </div>
        <div className="metric-card">
          <div className="text-sm text-gray-600">Material Events</div>
          <div className="text-2xl font-bold text-gray-900">
            {filteredNews.filter(n => n.eventFlag).length}
          </div>
        </div>
        <div className="metric-card">
          <div className="text-sm text-gray-600">Sentiment Trend</div>
          <div className="flex items-center gap-2">
            {getSentimentIcon(avgSentiment)}
            <div className="text-lg font-bold text-gray-900">
              {getSentimentLabel(avgSentiment)}
            </div>
          </div>
        </div>
      </div>

      {/* Sentiment Trend Chart */}
      <div className="metric-card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          7-Day Rolling Sentiment Trend
        </h2>
        <LineChart
          data={sentimentTrend}
          lines={[{ dataKey: 'value', name: 'Sentiment Score', color: '#0ea5e9' }]}
          xAxisKey="date"
          height={250}
          valueFormatter={(v) => v.toFixed(2)}
        />
      </div>

      {/* News Feed */}
      <div className="metric-card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          News Feed ({filteredNews.length} articles)
        </h2>
        <div className="space-y-4">
          {filteredNews.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No articles match the selected filters
            </div>
          ) : (
            filteredNews.map(item => (
              <div
                key={item.id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {item.eventFlag && (
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded-full flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          Event
                        </span>
                      )}
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {format(item.timestamp, 'MMM dd, yyyy • h:mm a')}
                      </span>
                    </div>

                    <h3 className="text-base font-medium text-gray-900 mb-2">
                      {item.headline}
                    </h3>

                    {item.summary && (
                      <p className="text-sm text-gray-600 mb-3">{item.summary}</p>
                    )}

                    <div className="flex items-center gap-2 flex-wrap">
                      {item.topicTags.map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <div className={`px-3 py-1.5 rounded-lg text-sm font-medium ${getSentimentColor(item.sentimentScore)} flex items-center gap-1`}>
                      {getSentimentIcon(item.sentimentScore)}
                      {item.sentimentScore.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500">
                      Relevance: {(item.relevanceScore * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
