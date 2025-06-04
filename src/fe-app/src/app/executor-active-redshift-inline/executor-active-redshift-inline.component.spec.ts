import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecutorActiveRedshiftInlineComponent } from './executor-active-redshift-inline.component';

describe('ExecutorActiveRedshiftInlineComponent', () => {
  let component: ExecutorActiveRedshiftInlineComponent;
  let fixture: ComponentFixture<ExecutorActiveRedshiftInlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExecutorActiveRedshiftInlineComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExecutorActiveRedshiftInlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
