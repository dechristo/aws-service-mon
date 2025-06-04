import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DbPoolDetailsComponent } from './db-pool-details.component';

describe('DbPoolDetailsComponent', () => {
  let component: DbPoolDetailsComponent;
  let fixture: ComponentFixture<DbPoolDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DbPoolDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DbPoolDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
