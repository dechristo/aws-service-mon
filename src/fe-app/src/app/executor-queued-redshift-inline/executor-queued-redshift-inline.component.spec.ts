import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecutorQueuedRedshiftInlineComponent } from './executor-queued-redshift-inline.component';

describe('ExecutorQueuedRedshiftInlineComponent', () => {
  let component: ExecutorQueuedRedshiftInlineComponent;
  let fixture: ComponentFixture<ExecutorQueuedRedshiftInlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExecutorQueuedRedshiftInlineComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExecutorQueuedRedshiftInlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
