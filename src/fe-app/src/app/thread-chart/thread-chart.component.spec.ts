import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreadChartComponent } from './thread-chart.component';

describe('ThreadChartComponent', () => {
  let component: ThreadChartComponent;
  let fixture: ComponentFixture<ThreadChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThreadChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThreadChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
