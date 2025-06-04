import { ChangeDetectorRef, Component } from '@angular/core';
import Chart from 'chart.js/auto';
import { forkJoin, min } from 'rxjs';
import annotationPlugin from 'chartjs-plugin-annotation';
import { JvmThreadService } from '../service/JvmThreadService';

@Component({
  selector: 'app-thread-chart',
  templateUrl: './thread-chart.component.html',
  styleUrls: ['./thread-chart.component.css']
})
export class ThreadChartComponent {

  public chart: any;
  private measurementInstance1: number[] = [];
  private measurementInstance2: number[] = [];
  private measurementDates: string[] = [];
  private timer: any;

  constructor(
    private jvmThreadService: JvmThreadService,
    private changeDetector: ChangeDetectorRef) {
      Chart.register(annotationPlugin);
    }

  createChart() {
    this.chart = new Chart('JvmThreadChart', {
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
            max: 2000,
          }
        },
        maintainAspectRatio: false,
         plugins: {
          title: {
              display: true,
              text: 'Live Threads (daemon + non-daemon)',
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
    this.chart.data.datasets[0].data.push(this.jvmThreadService.getLastMeasurementForInstance(1).liveThreads);
    this.chart.data.datasets[1].data.push(this.jvmThreadService.getLastMeasurementForInstance(2).liveThreads);
    this.chart.data.labels.push(this.jvmThreadService.getLastMeasurementForInstance(2).date);

    if (this.chart.data.datasets[0].data.length > 1000) {
      this.chart.data.datasets[0].data.shift();
      this.chart.data.datasets[1].data.shift();
      this.chart.data.labels.shift();
    }
    this.chart.update();
  }

  private loadPastMeasurements(): void {
    forkJoin([this.jvmThreadService.loadMeasurementHistory(1), this.jvmThreadService.loadMeasurementHistory(2)])
      .subscribe(([threadsDataInstance1, threadDataInstance2]) => {
        const quantityOfHistoricalDataToLoad = threadsDataInstance1.length > 1000 ? 1000 : Math.min(threadsDataInstance1.length, threadDataInstance2.length);
        this.measurementInstance1 = threadsDataInstance1.slice(-quantityOfHistoricalDataToLoad).map( m => m.liveThreads);
        this.measurementInstance2 = threadDataInstance2.slice(-quantityOfHistoricalDataToLoad).map( m => m.liveThreads);
        this.measurementDates = threadDataInstance2.slice(-quantityOfHistoricalDataToLoad).map(m => m.date);

        this.chart.data.datasets[0].data = this.measurementInstance1.slice(-quantityOfHistoricalDataToLoad);
        this.chart.data.datasets[1].data = this.measurementInstance2.slice(-quantityOfHistoricalDataToLoad);
        this.chart.data.labels = this.measurementDates.slice(-quantityOfHistoricalDataToLoad);
        this.chart.update();
      });
  }
}
