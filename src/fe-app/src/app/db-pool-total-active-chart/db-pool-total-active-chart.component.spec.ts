import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DbPoolTotalActiveChartComponent } from './db-pool-total-active-chart.component';

describe('DbPoolChartComponent', () => {
  let component: DbPoolTotalActiveChartComponent;
  let fixture: ComponentFixture<DbPoolTotalActiveChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DbPoolTotalActiveChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DbPoolTotalActiveChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
