import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VehicleService } from '../services/vehicle.service';
import { Vehicle } from '../models/vehicle.model';

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.page.html',
  styleUrls: ['./vehicles.page.scss'],
})
export class VehiclesPage implements OnInit {
  vehicles: Vehicle[] | undefined;
  constructor(private vehicleService: VehicleService, private router: Router) { }

  ngOnInit() {
    this.vehicles = this.vehicleService.getVehicles();
  }

  goToNewVehicle() {
    this.router.navigate(['/new-vehicle']);
  }
}
