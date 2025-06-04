import { ChangeDetectorRef, Component } from '@angular/core';
import { Chart } from 'chart.js';
import { ChartConfig } from '../config/ChartConfig';
import annotationPlugin from 'chartjs-plugin-annotation';
import { DatabasePoolService } from '../service/DatabasePoolService';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-neo-db-pool',
  templateUrl: './neo-db-pool.component.html',
  styleUrls: ['./neo-db-pool.component.css']
})
export class NeoDbPoolComponent {
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
    this.chart = new Chart("NeoPoolPerInstanceChart", {
      type: 'line',

      data: {
        labels: [],
        datasets: [{
          data: [],
          label: "Neo Pool EC2 #1",
          borderColor: "#008080",
          backgroundColor: 'rgba(0, 128, 128, 0.2)',
          fill: true,
          borderWidth: 1.5,
          pointRadius: 0
        }, {
          data: [],
          label: "Neo Pool EC2 #2",
          borderColor: "#ff0062",
          backgroundColor: 'rgba(255, 0, 98, 0.2)',
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
              text: 'Neo Pool active connections',
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
    this.chart.data.datasets[0].data.push(this.databasePoolService.getLastMeasurementForInstance(1).neoConnectionPool);
    this.chart.data.datasets[1].data.push(this.databasePoolService.getLastMeasurementForInstance(2).neoConnectionPool);
    this.chart.data.labels.push(this.databasePoolService.getLastMeasurementForInstance(1).date.split(' ')[1]);
    this.chart.update();
  }

  private loadPastMeasurements(): void {
    forkJoin([this.databasePoolService.loadMeasurementHistory(1), this.databasePoolService.loadMeasurementHistory(2)])
    .subscribe(([dbPoolDataInstance1, dbPoolDataInstance2]) => {
      this.measurementInstance2 = dbPoolDataInstance2.map( m => m.neoConnectionPool);
      this.measurementInstance1 = dbPoolDataInstance1.map( m => m.neoConnectionPool);
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
