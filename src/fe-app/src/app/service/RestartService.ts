import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ServerConfig } from "../config/ServerConfig";


@Injectable({
  providedIn: 'root',
})
export class RestartService {
  private serverRestartEndpoint = `${ServerConfig.host}/app/restart`

  constructor(
    private httpClient: HttpClient
  ) {
      console.info('Instantiating RestartService...');
    }


  public restartBackendServer(): void {
   this.httpClient.get(this.serverRestartEndpoint)
    .subscribe({
      next: (data) => {
       console.info("Backend restarted...");
      },
      error: (error)=> {
        console.error("Error restarting backend: " + error);
      }
    });
  }
}
