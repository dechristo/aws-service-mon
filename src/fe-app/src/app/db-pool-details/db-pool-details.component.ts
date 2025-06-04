import { DatabasePoolService } from './../service/DatabasePoolService';
import { ChangeDetectorRef, Component } from '@angular/core';

@Component({
  selector: 'app-db-pool-details',
  templateUrl: './db-pool-details.component.html',
  styleUrls: ['./db-pool-details.component.css']
})
export class DbPoolDetailsComponent {

  private LOADING = "loading...";

  totalActiveConnections: string = this.LOADING;
  totalTimeoutConnections: string = this.LOADING;
  totalJpaConnections: string = this.LOADING;
  totalNeoConnections: string = this.LOADING;
  totalPdwhConnections: string = this.LOADING;
  totalRedshiftWetConnections: string = this.LOADING;
  totalRedshiftInlineConnections: string = this.LOADING;
  date: string = this.LOADING;

  constructor (
    private service: DatabasePoolService,
    private changeDetector: ChangeDetectorRef) {
    setInterval(() => this.updateDatabaseConnectionPoolDetails(), 5000)
  }

  ngAfterViewInit(): void {
    this.updateDatabaseConnectionPoolDetails();
    this.changeDetector.detectChanges();
  }

  private updateDatabaseConnectionPoolDetails(): void {
    try {
    this.totalActiveConnections = (this.service.getLastMeasurementForInstance(1).activeConnections + this.service.getLastMeasurementForInstance(2).activeConnections).toString();
    this.totalTimeoutConnections = (this.service.getLastMeasurementForInstance(1).timeoutConnections + this.service.getLastMeasurementForInstance(2).timeoutConnections).toString();
    this.totalJpaConnections = (this.service.getLastMeasurementForInstance(1).jpaConnectionPool + this.service.getLastMeasurementForInstance(2).jpaConnectionPool).toString();
    this.totalNeoConnections = (this.service.getLastMeasurementForInstance(1).neoConnectionPool + this.service.getLastMeasurementForInstance(2).neoConnectionPool).toString();
    this.totalPdwhConnections = (this.service.getLastMeasurementForInstance(1).pdwhConnectionPool + this.service.getLastMeasurementForInstance(2).pdwhConnectionPool).toString();
    this.totalRedshiftWetConnections = (this.service.getLastMeasurementForInstance(1).redshiftWetConnectionPool + this.service.getLastMeasurementForInstance(2).redshiftWetConnectionPool).toString();
    this.totalRedshiftInlineConnections = (this.service.getLastMeasurementForInstance(1).redshiftInlineConnectionPool + this.service.getLastMeasurementForInstance(2).redshiftInlineConnectionPool).toString();
    this.date = this.service.getLastMeasurementForInstance(1).date;
    } catch (ex) {}
  }
}
