import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalHttpErrorsComponent } from './total-http-errors.component';

describe('TotalHttpErrorsComponent', () => {
  let component: TotalHttpErrorsComponent;
  let fixture: ComponentFixture<TotalHttpErrorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TotalHttpErrorsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TotalHttpErrorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
