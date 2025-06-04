import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DbTotalActiveViewComponent } from './db-total-active-view.component';

describe('DbTotalActiveViewComponent', () => {
  let component: DbTotalActiveViewComponent;
  let fixture: ComponentFixture<DbTotalActiveViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DbTotalActiveViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DbTotalActiveViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
