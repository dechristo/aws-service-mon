import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecutorQueuedRedshiftWetComponent } from './executor-queued-redshift-wet.component';

describe('ExecutorQueuedRedshiftWetComponent', () => {
  let component: ExecutorQueuedRedshiftWetComponent;
  let fixture: ComponentFixture<ExecutorQueuedRedshiftWetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExecutorQueuedRedshiftWetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExecutorQueuedRedshiftWetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
