import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarreraGestionComponent } from './carrera';

describe('CarreraGestionComponent', () => {
  let component: CarreraGestionComponent;
  let fixture: ComponentFixture<CarreraGestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarreraGestionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CarreraGestionComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
