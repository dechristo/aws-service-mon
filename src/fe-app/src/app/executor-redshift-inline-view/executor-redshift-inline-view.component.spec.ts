import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecutorRedshiftInlineViewComponent } from './executor-redshift-inline-view.component';

describe('ExecutorRedshiftInlineViewComponent', () => {
  let component: ExecutorRedshiftInlineViewComponent;
  let fixture: ComponentFixture<ExecutorRedshiftInlineViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExecutorRedshiftInlineViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExecutorRedshiftInlineViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
