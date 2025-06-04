import { ChangeDetectorRef, Component } from '@angular/core';
import Chart from 'chart.js/auto';
import { forkJoin, min } from 'rxjs';
import annotationPlugin from 'chartjs-plugin-annotation';
import { TomcatSessionService } from '../service/TomcatSessionService';

@Component({
  selector: 'app-tomcat-active-sessions-chart',
  templateUrl: './tomcat-active-sessions-chart.component.html',
  styleUrls: ['./tomcat-active-sessions-chart.component.css']
})
export class TomcatActiveSessionsChartComponent {
  public chart: any;
  private measurementInstance1: number[] = [];
  private measurementInstance2: number[] = [];
  private measurementDates: string[] = [];
  private timer: any;

  constructor(
    private tomcatSessionService: TomcatSessionService,
    private changeDetector: ChangeDetectorRef) {
      Chart.register(annotationPlugin);
    }

  createChart() {
    this.chart = new Chart('TomcatActiveSessionsChart', {
      type: 'line',
      data: {
        labels:[] ,
        datasets: [{
          data: [],
          label: "AWS EC2 #1",
          borderColor: "#eb1ce0",
          backgroundColor: "#eb1ce0",
          fill: false,
          pointRadius: 1,
          borderWidth: 1.5
        }, {
          data:[],
          label: "AWS EC2 #2",
          borderColor: "rgb(30 194 2)",
          backgroundColor: "rgb(30 194 2)",
          fill: false,
          pointRadius: 1,
          borderWidth: 1.5
        }],
      },
      options: {
        scales: {
          y: {
            min: 0,
            max: 7000,
          }
        },
        maintainAspectRatio: false,
         plugins: {
          title: {
              display: true,
              text: 'Tomcat Active Sessions',
              font: {
                size: 16
              }
          },
        }
      }
    });
    this.chart.canvas.style.height = '300px';
    this.chart.canvas.style.width = '1230px';
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
    this.chart.data.datasets[0].data.push(this.tomcatSessionService.getLastMeasurementForInstance(1).active);
    this.chart.data.datasets[1].data.push(this.tomcatSessionService.getLastMeasurementForInstance(2).active);
    this.chart.data.labels.push(this.tomcatSessionService.getLastMeasurementForInstance(2).date);

    if (this.chart.data.datasets[0].data.length > 1000) {
      this.chart.data.datasets[0].data.shift();
      this.chart.data.datasets[1].data.shift();
      this.chart.data.labels.shift();
    }
    this.chart.update();
  }

  private loadPastMeasurements(): void {
    forkJoin([this.tomcatSessionService.loadMeasurementHistory(1), this.tomcatSessionService.loadMeasurementHistory(2)])
      .subscribe(([tomcatSessionsDataInstance1, tomcatSessionsDataInstance2]) => {
        const quantityOfHistoricalDataToLoad = tomcatSessionsDataInstance1.length > 1000 ? 1000 : Math.min(tomcatSessionsDataInstance1.length, tomcatSessionsDataInstance2.length);
        this.measurementInstance1 = tomcatSessionsDataInstance1.slice(-quantityOfHistoricalDataToLoad).map( m => m.active);
        this.measurementInstance2 = tomcatSessionsDataInstance2.slice(-quantityOfHistoricalDataToLoad).map( m => m.active);
        this.measurementDates = tomcatSessionsDataInstance2.slice(-quantityOfHistoricalDataToLoad).map(m => m.date);

        this.chart.data.datasets[0].data = this.measurementInstance1.slice(-quantityOfHistoricalDataToLoad);
        this.chart.data.datasets[1].data = this.measurementInstance2.slice(-quantityOfHistoricalDataToLoad);
        this.chart.data.labels = this.measurementDates.slice(-quantityOfHistoricalDataToLoad);
        this.chart.update();
      });
  }
}
