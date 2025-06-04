import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecutorCfmViewComponent } from './executor-cfm-view.component';

describe('ExecutorCfmViewComponent', () => {
  let component: ExecutorCfmViewComponent;
  let fixture: ComponentFixture<ExecutorCfmViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExecutorCfmViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExecutorCfmViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
