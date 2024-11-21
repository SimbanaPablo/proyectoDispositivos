import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { VehicleService } from '../services/vehicle.service';
import { Vehicle } from '../models/vehicle.model';

@Component({
  selector: 'app-new-vehicle',
  templateUrl: './new-vehicle.page.html',
  styleUrls: ['./new-vehicle.page.scss'],
})
export class NewVehiclePage {

  vehicle: Vehicle = {
    placa: '',
    marca: '',
    fecFabricacion: new Date(),
    color: 'blanco',
    costo: 0,
    activo: true
  };

  constructor(private vehicleService: VehicleService, private router: Router) { }

  addVehicle() {
    this.vehicleService.addVehicle(this.vehicle);
    this.router.navigate(['/vehicles'])
  }
}
