import { PeerData, NewsItem, TimeSeriesPoint } from '../types/metrics'
import { randomInRange } from '../utils/dataGenerators'
import { subDays, subMonths, format } from 'date-fns'
import { getActiveClientConfig } from './mockData'

function getPeers() {
  return getActiveClientConfig().peers
}

function getOwnTicker() {
  return getActiveClientConfig().ticker
}

const newsTopics = [
  'Earnings Release',
  'Regulatory Filing',
  'Strategic Initiative',
  'M&A Activity',
  'Credit Quality',
  'Capital Return',
  'Technology Investment',
  'Risk Management',
  'Market Share',
  'Executive Change'
]

const newsHeadlines: { [key: string]: string[] } = {
  'Earnings Release': [
    'Reports Q4 earnings beat expectations with strong NII growth',
    'Announces quarterly results; EPS exceeds analyst estimates',
    'Beats on revenue and earnings; raises full-year guidance',
    'Q3 results show resilience in challenging rate environment'
  ],
  'Regulatory Filing': [
    'Files 10-K annual report; highlights capital strength',
    'Submits resolution plan to Federal Reserve',
    'Updates risk disclosures in quarterly filing',
    'Files shelf registration for debt securities'
  ],
  'Strategic Initiative': [
    'Announces digital banking expansion initiative',
    'Launches new wealth management platform',
    'Expands commercial lending capabilities',
    'Strengthens investment banking franchise'
  ],
  'M&A Activity': [
    'Exploring acquisition of regional bank',
    'Completes divestiture of non-core business',
    'Announces strategic partnership with fintech firm',
    'Evaluates merger opportunities to expand market presence'
  ],
  'Credit Quality': [
    'NPL ratio improves; credit metrics remain strong',
    'Announces increase in loan loss reserves',
    'Credit quality stable despite economic headwinds',
    'Net charge-offs decline quarter-over-quarter'
  ],
  'Capital Return': [
    'Increases quarterly dividend by 15%',
    'Announces $5B share buyback program',
    'Returns capital to shareholders through dividends and buybacks',
    'Board approves increased capital distribution plan'
  ],
  'Technology Investment': [
    'Invests $2B in digital transformation initiative',
    'Launches AI-powered customer service platform',
    'Enhances cybersecurity infrastructure',
    'Rolls out new mobile banking features'
  ],
  'Risk Management': [
    'Strengthens interest rate risk management framework',
    'Enhances liquidity stress testing capabilities',
    'Updates operational risk controls',
    'Implements new compliance monitoring system'
  ],
  'Market Share': [
    'Gains market share in mortgage lending',
    'Expands custody and fund services business',
    'Wins major institutional client mandate',
    'Increases deposit market share in key regions'
  ],
  'Executive Change': [
    'Names new Chief Financial Officer',
    'Promotes executive to lead commercial banking',
    'Appoints Chief Risk Officer',
    'CEO discusses succession planning'
  ]
}

function generateNews(ticker: string, name: string, count: number = 10): NewsItem[] {
  const news: NewsItem[] = []

  for (let i = 0; i < count; i++) {
    const topic = newsTopics[Math.floor(Math.random() * newsTopics.length)]
    const headlines = newsHeadlines[topic]
    const headline = headlines[Math.floor(Math.random() * headlines.length)]

    const sentiment = topic === 'Credit Quality' && headline.includes('increase')
      ? randomInRange(-0.5, -0.2)
      : topic === 'Earnings Release' && headline.includes('beat')
      ? randomInRange(0.4, 0.8)
      : topic === 'Capital Return'
      ? randomInRange(0.5, 0.9)
      : randomInRange(-0.3, 0.6)

    news.push({
      id: `${ticker}-${i}`,
      timestamp: subDays(new Date(), Math.floor(Math.random() * 90)),
      headline: `${name}: ${headline}`,
      entity: ticker,
      topicTags: [topic],
      sentimentScore: sentiment,
      relevanceScore: randomInRange(0.6, 1.0),
      eventFlag: ['Earnings Release', 'M&A Activity', 'Capital Return'].includes(topic),
      summary: `Analysis of ${name}'s ${topic.toLowerCase()} and market implications.`
    })
  }

  return news.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
}

