import { ChangeDetectorRef, Component } from '@angular/core';
import { Chart } from 'chart.js';
import { ChartConfig } from '../config/ChartConfig';
import annotationPlugin from 'chartjs-plugin-annotation';
import { DatabasePoolService } from '../service/DatabasePoolService';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-pdwh-pool-chart',
  templateUrl: './pdwh-pool-chart.component.html',
  styleUrls: ['./pdwh-pool-chart.component.css']
})

export class PdwhPoolChartComponent {
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
    this.chart = new Chart("PdwhPoolPerInstanceActiveChart", {
      type: 'line',

      data: {
        labels: [],
        datasets: [{
          data:[],
          label: "Pdwh Pool EC2 #1",
          borderColor: "#ef0b4f",
          backgroundColor: "#ef0b4f",
          fill: false,
          borderWidth: 1.5,
          pointRadius: 0
        }, {
          data: [],
          label: "Pdwh Pool EC2 #2",
          borderColor: "#0086d3",
          backgroundColor: "#0086d3",
          fill: false,
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
            text: 'Pdwh pool active connections',
            font: {
              size: 16
            }
          },
          annotation: {
            annotations: {
              line: {
                type: 'line',
                yMax: 30,
                yMin: 30,
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
    this.chart.data.datasets[0].data.push(this.databasePoolService.getLastMeasurementForInstance(1).pdwhConnectionPool);
    this.chart.data.datasets[1].data.push(this.databasePoolService.getLastMeasurementForInstance(2).pdwhConnectionPool);
    this.chart.data.labels.push(this.databasePoolService.getLastMeasurementForInstance(1).date.split(' ')[1]);
    this.chart.update();
  }

  private loadPastMeasurements(): void {
    forkJoin([this.databasePoolService.loadMeasurementHistory(1), this.databasePoolService.loadMeasurementHistory(2)])
    .subscribe(([dbPoolDataInstance1, dbPoolDataInstance2]) => {
      this.measurementInstance2 = dbPoolDataInstance2.map( m => m.pdwhConnectionPool);
      this.measurementInstance1 = dbPoolDataInstance1.map( m => m.pdwhConnectionPool);
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
