import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestartServerComponent } from './restart-server.component';

describe('RestartServerComponent', () => {
  let component: RestartServerComponent;
  let fixture: ComponentFixture<RestartServerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RestartServerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RestartServerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
