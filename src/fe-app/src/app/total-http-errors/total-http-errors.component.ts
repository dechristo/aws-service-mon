import { HttpErrors } from './../model/HttpErrors';
import { ChangeDetectorRef, Component } from '@angular/core';
import { HttpErrorsService} from './../service/HttpErrorsService';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-total-http-errors',
  templateUrl: './total-http-errors.component.html',
  styleUrls: ['./total-http-errors.component.css']
})
export class TotalHttpErrorsComponent {
  public chart: any;
  public totalHttpErrors: HttpErrors
  private timer: any;

  constructor(
    private httpErrorsService: HttpErrorsService,
    private changeDetector: ChangeDetectorRef) {
    this.totalHttpErrors = new HttpErrors(0,0);
  }

  createChart(){
    const plugin = {
      // id: 'customCanvasBackgroundColor',
      // beforeDraw: (chart: { width?: any; height?: any; ctx?: any; }, args: any, options: { color: string; }) => {
      //   const {ctx} = chart;
      //   ctx.save();
      //   ctx.globalCompositeOperation = 'destination-over';
      //   ctx.fillStyle = options.color || '#black';
      //   ctx.fillRect(0, 0, chart.width, chart.height);
      //   ctx.restore();
      // }
    };

    this.chart = new Chart("HttpTotalErrorsActiveChart", {
      type: 'bar',
      data: {
        labels: [],
        datasets: [{
          data: [],
          label: "4xx",
          backgroundColor: "orange",
         // fill: false,
          borderWidth: 1.5,
          //pointRadius: 0
        }, {
          data:[],
          label: "5xx",
          backgroundColor: "red",
          //fill: false,
          //borderWidth: 1.5,
          //pointRadius: 0,
        }],
      },
      options: {
         //aspectRatio:1.5,
         maintainAspectRatio: false,
         plugins: {
          title: {
              display: true,
              text: 'Total Http Errors',
              font: {
                size: 16
              }
          },
        },
      },
      //plugins: [plugin],
    });
    this.chart.canvas.style.height = '300px';
    this.chart.canvas.style.width = '450px';
    // this.chart.options.scales['x'].beginAtZero = true;
    // this.chart.options.scales['y'].beginAtZero = true;
    // this.chart.options.scales['y'].ticks.color='#FFF';
    // this.chart.options.scales['x'].ticks.color='#FFF';
    // this.chart.options.scales['y'].grid.color='#FFF';
    // this.chart.options.scales['x'].grid.color='#FFF';
    this.chart.update();
  }

  ngAfterViewInit(): void {
    this.createChart();
    this.timer = setInterval(() => {
      this.updateTotalHttpErrors();
    }, 3000);

    this.changeDetector.detectChanges();
  }

  ngOnDestroy(): void {
    this.chart.destroy();
    clearInterval(this.timer);
  }

  private updateTotalHttpErrors(): void {
    this.totalHttpErrors.total4xx = this.httpErrorsService.getLastMeasurementForInstance(1).total4xx + this.httpErrorsService.getLastMeasurementForInstance(2).total4xx;
    this.totalHttpErrors.total5xx = this.httpErrorsService.getLastMeasurementForInstance(1).total5xx + this.httpErrorsService.getLastMeasurementForInstance(2).total5xx;
    this.chart.data.datasets[0].data.pop();
    this.chart.data.datasets[1].data.pop();
    this.chart.data.labels.pop();
    this.chart.data.datasets[0].data.push(this.totalHttpErrors.total4xx);
    this.chart.data.datasets[1].data.push(this.totalHttpErrors.total5xx);
    this.chart.data.labels.push(new Date().toLocaleTimeString().split(" ")[0]);
    this.chart.update('none');
  }
}
