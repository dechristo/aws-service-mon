import { ExecutorTasks } from './../model/ExecutorTasks';
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ServerConfig } from "../config/ServerConfig";
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class ExecutorService {
  private executorEndpoint = `${ServerConfig.host}/executor/`
  private executorMeasurementsInstance1: ExecutorTasks[];
  private executorMeasurementsInstance2: ExecutorTasks[];

  constructor(
    private httpClient: HttpClient
  ){
    console.info('Instantiating ExecutorService...');
    this.executorMeasurementsInstance1 = [];
    this.executorMeasurementsInstance2 = [];
    setInterval(() => this.fetchExecutorMeasurementForAllInstances(), 5000)
  }

  public getLastMeasurementForInstance(instanceId: number): ExecutorTasks {
    if (instanceId === 1) return this.executorMeasurementsInstance1.slice(-1)[0];
    return this.executorMeasurementsInstance2.slice(-1)[0];
  }

  public getAllMeasurementsForInstance(instanceId: number): ExecutorTasks[] {
    if (instanceId === 1) return this.executorMeasurementsInstance1;
    return this.executorMeasurementsInstance2;
  }

  public loadMeasurementHistory(instanceId: number): Observable<ExecutorTasks[]> {
    return this.httpClient
    .get<ExecutorTasks[]>(this.executorEndpoint + 'history/' +  instanceId);
  }

  private fetchExecutorMeasurementForAllInstances(): void {
    this.getExecutorMeasuremtForInstance(1, this.executorMeasurementsInstance1);
    this.getExecutorMeasuremtForInstance(2, this.executorMeasurementsInstance2);
  }

  private getExecutorMeasuremtForInstance(instanceId: number, measurements: ExecutorTasks[]): void {
   this.httpClient.get<ExecutorTasks>(this.executorEndpoint + 'current/' + instanceId)
    .subscribe({
      next: (data) => {
        measurements.push(data)
      },
      error: (error)=> {
        console.error(error);
        measurements.push({
          active: 0,
          queued: 0,
          activeRedshiftWet: 0,
          queuedRedshiftWet: 0,
          activeRedshiftInline: 0,
          queuedRedshiftInline: 0,
          activeRedshiftSort: 0,
          queuedRedshiftSort: 0,
          activeCfm: 0,
          queuedCfm: 0,
          activeFetcher: 0,
          activeAsyncRestController: 0,
          date: new Date().toLocaleString()
        })
      }
    });
  }
}
