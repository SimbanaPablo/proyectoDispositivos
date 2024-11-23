import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewVehiclePage } from './new-vehicle.page';

describe('NewVehiclePage', () => {
  let component: NewVehiclePage;
  let fixture: ComponentFixture<NewVehiclePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NewVehiclePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
