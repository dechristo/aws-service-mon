import { ChangeDetectorRef, Component } from '@angular/core';
import { Chart } from 'chart.js';
import { ChartConfig } from '../config/ChartConfig';
import { ExecutorService } from '../service/ExecutorService';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-executor-active-fetcher',
  templateUrl: './executor-active-fetcher.component.html',
  styleUrls: ['./executor-active-fetcher.component.css']
})
export class ExecutorActiveFetcherComponent {
  public chart: any;
  private fetcherMeasurementInstance1: number[] = [];
  private fetcherMeasurementInstance2: number[] = [];
  private asyncRestControllerMeasurementInstance1: number[] = [];
  private asyncRestControllerMeasurementInstance2: number[] = [];
  private measurementDates: string[] = [];
  private timer: any;

  constructor(
    private executorService: ExecutorService,
    private changeDetector: ChangeDetectorRef) {}

  createChart(){
    this.chart = new Chart("ExecutorActiveFetcherAndAsyncRestController", {
      type: 'line',

      data: {
        labels: [],
        datasets: [{
          data: [],
          label: "Fetcher #1",
          borderColor: "rgb(255 0 157)",
          backgroundColor: "rgb(255, 36, 171, 0.6)",
          fill: true,
          borderWidth: 1.5,
          pointRadius: 0
        }, {
          data: [],
          label: "Fetcher #2",
          borderColor: "#1FB108",
          backgroundColor: "rgb(68, 255, 0, 0.6)",
          fill: true,
          borderWidth: 1.5,
          pointRadius: 0,
        },{
          data: [],
          label: "AsyncRestController #1",
          borderColor: "rgb(24 58 194)",
          backgroundColor: "rgba(63 151 246 / 0.8)",
          fill: true,
          borderWidth: 1.5,
          pointRadius: 0
        }, {
          data: [],
          label: "AsyncRestController #2",
          borderColor: "rgb(252 102 0)",
          backgroundColor: "rgba(255 129 33 / 0.74)",
          fill: true,
          borderWidth: 1.5,
          pointRadius: 0,
        }],
      },
      options: {
        scales: {
          y: {
            min: 0,
            max: 60,
          }
        },
         //aspectRatio:1.5,
         maintainAspectRatio: false,
         plugins: {
          title: {
              display: true,
              text: 'Active Executors',
              font: {
                size: 16
              }
          }
        }
      }
    });
    this.chart.canvas.style.height = '300px';
    this.chart.canvas.style.width = '1230px';
  }

  ngAfterViewInit(): void {
    this.createChart();
    this.loadPastMeasurements();

    this.timer = setInterval(() => { this.updateChartWithLastMeasurementValues();
    }, 3000);

    this.changeDetector.detectChanges();
  }

  ngOnDestroy(): void {
    this.chart.destroy();
    clearInterval(this.timer);
  }

  private updateChartWithLastMeasurementValues(): void {
    this.chart.data.datasets[0].data.push(this.executorService.getLastMeasurementForInstance(1).activeFetcher);
    this.chart.data.datasets[1].data.push(this.executorService.getLastMeasurementForInstance(2).activeFetcher);
    this.chart.data.datasets[2].data.push(this.executorService.getLastMeasurementForInstance(1).activeAsyncRestController);
    this.chart.data.datasets[3].data.push(this.executorService.getLastMeasurementForInstance(2).activeAsyncRestController);

    this.chart.data.labels.push(this.executorService.getLastMeasurementForInstance(1).date);
    this.chart.update();

    if (this.chart.data.datasets[0].data.length > 1000) {
      this.chart.data.datasets[0].data.shift();
      this.chart.data.datasets[1].data.shift();
      this.chart.data.datasets[2].data.shift();
      this.chart.data.datasets[3].data.shift();
      this.chart.data.labels.shift();
    }
  }

  private loadPastMeasurements(): void {
    forkJoin([this.executorService.loadMeasurementHistory(1), this.executorService.loadMeasurementHistory(2)])
    .subscribe(([dataInstance1, dataInstance2]) => {

      const quantityOfHistoricalDataToLoad = dataInstance1.length > 1000 ? 1000 : Math.min(dataInstance1.length, dataInstance2.length);

      this.fetcherMeasurementInstance2 = dataInstance2.slice(-quantityOfHistoricalDataToLoad).map( m => m.activeFetcher);
      this.fetcherMeasurementInstance1 = dataInstance1.slice(-quantityOfHistoricalDataToLoad).map( m => m.activeFetcher);
      this.asyncRestControllerMeasurementInstance1 = dataInstance2.slice(-quantityOfHistoricalDataToLoad).map( m => m.activeAsyncRestController);
      this.asyncRestControllerMeasurementInstance2 = dataInstance1.slice(-quantityOfHistoricalDataToLoad).map( m => m.activeAsyncRestController);

      this.measurementDates = dataInstance2.slice(-quantityOfHistoricalDataToLoad).map(m => m.date);

      this.chart.data.datasets[0].data = this.fetcherMeasurementInstance1.slice(-quantityOfHistoricalDataToLoad);
      this.chart.data.datasets[1].data = this.fetcherMeasurementInstance2.slice(-quantityOfHistoricalDataToLoad);
      this.chart.data.datasets[2].data = this.asyncRestControllerMeasurementInstance1.slice(-quantityOfHistoricalDataToLoad);
      this.chart.data.datasets[3].data = this.asyncRestControllerMeasurementInstance2.slice(-quantityOfHistoricalDataToLoad);

      this.chart.data.labels = this.measurementDates.slice(-quantityOfHistoricalDataToLoad);
      this.chart.update();
    });
  }
}
