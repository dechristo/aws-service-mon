import { Component } from '@angular/core';
import { Chart } from 'chart.js';
import { DiskInfo } from '../model/DiskInfo';
import { DiskInfoService } from '../service/DiskInfoService';

@Component({
  selector: 'app-disk-info',
  templateUrl: './disk-info.component.html',
  styleUrls: ['./disk-info.component.css']
})
export class DiskInfoComponent {
  public chart: any;
  public chart2: any;
  private diskInfoInstance1: DiskInfo;
  private diskInfoInstance2: DiskInfo;

  constructor(
    private service: DiskInfoService
  ) {
    this.diskInfoInstance1 = new DiskInfo(0,0);
    this.diskInfoInstance2 = new DiskInfo(0,0);
  }

  createCharts(){
    this.chart = new Chart("FreeDiskChart", {
      type: 'pie',
      data: {
        datasets: [{
          data: [],
          backgroundColor: ["orange", "limegreen"],
        }],
      labels: ["Used", "Available"]
      },
      options: {
         maintainAspectRatio: false,
         plugins: {
          title: {
              display: true,
              text: 'Used Disk Space - AWS EC2 #1',
              font: {
                size: 16
              }
          },
          legend:  {
            position: 'top'
          }
        }
      }
    });
    this.chart.canvas.style.height = '300px';
    this.chart.canvas.style.width = '300px';

    this.chart2 = new Chart("FreeDiskChart2", {
      type: 'pie',
      data: {
        datasets: [{
          data: [],
          backgroundColor: ["orange", "limegreen"]
        }],
        labels: ["Used", "Available"],
      },
      options: {
         maintainAspectRatio: false,
         plugins: {
          title: {
              display: true,
              text: 'Used Disk Space - AWS EC2 #2',
              font: {
                size: 16
              }
          },
          legend:  {
            position: 'top'
          }
        }
      }
    });
    this.chart2.canvas.style.height = '300px';
    this.chart2.canvas.style.width = '300px';
  }

  ngAfterViewInit(): void {
    this.createCharts();
    setInterval(() => {
      this.updateDiskInfo()
    }, 5000)
  }

  ngOnDestroy(): void {
    this.chart.destroy();
    this.chart2.destroy();
  }

  private updateDiskInfo(): void {
    this.diskInfoInstance1 = this.service.getLastMeasurementForInstance(1);
    this.diskInfoInstance2 = this.service.getLastMeasurementForInstance(2);
    this.chart.data.datasets[0].data = [this.diskInfoInstance1.totalSpace - this.diskInfoInstance1.freeSpace, this.diskInfoInstance1.freeSpace];
    this.chart2.data.datasets[0].data = [this.diskInfoInstance2.totalSpace - this.diskInfoInstance2.freeSpace, this.diskInfoInstance2.freeSpace];
    this.chart.update();
    this.chart2.update();
  }
}
