import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { Chart } from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import { forkJoin } from 'rxjs';
import { ChartConfig } from '../config/ChartConfig';
import { DatabasePoolService } from '../service/DatabasePoolService';

@Component({
  selector: 'app-db-pool-total-active-chart',
  templateUrl: './db-pool-total-active-chart.component.html',
  styleUrls: ['./db-pool-total-active-chart.component.css']
})
export class DbPoolTotalActiveChartComponent {
  @Input()
  chartId = '';

  public chart: any;
  private measurementInstance1: number[] = [];
  private measurementInstance2: number[] = [];
  private measurementDates: string[] = [];
  private timer: any;


  constructor(
    private databasePoolService: DatabasePoolService,
    private changeDetector: ChangeDetectorRef) {
      Chart.register(annotationPlugin);
    }

  createChart(){
    this.chart = new Chart(this.chartId, {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          data: [],
          label: "AWS EC2 #1",
          borderColor: "rgb(235,228,34)",
          backgroundColor: "rgba(231,227,30,0.1)",
          fill: true,
          borderWidth: 1.5,
          pointRadius: 0
        }, {
          data: [],
          label: "AWS EC2 #2",
          borderColor: "rgb(0,110,220)",
          backgroundColor: "rgba(21,134,232,0.1)",
          fill: true,
          borderWidth: 1.5,
          pointRadius: 0,
        }],
      },
      options: {
        maintainAspectRatio: false,
         //aspectRatio:1.5,
         plugins: {
          title: {
            display: true,
            text: 'Total Db Active Connections',
            font: {
              size: 16
            }
          },
          annotation: {
            annotations: {
              line: {
                type: 'line',
                yMax: 340,
                yMin: 340,
                borderWidth: 1,
                borderColor: 'red',
              }
            }
          }
        }
      }
    });
    this.chart.canvas.style.height = '230px';
    this.chart.canvas.style.width = '1050px';
  }
  ngAfterViewInit(): void {
    this.createChart();
    this.loadPastMeasurements();
    this.timer = setInterval(() => {
      this.updateChartWithLastMeasurementValues();
    }, 2000);

    this.changeDetector.detectChanges();
  }

  ngOnDestroy(): void {
    this.chart.destroy();
    clearInterval(this.timer);
  }

  private updateChartWithLastMeasurementValues(): void {
    this.chart.data.datasets[0].data.push(this.databasePoolService.getLastMeasurementForInstance(1).activeConnections);
    this.chart.data.datasets[1].data.push(this.databasePoolService.getLastMeasurementForInstance(2).activeConnections);
    this.chart.data.labels.push(this.databasePoolService.getLastMeasurementForInstance(1).date.split(' ')[1]);
    this.chart.options.scales['x'].beginAtZero = true;
    this.chart.options.scales['y'].beginAtZero = true;
    this.chart.update();
  }

  private loadPastMeasurements(): void {
    forkJoin([this.databasePoolService.loadMeasurementHistory(1), this.databasePoolService.loadMeasurementHistory(2)])
      .subscribe(([dbPoolDataInstance1, dbPoolDataInstance2]) => {
        this.measurementInstance2 = dbPoolDataInstance2.map( m => m.activeConnections);
        this.measurementInstance1 = dbPoolDataInstance1.map( m => m.activeConnections);
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
