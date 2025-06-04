import { ChangeDetectorRef, Component, Input } from '@angular/core';
import Chart from 'chart.js/auto';
import { JvmMemoryService } from '../service/JvmMemoryService';
import { forkJoin, min } from 'rxjs';
import annotationPlugin from 'chartjs-plugin-annotation';


@Component({
  selector: 'app-mem-chart',
  templateUrl: './mem-chart.component.html',
  styleUrls: ['./mem-chart.component.css']
})
export class MemChartComponent {

 @Input()
  chartId = '';

  public chart: any;
  private measurementInstance1: number[] = [];
  private measurementInstance2: number[] = [];
  private measurementDates: string[] = [];
  private timer: any;

  constructor(
    private jvmMemoryService: JvmMemoryService,
    private changeDetector: ChangeDetectorRef) {
      Chart.register(annotationPlugin);
    }

  createChart() {
    this.chart = new Chart(this.chartId, {
      type: 'line',
      data: {
        labels:[] ,
        datasets: [{
          data: [],
          label: "AWS EC2 #1",
          borderColor: "#eb1ce0",
          backgroundColor: "rgba(235,28,224,0.28)",
          fill: true,
          pointRadius: 0,
          borderWidth: 1.5
        }, {
          data:[],
          label: "AWS EC2 #2",
          borderColor: "#3feb1c",
          backgroundColor: "rgba(63,235,28,0.28)",
          fill: true,
          pointRadius: 0,
          borderWidth: 1.5
        }],
      },
      options: {
        scales: {
          y: {
            ticks: {
              callback: function(label, index, labels) {
                return Number(label)/1000000000+' GB';
              }
          },
            min: 0,
            max: 210000000000,
          }
        },
        maintainAspectRatio: false,
         plugins: {
          title: {
              display: true,
              text: 'Memory usage (bytes)',
              font: {
                size: 16
              }
          },
          // annotation: {
          //   annotations: {
          //     line: {
          //       type: 'line',
          //       yMin: 256000000000,
          //       yMax: 256000000000,
          //       borderWidth: 1,
          //       borderColor: 'red',
          //     }
          //   }
          // }
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
    }, 2000);

    this.changeDetector.detectChanges();
  }

  ngOnDestroy(): void {
    this.chart.destroy();
    clearInterval(this.timer);
  }

  private updateChartWithLastMeasurementValues(): void {
    this.chart.data.datasets[0].data.push(this.jvmMemoryService.getLastMeasurementForInstance(1).memoryUsage);
    this.chart.data.datasets[1].data.push(this.jvmMemoryService.getLastMeasurementForInstance(2).memoryUsage);
    this.chart.data.labels.push(this.jvmMemoryService.getLastMeasurementForInstance(2).date);

    if (this.chart.data.datasets[0].data.length > 1000) {
      this.chart.data.datasets[0].data.shift();
      this.chart.data.datasets[1].data.shift();
      this.chart.data.labels.shift();
    }
    this.chart.update();
  }

  private loadPastMeasurements(): void {
    forkJoin([this.jvmMemoryService.loadMeasurementHistory(1), this.jvmMemoryService.loadMeasurementHistory(2)])
      .subscribe(([memoryDataInstance1, memoryDataInstance2]) => {
        const quantityOfHistoricalDataToLoad = memoryDataInstance1.length > 1000 ? 1000 : Math.min(memoryDataInstance1.length, memoryDataInstance2.length);
        this.measurementInstance1 = memoryDataInstance1.slice(-quantityOfHistoricalDataToLoad).map( m => m.memoryUsage);
        this.measurementInstance2 = memoryDataInstance2.slice(-quantityOfHistoricalDataToLoad).map( m => m.memoryUsage);
        this.measurementDates = memoryDataInstance2.slice(-quantityOfHistoricalDataToLoad).map(m => m.date);

        this.chart.data.datasets[0].data = this.measurementInstance1.slice(-quantityOfHistoricalDataToLoad);
        this.chart.data.datasets[1].data = this.measurementInstance2.slice(-quantityOfHistoricalDataToLoad);
        this.chart.data.labels = this.measurementDates.slice(-quantityOfHistoricalDataToLoad);
        this.chart.update();
      });
  }
}
