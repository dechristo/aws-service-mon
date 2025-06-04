import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { Chart } from 'chart.js';
import { ChartConfig } from '../config/ChartConfig';
import { DatabasePoolService } from '../service/DatabasePoolService';
import annotationPlugin from 'chartjs-plugin-annotation';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-db-total-timeout',
  templateUrl: './db-total-timeout.component.html',
  styleUrls: ['./db-total-timeout.component.css']
})
export class DbTotalTimeoutComponent {
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
          borderColor: "orange",
          backgroundColor: "rgba(251,174,20,0.28)",
          fill: true,
          borderWidth: 1.5,
          pointRadius: 0
        }, {
          data: [],
          label: "AWS EC2 #2",
          borderColor: "rgb(0,110,220)",
          backgroundColor: "rgba(14,82,141,0.25)",
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
            text: 'Total Db Timeout Connections (' + (new Date()).getDay() + '/' + (new Date()).getMonth() + '/' + (new Date()).getFullYear() + ')',
            font: {
              size: 16
            }
          },
        }
      }
    });
    this.chart.canvas.style.height = '230px';
    this.chart.canvas.style.width = '450px';
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
    this.chart.data.datasets[0].data.push(this.databasePoolService.getLastMeasurementForInstance(1).timeoutConnections);
    this.chart.data.datasets[1].data.push(this.databasePoolService.getLastMeasurementForInstance(2).timeoutConnections);
    this.chart.data.labels.push(this.databasePoolService.getLastMeasurementForInstance(1).date.split(" ")[1]);
    if (this.chart.data.datasets[0].data.length > 2000) {
      this.chart.data.datasets[0].data.shift();
      this.chart.data.datasets[1].data.shift();
      this.chart.data.labels.shift();
    }
    this.chart.options.scales['x'].beginAtZero = true;
    this.chart.options.scales['y'].beginAtZero = true;
    this.chart.update();
  }

  private loadPastMeasurements(): void {
    forkJoin([this.databasePoolService.loadMeasurementHistory(1), this.databasePoolService.loadMeasurementHistory(2)])
      .subscribe(([dbPoolDataInstance1, dbPoolDataInstance2]) => {
        this.measurementInstance2 = dbPoolDataInstance2.slice(-500).map( m => m.timeoutConnections);
        this.measurementInstance1 = dbPoolDataInstance1.slice(-500).map( m => m.timeoutConnections);
        this.measurementDates = dbPoolDataInstance2.slice(-500).map(m => m.date.split(" ")[1]);

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
