import { InstanceHealth } from './../model/InstanceHealth';
import { HttpClient } from '@angular/common/http';
import { ServerConfig } from '../config/ServerConfig';
import { Injectable } from '@angular/core';

@Injectable({
   providedIn: 'root',
})
export class InstanceHealthService {
  private healthCheckEndpoint = `${ServerConfig.host}/health/`
  private INSTANCE_STATUS_UNKNOWN = "UNKNOWN";
  private latestHealthCheckInstance1: InstanceHealth;
  private latestHealthCheckInstance2: InstanceHealth;


  constructor(
    private httpClient: HttpClient
  ) {
    this.latestHealthCheckInstance1 = { status:  this.INSTANCE_STATUS_UNKNOWN }
    this.latestHealthCheckInstance2 = { status:  this.INSTANCE_STATUS_UNKNOWN }
    setInterval(() => this.updateInstancesHealth(), 1000)
  }

  public getInstanceLatestHealthCheck(instanceId: number): InstanceHealth {
    if (instanceId === 1) return this.latestHealthCheckInstance1;
    if (instanceId === 2) return this.latestHealthCheckInstance2;
    return { status: this.INSTANCE_STATUS_UNKNOWN };
  }

  private updateInstancesHealth(): void {
    this.getInstanceHealth(1, this.latestHealthCheckInstance1);
    this.getInstanceHealth(2, this.latestHealthCheckInstance2);
  }

  private getInstanceHealth(instanceId: number, latestHealthCheck: InstanceHealth): void {
    this.httpClient.get<InstanceHealth>(this.healthCheckEndpoint + instanceId)
    .subscribe({
      next: (data) => {
        latestHealthCheck.status = data.status;
      },
      error: (error)=> {
         console.error(error);
         latestHealthCheck.status = this.INSTANCE_STATUS_UNKNOWN;
      }
    }
  )};
 }
