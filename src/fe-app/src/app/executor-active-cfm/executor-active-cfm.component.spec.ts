import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecutorActiveCfmComponent } from './executor-active-cfm.component';

describe('ExecutorActiveCfmComponent', () => {
  let component: ExecutorActiveCfmComponent;
  let fixture: ComponentFixture<ExecutorActiveCfmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExecutorActiveCfmComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExecutorActiveCfmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
