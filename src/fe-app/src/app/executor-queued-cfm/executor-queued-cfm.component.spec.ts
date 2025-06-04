import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecutorQueuedCfmComponent } from './executor-queued-cfm.component';

describe('ExecutorQueuedCfmComponent', () => {
  let component: ExecutorQueuedCfmComponent;
  let fixture: ComponentFixture<ExecutorQueuedCfmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExecutorQueuedCfmComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExecutorQueuedCfmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
