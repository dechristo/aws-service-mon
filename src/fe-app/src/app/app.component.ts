import { Component, ViewEncapsulation } from '@angular/core';
import { RestartService } from './service/RestartService';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  title = 'fe-app';

  constructor(
    private restartService: RestartService
  ) {}

  public  confirmServerRestart(): void {
    const confirmServerRestart = confirm("Restart AwsMon backend?");
    if (confirmServerRestart) {
      this.restartService.restartBackendServer();
    }
  }
}
