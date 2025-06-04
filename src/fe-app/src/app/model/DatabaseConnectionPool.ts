export interface DatabaseConnectionPool {
  activeConnections: number
  timeoutConnections: number
  pdwhConnectionPool: number
  jpaConnectionPool: number
  neoConnectionPool: number
  redshiftWetConnectionPool: number
  redshiftInlineConnectionPool: number
  date: string
}
