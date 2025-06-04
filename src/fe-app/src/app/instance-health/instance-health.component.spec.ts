import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstanceHealthComponent } from './instance-health.component';

describe('InstanceHealthComponent', () => {
  let component: InstanceHealthComponent;
  let fixture: ComponentFixture<InstanceHealthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstanceHealthComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstanceHealthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
