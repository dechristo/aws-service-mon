import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecutorActiveRedshiftSortComponent } from './executor-active-redshift-sort.component';

describe('ExecutorActiveRedshiftSortComponent', () => {
  let component: ExecutorActiveRedshiftSortComponent;
  let fixture: ComponentFixture<ExecutorActiveRedshiftSortComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExecutorActiveRedshiftSortComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExecutorActiveRedshiftSortComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
