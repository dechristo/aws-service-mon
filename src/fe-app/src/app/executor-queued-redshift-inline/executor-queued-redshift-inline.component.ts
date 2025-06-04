import { ChangeDetectorRef, Component } from '@angular/core';
import { Chart } from 'chart.js';
import { forkJoin } from 'rxjs';
import { ChartConfig } from '../config/ChartConfig';
import { ExecutorService } from '../service/ExecutorService';

@Component({
  selector: 'app-executor-queued-redshift-inline',
  templateUrl: './executor-queued-redshift-inline.component.html',
  styleUrls: ['./executor-queued-redshift-inline.component.css']
})
export class ExecutorQueuedRedshiftInlineComponent {
  public chart: any;
  private measurementInstance1: number[] = [];
  private measurementInstance2: number[] = [];
  private measurementDates: string[] = [];
  private timer: any;

  constructor(
    private executorService: ExecutorService,
    private changeDetector: ChangeDetectorRef) {}

  createChart(){
    this.chart = new Chart("ExecutorQueuedRedshiftInlineChart", {
      type: 'line',

      data: {
        labels: [],
        datasets: [{
          data: [],
          label: "AWS EC2 #1",
          borderColor: "rgb(182 29 151)",
          backgroundColor: "rgb(248, 35, 195, 0.6)",
          fill: true,
          borderWidth: 1.5,
          pointRadius: 0
        }, {
          data: [],
          label: "AWS EC2 #2",
          borderColor: "rgb(37 223 4)",
          backgroundColor: "rgb(69, 223, 61, 0.5)",
          fill: true,
          borderWidth: 1.5,
          pointRadius: 0,
        }],
      },
      options: {
         //aspectRatio:1.5,
         maintainAspectRatio: false,
         plugins: {
          title: {
              display: true,
              text: 'Executor Queued Redshift Inline Connections',
              font: {
                size: 16
              }
          }
        }
      }
    });
    this.chart.canvas.style.height = '300px';
    this.chart.canvas.style.width = '1050px';
  }

  ngAfterViewInit(): void {
    this.createChart();
    this.loadPastMeasurements();

    this.timer = setInterval(() => {
      this.updateChartWithLastMeasurementValues();
    }, 3000);

    this.changeDetector.detectChanges();
  }

  ngOnDestroy(): void {
    this.chart.destroy();
    clearInterval(this.timer);
  }

  private updateChartWithLastMeasurementValues(): void {
    this.chart.data.datasets[0].data.push(this.executorService.getLastMeasurementForInstance(1).queuedRedshiftInline);
    this.chart.data.datasets[1].data.push(this.executorService.getLastMeasurementForInstance(2).queuedRedshiftInline);
    this.chart.data.labels.push(this.executorService.getLastMeasurementForInstance(1).date);
    this.chart.update();
  }

  private loadPastMeasurements(): void {
    forkJoin([this.executorService.loadMeasurementHistory(1), this.executorService.loadMeasurementHistory(2)])
    .subscribe(([dbPoolDataInstance1, dbPoolDataInstance2]) => {
      this.measurementInstance2 = dbPoolDataInstance2.map( m => m.queuedRedshiftInline);
      this.measurementInstance1 = dbPoolDataInstance1.map( m => m.queuedRedshiftInline);
      this.measurementDates = dbPoolDataInstance2.map(m => m.date);

      const quantityOfHistoricalDataToLoad = ChartConfig.HISTORY_MEASUREMENTS_TO_LOAD < Math.max(this.measurementInstance1.length, this.measurementInstance2.length)
        ? ChartConfig.HISTORY_MEASUREMENTS_TO_LOAD
        : Math.min(this.measurementInstance1.length, this.measurementInstance2.length);

      this.chart.data.datasets[0].data = this.measurementInstance1.slice(-quantityOfHistoricalDataToLoad);
      this.chart.data.datasets[1].data = this.measurementInstance2.slice(-quantityOfHistoricalDataToLoad);
      this.chart.data.labels = this.measurementDates.slice(-quantityOfHistoricalDataToLoad);
      this.chart.update();
    });
  }
}
