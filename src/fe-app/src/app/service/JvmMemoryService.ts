import { MemoryMeasurement } from './../model/MemoryMeasurement';
import { HttpClient } from '@angular/common/http';
import { ServerConfig } from '../config/ServerConfig';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
   providedIn: 'root',
})
export class JvmMemoryService {
  private usedMemEndpoint = `${ServerConfig.host}/mem/`
  private memoryMeasurementsInstance1: MemoryMeasurement[];
  private memoryMeasurementsInstance2: MemoryMeasurement[];


  constructor(
    private httpClient: HttpClient
  ) {
    console.info('Instantiating JvmMemoryService...');
    this.memoryMeasurementsInstance1 = [];
    this.memoryMeasurementsInstance2 = [];
    setInterval(() => this.fetchMemoryMeasurementForAllInstances(), 2000)
  }

  public getLastMeasurementForInstance(instanceId: number): MemoryMeasurement {
    if (instanceId === 1) return this.memoryMeasurementsInstance1.slice(-1)[0];
    return this.memoryMeasurementsInstance2.slice(-1)[0];
  }

  public getAllMeasurementsForInstance(instanceId: number): MemoryMeasurement[] {
    if (instanceId === 1) return this.memoryMeasurementsInstance1;
    return this.memoryMeasurementsInstance2;
  }

  public loadMeasurementHistory(instanceId: number): Observable<MemoryMeasurement[]> {
    return this.httpClient
    .get<MemoryMeasurement[]>(this.usedMemEndpoint + 'history/' +  instanceId);
  }

  private fetchMemoryMeasurementForAllInstances(): void {
    this.getCurrentMemoryMeasuremtForInstance(1, this.memoryMeasurementsInstance1);
    this.getCurrentMemoryMeasuremtForInstance(2, this.memoryMeasurementsInstance2);
  }

  private getCurrentMemoryMeasuremtForInstance(instanceId: number, measurements: MemoryMeasurement[]): void {
   this.httpClient.get<MemoryMeasurement>(this.usedMemEndpoint + 'current/' +  instanceId)
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
          memoryUsage: 0,
          date: new Date().toLocaleString()
        })
      }
    });
  }
}
