import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecutorActiveRedshiftWetComponent } from './executor-active-redshift-wet.component';

describe('ExecutorActiveRedshiftWetComponent', () => {
  let component: ExecutorActiveRedshiftWetComponent;
  let fixture: ComponentFixture<ExecutorActiveRedshiftWetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExecutorActiveRedshiftWetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExecutorActiveRedshiftWetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
