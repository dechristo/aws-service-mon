import { DatabasePoolService } from './../service/DatabasePoolService';
import { ChangeDetectorRef, Component } from '@angular/core';
import { Chart } from 'chart.js';
import { ChartConfig } from '../config/ChartConfig';
import annotationPlugin from 'chartjs-plugin-annotation';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-jpa-pool-chart',
  templateUrl: './jpa-pool-chart.component.html',
  styleUrls: ['./jpa-pool-chart.component.css']
})
export class JpaPoolChartComponent {
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
    this.chart = new Chart("JpaPoolPerInstanceActiveChart", {
      type: 'line',

      data: {
        labels: [],
        datasets: [{
          data: [],
          label: "Jpa Pool EC2 #1",
          borderColor: "#f08102",
          backgroundColor: 'rgba(240, 129, 2, 0.2)',
          fill: true,
          borderWidth: 1.5,
          pointRadius: 0
        }, {
          data: [],
          label: "Jpa Pool EC2 #2",
          borderColor: "#07b7fc",
          backgroundColor: 'rgba(7, 183, 252, 0.2)',
          fill: true,
          borderWidth: 1.5,
          pointRadius: 0
        }],
      },
      options: {
         //aspectRatio:1.5
         maintainAspectRatio: false,
         plugins: {
          title: {
              display: true,
              text: 'Jpa Pool active connections',
              font: {
                size: 16
              }
          },
          annotation: {
            annotations: {
              line: {
                type: 'line',
                yMax: 100,
                yMin: 100,
                borderWidth: 1,
                borderColor: 'red',
              }
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
    }, 5000);

    this.changeDetector.detectChanges();
  }

  ngOnDestroy(): void {
    this.chart.destroy();
    clearInterval(this.timer);
  }

  private updateChartWithLastMeasurementValues(): void {
    this.chart.data.datasets[0].data.push(this.databasePoolService.getLastMeasurementForInstance(1).jpaConnectionPool);
    this.chart.data.datasets[1].data.push(this.databasePoolService.getLastMeasurementForInstance(2).jpaConnectionPool);
    this.chart.data.labels.push(this.databasePoolService.getLastMeasurementForInstance(1).date.split(' ')[1]);
    this.chart.update();
  }

  private loadPastMeasurements(): void {
    forkJoin([this.databasePoolService.loadMeasurementHistory(1), this.databasePoolService.loadMeasurementHistory(2)])
    .subscribe(([dbPoolDataInstance1, dbPoolDataInstance2]) => {
      this.measurementInstance2 = dbPoolDataInstance2.map( m => m.jpaConnectionPool);
      this.measurementInstance1 = dbPoolDataInstance1.map( m => m.jpaConnectionPool);
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
