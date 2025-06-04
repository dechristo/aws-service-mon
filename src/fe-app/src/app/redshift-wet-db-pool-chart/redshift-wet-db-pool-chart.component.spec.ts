import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RedshiftWetDbPoolChartComponent } from './redshift-wet-db-pool-chart.component';

describe('RedshiftWetDbPoolChartComponent', () => {
  let component: RedshiftWetDbPoolChartComponent;
  let fixture: ComponentFixture<RedshiftWetDbPoolChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RedshiftWetDbPoolChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RedshiftWetDbPoolChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
