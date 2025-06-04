import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecutorQueuedTotalComponent } from './executor-queued-total.component';

describe('ExecutorQueuedTotalComponent', () => {
  let component: ExecutorQueuedTotalComponent;
  let fixture: ComponentFixture<ExecutorQueuedTotalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExecutorQueuedTotalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExecutorQueuedTotalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
