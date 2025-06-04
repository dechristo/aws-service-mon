import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecutorRedshiftSortViewComponent } from './executor-redshift-sort-view.component';

describe('ExecutorRedshiftSortViewComponent', () => {
  let component: ExecutorRedshiftSortViewComponent;
  let fixture: ComponentFixture<ExecutorRedshiftSortViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExecutorRedshiftSortViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExecutorRedshiftSortViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
