import { Injectable } from "@angular/core";
import { Vehicle } from '../models/vehicle.model';
@Injectable({
    providedIn: "root"
})
export class VehicleService {
    private vehicles: Vehicle[] = [
        {
            placa: 'ABC123', marca: 'Toyota', fecFabricacion: new Date('2020-01-01').toISOString(), color: 'blanco', costo: 20000, activo: true
        },
        {
            placa: 'DEF456', marca: 'Honda', fecFabricacion: new Date('2019-05-15').toISOString(), color: 'negro', costo: 18000, activo: true
        },
        {
            placa: 'GHI789', marca: 'Ford', fecFabricacion: new Date('2020-07-20').toISOString(), color: 'azul', costo: 22000, activo: true
        }
    ];
    getVehicles(): Vehicle[] {
        return this.vehicles;
    }
    addVehicle(vehicle: Vehicle): void {
        this.vehicles.push(vehicle);
    }
}