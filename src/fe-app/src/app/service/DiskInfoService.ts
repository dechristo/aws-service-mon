import { HttpClient } from '@angular/common/http';
import { ServerConfig } from '../config/ServerConfig';
import { Injectable } from '@angular/core';
import { DiskInfo } from '../model/DiskInfo';
import { firstValueFrom } from 'rxjs';

@Injectable({
   providedIn: 'root',
})
export class DiskInfoService {
  private httpDiskInfoEndpoint = `${ServerConfig.host}/disk/free/`;
  private diskInfoInstance1: DiskInfo;
  private diskInfoInstance2: DiskInfo;


  constructor(
    private httpClient: HttpClient
  ) {
    console.info('Instantiating DiskInfoService...');
    this.diskInfoInstance1 = new DiskInfo(0 , 0);
    this.diskInfoInstance2 = new DiskInfo(0 , 0);
    setInterval(async () => await this.fetchDiskInfoForAllInstances(), 5000)
  }

  public getLastMeasurementForInstance(instanceId: number): DiskInfo {
    if (instanceId === 1) return this.diskInfoInstance1;
    return this.diskInfoInstance2;
  }

  private async fetchDiskInfoForAllInstances(): Promise<void> {
    this.diskInfoInstance1 = await this.getDiskInfoForInstance(1);
    this.diskInfoInstance2 = await this.getDiskInfoForInstance(2);
  }

  private async getDiskInfoForInstance(instanceId: number): Promise<DiskInfo> {
   let response = this.httpClient.get<DiskInfo>(this.httpDiskInfoEndpoint + instanceId)
   return await firstValueFrom(response);
  }
}
