import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecutorTotalViewComponent } from './executor-total-view.component';

describe('ExecutorTotalViewComponent', () => {
  let component: ExecutorTotalViewComponent;
  let fixture: ComponentFixture<ExecutorTotalViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExecutorTotalViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExecutorTotalViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
