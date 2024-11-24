import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VehiclesPage } from '../../controllers/vehicles/vehicles.page';

describe('VehiclesPage', () => {
  let component: VehiclesPage;
  let fixture: ComponentFixture<VehiclesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VehiclesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
