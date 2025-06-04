import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ServerConfig } from "../config/ServerConfig";
import { ProcessInfo } from "../model/ProcessInfo";

@Injectable({
  providedIn: 'root',
})
export class ProcessInfoService {
  private appStartTimeEndpoint = `${ServerConfig.host}/process/app-start-time`

  constructor(
    private httpClient: HttpClient
  ) {}

  public getAppstartTimeForBothInstances(): Observable<ProcessInfo> {
    return this.httpClient.get<ProcessInfo>(this.appStartTimeEndpoint)
  }
}
