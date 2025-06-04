import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecutorActiveFetcherComponent } from './executor-active-fetcher.component';

describe('ExecutorActiveFetcherComponent', () => {
  let component: ExecutorActiveFetcherComponent;
  let fixture: ComponentFixture<ExecutorActiveFetcherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExecutorActiveFetcherComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExecutorActiveFetcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
