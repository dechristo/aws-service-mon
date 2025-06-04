import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecutorQueuedRedshiftSortComponent } from './executor-queued-redshift-sort.component';

describe('ExecutorQueuedRedshiftSortComponent', () => {
  let component: ExecutorQueuedRedshiftSortComponent;
  let fixture: ComponentFixture<ExecutorQueuedRedshiftSortComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExecutorQueuedRedshiftSortComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExecutorQueuedRedshiftSortComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
