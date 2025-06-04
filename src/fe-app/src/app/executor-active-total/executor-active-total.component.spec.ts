import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecutorActiveTotalComponent } from './executor-active-total.component';

describe('ExecutorActiveTotalComponent', () => {
  let component: ExecutorActiveTotalComponent;
  let fixture: ComponentFixture<ExecutorActiveTotalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExecutorActiveTotalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExecutorActiveTotalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
