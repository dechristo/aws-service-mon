import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiskInfoComponent } from './disk-info.component';

describe('DiskInfoComponent', () => {
  let component: DiskInfoComponent;
  let fixture: ComponentFixture<DiskInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiskInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiskInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
