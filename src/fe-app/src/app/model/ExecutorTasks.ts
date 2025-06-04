export interface ExecutorTasks {
  active: number
  queued: number
  queuedRedshiftWet: number
  activeRedshiftWet: number
  queuedRedshiftInline: number
  activeRedshiftInline: number
  queuedRedshiftSort: number
  activeRedshiftSort: number
  queuedCfm: number
  activeCfm: number
  activeFetcher: number
  activeAsyncRestController: number
  date: string
}
