export class DatabasePoolDetails {
  constructor(
  public maxActiveConnections: number,
  public maxActiveConnectionsDate: string,
  public maxJpaConnectionPool: number,
  public maxJpaConnectionPoolDate: string
  ) {}
}
