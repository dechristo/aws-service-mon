import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RedshiftInlineDbPoolChartComponent } from './redshift-inline-db-pool-chart.component';

describe('RedshiftInlineDbPoolChartComponent', () => {
  let component: RedshiftInlineDbPoolChartComponent;
  let fixture: ComponentFixture<RedshiftInlineDbPoolChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RedshiftInlineDbPoolChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RedshiftInlineDbPoolChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
