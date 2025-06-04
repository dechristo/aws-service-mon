import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecutorRedshiftWetViewComponent } from './executor-redshift-wet-view.component';

describe('ExecutorRedshiftWetViewComponent', () => {
  let component: ExecutorRedshiftWetViewComponent;
  let fixture: ComponentFixture<ExecutorRedshiftWetViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExecutorRedshiftWetViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExecutorRedshiftWetViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
