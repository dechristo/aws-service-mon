import { ThreadUsage } from './../model/ThreadUsage';
import { HttpClient } from '@angular/common/http';
import { ServerConfig } from '../config/ServerConfig';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
   providedIn: 'root',
})
export class JvmThreadService {
  private threadUsageEndpoint = `${ServerConfig.host}/thread/`
  private threadUsageInstance1: ThreadUsage[];
  private threadUsageInstance2: ThreadUsage[];


  constructor(
    private httpClient: HttpClient
  ) {
    console.info('Instantiating JvmThreadService...');
    this.threadUsageInstance1 = [];
    this.threadUsageInstance2 = [];
    setInterval(() => this.fetchThreadMeasurementForAllInstances(), 3000)
  }

  public getLastMeasurementForInstance(instanceId: number): ThreadUsage {
    if (instanceId === 1) return this.threadUsageInstance1.slice(-1)[0];
    return this.threadUsageInstance2.slice(-1)[0];
  }

  public getAllMeasurementsForInstance(instanceId: number): ThreadUsage[] {
    if (instanceId === 1) return this.threadUsageInstance1;
    return this.threadUsageInstance2;
  }

  public loadMeasurementHistory(instanceId: number): Observable<ThreadUsage[]> {
    return this.httpClient
    .get<ThreadUsage[]>(this.threadUsageEndpoint + 'history/' +  instanceId);
  }

  private fetchThreadMeasurementForAllInstances(): void {
    this.getCurrentThreadMeasuremtForInstance(1, this.threadUsageInstance1);
    this.getCurrentThreadMeasuremtForInstance(2, this.threadUsageInstance2);
  }

  private getCurrentThreadMeasuremtForInstance(instanceId: number, measurements: ThreadUsage[]): void {
   this.httpClient.get<ThreadUsage>(this.threadUsageEndpoint + 'current/' +  instanceId)
    .subscribe({
      next: (data) => {
        if (measurements.length > 14400) {
          measurements = measurements.slice(-14400);
        }
        console.info(data);
        measurements.push(data)
      },
      error: (error)=> {
        console.error(error);
        measurements.push({
          liveThreads: 0,
          date: new Date().toLocaleString()
        })
      }
    });
  }
}
