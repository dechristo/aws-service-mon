import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ServerConfig } from "../config/ServerConfig";
import { DatabaseConnectionPool } from "../model/DatabaseConnectionPool";


@Injectable({
  providedIn: 'root',
})
export class DatabasePoolService {
  private dbPoolEndpoint = `${ServerConfig.host}/db/pool/`
  private dbPoolMeasurementsInstance1: DatabaseConnectionPool[];
  private dbPoolMeasurementsInstance2: DatabaseConnectionPool[];

  constructor(
    private httpClient: HttpClient
  ){
    console.info('Instantiating DatabsePoolService...');
    this.dbPoolMeasurementsInstance1 = [];
    this.dbPoolMeasurementsInstance2 = [];
    setInterval(() => this.fetchDbPoolMeasurementForAllInstances(), 2000)
  }

  public getLastMeasurementForInstance(instanceId: number): DatabaseConnectionPool {
    if (instanceId === 1) return this.dbPoolMeasurementsInstance1.slice(-1)[0];
    return this.dbPoolMeasurementsInstance2.slice(-1)[0];
  }

  public getAllMeasurementsForInstance(instanceId: number): DatabaseConnectionPool[] {
    if (instanceId === 1) return this.dbPoolMeasurementsInstance1;
    return this.dbPoolMeasurementsInstance2;
  }

   public loadMeasurementHistory(instanceId: number): Observable<DatabaseConnectionPool[]> {
    return this.httpClient
    .get<DatabaseConnectionPool[]>(this.dbPoolEndpoint + 'history/' +  instanceId);
  }

  private fetchDbPoolMeasurementForAllInstances(): void {
    this.getDbPoolMeasuremtForInstance(1, this.dbPoolMeasurementsInstance1);
    this.getDbPoolMeasuremtForInstance(2, this.dbPoolMeasurementsInstance2);
  }

  private getDbPoolMeasuremtForInstance(instanceId: number, measurements: DatabaseConnectionPool[]): void {
   this.httpClient.get<DatabaseConnectionPool>(this.dbPoolEndpoint + 'current/' + instanceId)
    .subscribe({
      next: (data) => {
        measurements.push(data)
      },
      error: (error)=> {
        console.error(error);
        measurements.push({
          activeConnections: 0,
          timeoutConnections: 0,
          pdwhConnectionPool: 0,
          jpaConnectionPool: 0,
          neoConnectionPool: 0,
          redshiftWetConnectionPool: 0,
          redshiftInlineConnectionPool: 0,
          date: new Date().toLocaleString()
        })
      }
    });
  }

}
