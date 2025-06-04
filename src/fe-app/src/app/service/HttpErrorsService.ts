import { HttpErrors } from './../model/HttpErrors';
import { HttpClient } from '@angular/common/http';
import { ServerConfig } from '../config/ServerConfig';
import { Injectable } from '@angular/core';

@Injectable({
   providedIn: 'root',
})
export class HttpErrorsService {
  private httpErrorsEndpoint = `${ServerConfig.host}/http-errors/`
  private httpErrorsInstance1: HttpErrors[];
  private httpErrorsInstance2: HttpErrors[];


  constructor(
    private httpClient: HttpClient
  ) {
    console.info('Instantiating HttpErrorsService...');
    this.httpErrorsInstance1 = [];
    this.httpErrorsInstance2 = [];
    setInterval(() => this.fetchHttpErrorsForAllInstances(), 3000)
  }

  public getLastMeasurementForInstance(instanceId: number): HttpErrors {
    if (instanceId === 1) return this.httpErrorsInstance1.slice(-1)[0];
    return this.httpErrorsInstance2.slice(-1)[0];
  }

  public getAllMeasurementsForInstance(instanceId: number): HttpErrors[] {
    if (instanceId === 1) return this.httpErrorsInstance1;
    return this.httpErrorsInstance2;
  }

  private fetchHttpErrorsForAllInstances(): void {
    this.getHttpErrorsForInstance(1, this.httpErrorsInstance1);
    this.getHttpErrorsForInstance(2, this.httpErrorsInstance2);
  }

  private getHttpErrorsForInstance(instanceId: number, measurements: HttpErrors[]): void {
   this.httpClient.get<HttpErrors>(this.httpErrorsEndpoint + instanceId)
    .subscribe({
      next: (data) => {
        measurements.push(new HttpErrors(data.total5xx, data.total4xx));
      },
      error: (error)=> {
        console.error(error);
        measurements.push(new HttpErrors(0,0));
      }
    });
  }
}
