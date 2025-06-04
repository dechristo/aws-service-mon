import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TomcatActiveSessionsChartComponent } from './tomcat-active-sessions-chart.component';

describe('TomcatActiveSessionsChartComponent', () => {
  let component: TomcatActiveSessionsChartComponent;
  let fixture: ComponentFixture<TomcatActiveSessionsChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TomcatActiveSessionsChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TomcatActiveSessionsChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
