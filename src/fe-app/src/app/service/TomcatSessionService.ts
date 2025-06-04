import { TomcatSession } from '../model/TomcatSession';
import { HttpClient } from '@angular/common/http';
import { ServerConfig } from '../config/ServerConfig';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
   providedIn: 'root',
})
export class TomcatSessionService {
  private tomcatSessionsEndpoint = `${ServerConfig.host}/tomcat-session/`
  private tomcatSessionsInstance1: TomcatSession[];
  private tomcatSessionInstance2: TomcatSession[];


  constructor(
    private httpClient: HttpClient
  ) {
    console.info('Instantiating TomcatSessionService...');
    this.tomcatSessionsInstance1 = [];
    this.tomcatSessionInstance2 = [];
    setInterval(() => this.fetchTomcatSessionsForAllInstances(), 3000)
  }

  public getLastMeasurementForInstance(instanceId: number): TomcatSession {
    if (instanceId === 1) return this.tomcatSessionsInstance1.slice(-1)[0];
    return this.tomcatSessionInstance2.slice(-1)[0];
  }

  public getAllMeasurementsForInstance(instanceId: number): TomcatSession[] {
    if (instanceId === 1) return this.tomcatSessionsInstance1;
    return this.tomcatSessionInstance2;
  }

  public loadMeasurementHistory(instanceId: number): Observable<TomcatSession[]> {
    return this.httpClient
    .get<TomcatSession[]>(this.tomcatSessionsEndpoint + 'history/active/' +  instanceId);
  }

  private fetchTomcatSessionsForAllInstances(): void {
    this.getTomcatSessionsMeasuremtForInstance(1, this.tomcatSessionsInstance1);
    this.getTomcatSessionsMeasuremtForInstance(2, this.tomcatSessionInstance2);
  }

  private getTomcatSessionsMeasuremtForInstance(instanceId: number, measurements: TomcatSession[]): void {
   this.httpClient.get<TomcatSession>(this.tomcatSessionsEndpoint + 'current/active/' +  instanceId)
    .subscribe({
      next: (data) => {
        if (measurements.length > 14400) {
          measurements = measurements.slice(-14400);
        }
        measurements.push(data)
      },
      error: (error)=> {
        console.error(error);
        measurements.push({
          active: 0,
          date: new Date().toLocaleString()
        })
      }
    });
  }
}


