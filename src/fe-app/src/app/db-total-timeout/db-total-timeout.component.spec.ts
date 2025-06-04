import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DbTotalTimeoutComponent } from './db-total-timeout.component';

describe('DbTotalTimeoutComponent', () => {
  let component: DbTotalTimeoutComponent;
  let fixture: ComponentFixture<DbTotalTimeoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DbTotalTimeoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DbTotalTimeoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
