import { Component } from '@angular/core';
import { ProcessInfoService } from '../service/ProcessInfoService';
import { InstanceHealthService } from './../service/InstanceHealthService';
@Component({
  selector: 'app-instance-health',
  templateUrl: './instance-health.component.html',
  styleUrls: ['./instance-health.component.css', '../home/home.component.css']
})
export class InstanceHealthComponent {
  private LOADING = "loading...";
  private miliSecondsInASecond = 1000;
  public chart: any;
  latestHealthCheckInstance1: string;
  latestHealthCheckInstance2: string;
  appStartTimeInstance1: string;
  appStartTimeInstance2: string;
  appStartedDaysInstance1: string;
  appStartedDaysInstance2: string;

  constructor(
    private healhCheckService: InstanceHealthService,
    private processInfoService: ProcessInfoService
  ) {
    this.appStartTimeInstance1 = this.LOADING;
    this.appStartTimeInstance2 = this.LOADING;
    this.appStartedDaysInstance1 = this.LOADING;
    this.appStartedDaysInstance2 = this.LOADING;
    this.latestHealthCheckInstance1 = this.healhCheckService.getInstanceLatestHealthCheck(1).status;
    this.latestHealthCheckInstance2 = this.healhCheckService.getInstanceLatestHealthCheck(2).status;
  }

  ngOnInit(): void {
    this.loadAppStartTimeForBothInstances();

    setInterval(() => {
      this.loadAppStartTimeForBothInstances();
    }, 60000);

    setInterval(() => {
      this.latestHealthCheckInstance1 = this.healhCheckService.getInstanceLatestHealthCheck(1).status;
      this.latestHealthCheckInstance2 = this.healhCheckService.getInstanceLatestHealthCheck(2).status;
    }, 5000)
   }

   private loadAppStartTimeForBothInstances(): void {
    this.processInfoService.getAppstartTimeForBothInstances()
    .subscribe({
      next: (data) => {
        const appStartDateInstance1: any = new Date(data.startTimeAppInstance1 * this.miliSecondsInASecond)
        const appStartDateInstance2: any = new Date(data.startTimeAppInstance2 * this.miliSecondsInASecond)
        this.appStartTimeInstance1 = new Date(appStartDateInstance1).toLocaleString();
        this.appStartTimeInstance2 = new Date(appStartDateInstance2).toLocaleString();
        this.calculateDaysAndHoursFromDateDifference(new Date(appStartDateInstance1), new Date(appStartDateInstance2));
      },
      error: (error)=> {
          console.error(error);
      }
    })
  }

  private calculateDaysAndHoursFromDateDifference(appStartDateInstance1: Date, appStartDateInstance2: Date): void {
    const secondsInAMin = 60;
    const hoursInADay = 24;
    const secondsInAnHour = 60 * secondsInAMin;
    const secondsInADay = 24 * secondsInAnHour;
    const today: Date = new Date()
    let hoursInstance1 = 0;
    let hoursInstance2 = 0;
    const secondsDaysInstance1 = (today.getTime() - appStartDateInstance1.getTime()) / this.miliSecondsInASecond;
    const daysInstance1 = Math.floor(secondsDaysInstance1 / secondsInADay);
    const secondsDaysInstance2 = (today.getTime() - appStartDateInstance2.getTime()) / this.miliSecondsInASecond;
    const daysInstance2 = Math.floor(secondsDaysInstance2 / secondsInADay);

    if (daysInstance1 == 0) {
      hoursInstance1 = Math.abs(today.getHours() + (hoursInADay - appStartDateInstance1.getHours()));

      if (hoursInstance1 >= 24) {
        hoursInstance1 = hoursInstance1 - 24;
      }
    } else {
      if ((hoursInADay - appStartDateInstance1.getHours() + today.getHours()) > 24) {

        hoursInstance1 = Math.abs(appStartDateInstance1.getHours() - today.getHours());
      } else {
        hoursInstance1 = hoursInADay - appStartDateInstance1.getHours() + today.getHours();
        if ((hoursInADay - appStartDateInstance1.getHours() + today.getHours()) === 24) {
          hoursInstance1=0;
        }
      }
    }

    if (daysInstance2 == 0) {
      hoursInstance2 = Math.abs(today.getHours() + ( hoursInADay - appStartDateInstance2.getHours()));

      if (hoursInstance2 >= 24) {
        hoursInstance2 = hoursInstance2 - 24;
      }

    } else {
      if (( hoursInADay - appStartDateInstance2.getHours() + today.getHours()) > 24) {
        hoursInstance2 = Math.abs(appStartDateInstance2.getHours() - today.getHours());

      } else {
        hoursInstance2 = hoursInADay - appStartDateInstance2.getHours() + today.getHours();
        if ((hoursInADay - appStartDateInstance1.getHours() + today.getHours()) === 24) {
          hoursInstance2=0;
        }
      }
    }

    this.appStartedDaysInstance1 = daysInstance1 > 1 ? daysInstance1 + " days " + hoursInstance1 + " hour(s) ago" : daysInstance1 + " day " + hoursInstance1 + " hour(s) ago";
    this.appStartedDaysInstance2 = daysInstance2 > 1 ? daysInstance2 + " days " + hoursInstance2 + " hour(s) ago" : daysInstance2 + " day " + hoursInstance2 + " hour(s) ago";
  }
}
