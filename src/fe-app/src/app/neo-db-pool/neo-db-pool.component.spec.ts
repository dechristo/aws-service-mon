import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NeoDbPoolComponent } from './neo-db-pool.component';

describe('NeoDbPoolComponent', () => {
  let component: NeoDbPoolComponent;
  let fixture: ComponentFixture<NeoDbPoolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NeoDbPoolComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NeoDbPoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
