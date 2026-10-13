// Shape returned by GET /api/admin/analytics
export interface RankedItem {
  label: string
  value: number
}

export interface AnalyticsData {
  range: { days: number; start: string }
  kpis: {
    pageViews: number
    visitors: number
    sessions: number
    pagesPerSession: number
    joinRequests: number
    joinRequestsAllTime: number
    chatConversations: number
    chatMessages: number
    chatOpens: number
    studentsTotal: number
    studentsSponsored: number
    previous: {
      pageViews: number
      visitors: number
      sessions: number
      joinRequests: number
      chatConversations: number
    }
  }
  daily: { date: string; pageViews: number; visitors: number; joins: number; chats: number }[]
  topPages: RankedItem[]
  referrers: RankedItem[]
  devices: RankedItem[]
  countries: RankedItem[]
  topQuestions: RankedItem[]
  answerSources: RankedItem[]
}
