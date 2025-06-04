import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdwhPoolChartComponent } from './pdwh-pool-chart.component';

describe('PdwhPoolChartComponent', () => {
  let component: PdwhPoolChartComponent;
  let fixture: ComponentFixture<PdwhPoolChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PdwhPoolChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PdwhPoolChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
