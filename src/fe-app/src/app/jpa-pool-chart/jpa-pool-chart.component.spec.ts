import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JpaPoolChartComponent } from './jpa-pool-chart.component';

describe('JpaPoolChartComponent', () => {
  let component: JpaPoolChartComponent;
  let fixture: ComponentFixture<JpaPoolChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JpaPoolChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JpaPoolChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