export function generatePeerData(): PeerData[] {
  const peers = getPeers()
  const ownTicker = getOwnTicker()
  return peers.map(peer => {
    const basePrice = peer.isOwn ? 95 : peer.ticker === 'JPM' ? 185 : randomInRange(50, 200)
    const marketCap = peer.ticker === 'JPM' ? 550 : peer.ticker === 'BAC' ? 280 : randomInRange(20, 150)

    // Market performance metrics
    const dailyReturn = randomInRange(-2, 2)
    const returns = {
      '1D': dailyReturn,
      '5D': randomInRange(-3, 3),
      '1M': randomInRange(-5, 8),
      'YTD': randomInRange(-10, 25),
      '1Y': randomInRange(-5, 35)
    }

    // Valuation metrics - custody banks typically trade at lower multiples
    const isCustodyBank = peer.isOwn || ['STT', 'BK'].includes(peer.ticker)
    const peTTM = isCustodyBank ? randomInRange(12, 16) : randomInRange(8, 14)
    const peForward = peTTM * randomInRange(0.85, 0.95)
    const pb = isCustodyBank ? randomInRange(1.2, 1.8) : randomInRange(0.8, 1.3)
    const ptbv = isCustodyBank ? randomInRange(2.5, 3.5) : randomInRange(1.2, 2.0)

    // Fundamentals - custody banks have higher ROE
    const roe = isCustodyBank ? randomInRange(11, 14) : randomInRange(8, 13)
    const rotce = roe * randomInRange(1.3, 1.6)
    const efficiencyRatio = isCustodyBank ? randomInRange(65, 72) : randomInRange(55, 65)
    const nim = isCustodyBank ? randomInRange(1.8, 2.4) : randomInRange(2.4, 3.2)
    const cet1Ratio = randomInRange(10.5, 13.5)

    return {
      ticker: peer.ticker,
      name: peer.name,
      marketData: {
        price: basePrice,
        volume: randomInRange(2000000, 10000000),
        dailyReturn,
        returns,
        marketCap,
        volatility: {
          '30D': randomInRange(15, 30),
          '90D': randomInRange(18, 35)
        },
        beta: randomInRange(0.8, 1.4),
        shortInterest: randomInRange(1, 5)
      },
      valuation: {
        peTTM,
        peForward,
        pb,
        ptbv,
        dividendYield: randomInRange(2.5, 4.5),
        payoutRatio: randomInRange(30, 50)
      },
      fundamentals: {
        roe,
        rotce,
        efficiencyRatio,
        nim,
        cet1Ratio,
        loanGrowth: randomInRange(-2, 8),
        depositGrowth: randomInRange(-5, 10)
      },
      creditMarket: {
        cdsSpread: randomInRange(40, 120),
        bondSpread: randomInRange(50, 150),
        spreadChange: randomInRange(-15, 15)
      },
      news: generateNews(peer.ticker, peer.name, 15)
    }
  })
}

export function generatePeerTimeSeries(
  ticker: string,
  metric: 'price' | 'roe' | 'cet1' | 'nim',
  quarters: number = 12
): TimeSeriesPoint[] {
  const data: TimeSeriesPoint[] = []

  const ownTicker = getOwnTicker()
  const isOwn = ticker === ownTicker
  const baseValues = {
    price: ticker === 'JPM' ? 150 : isOwn ? 85 : randomInRange(50, 120),
    roe: isOwn || ['STT', 'BK'].includes(ticker) ? 12 : 10,
    cet1: 11.5,
    nim: isOwn || ['STT', 'BK'].includes(ticker) ? 2.0 : 2.8
  }

  const trends = {
    price: 0.015,
    roe: 0.005,
    cet1: 0.002,
    nim: 0.008
  }

  let currentValue = baseValues[metric]

  for (let i = quarters - 1; i >= 0; i--) {
    const date = subMonths(new Date(), i * 3)
    currentValue = currentValue * (1 + trends[metric])
    const volatility = 1 + (Math.random() - 0.5) * 0.05

    currentValue = currentValue * volatility

    data.push({
      date: format(date, 'yyyy-MM'),
      value: currentValue,
      label: format(date, 'QQQ yyyy')
    })
  }

  return data
}

export function calculatePeerRankings(peers: PeerData[], metric: keyof PeerData['fundamentals']): any[] {
  const sorted = [...peers].sort((a, b) => {
    const aVal = a.fundamentals[metric] as number
    const bVal = b.fundamentals[metric] as number
    return bVal - aVal
  })

  return sorted.map((peer, index) => ({
    rank: index + 1,
    ticker: peer.ticker,
    name: peer.name,
    value: peer.fundamentals[metric],
    percentile: ((sorted.length - index) / sorted.length) * 100
  }))
}

export function generateSentimentTrend(news: NewsItem[], days: number = 30): TimeSeriesPoint[] {
  const data: TimeSeriesPoint[] = []

  for (let i = days - 1; i >= 0; i--) {
    const date = subDays(new Date(), i)
    const dateStr = format(date, 'yyyy-MM-dd')

    // Find news items for this day and calculate rolling 7-day sentiment
    const recentNews = news.filter(item => {
      const daysDiff = Math.abs((date.getTime() - item.timestamp.getTime()) / (1000 * 60 * 60 * 24))
      return daysDiff <= 7
    })

    const avgSentiment = recentNews.length > 0
      ? recentNews.reduce((sum, item) => sum + item.sentimentScore, 0) / recentNews.length
      : 0

    data.push({
      date: dateStr,
      value: avgSentiment,
      label: format(date, 'MMM dd')
    })
  }

  return data
}

// Convenience function that returns both peers and news
export function getPeerData() {
  const peers = generatePeerData()
  const news = peers.flatMap(peer => peer.news)
  return { peers, news }
}
