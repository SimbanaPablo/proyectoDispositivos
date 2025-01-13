import { Injectable } from "@angular/core";
import { Vehicle } from '../models/vehicle.model';
import { SqliteService } from '../services/sqlite.service';

@Injectable({
    providedIn: "root"
})
export class VehicleService {
    private vehicles: Vehicle[] = [];

    constructor(private sqlite: SqliteService) {}

    // Obtener la lista de vehículos no ocultos
    async getVehicles(): Promise<Vehicle[]> {
        const allVehicles = await this.sqlite.read();
        return allVehicles.filter(vehicle => !vehicle.oculto);
    }

    // Obtener la lista de todos los vehículos, incluidos los ocultos
    async getAllVehicles(): Promise<Vehicle[]> {
        return await this.sqlite.read();
    }

    // Agregar un nuevo vehículo
    async addVehicle(vehicle: Vehicle): Promise<void> {
        await this.sqlite.create(vehicle);
        this.vehicles.push(vehicle);
    }

    // Actualizar un vehículo existente
    async updateVehicle(updatedVehicle: Vehicle): Promise<void> {
        await this.sqlite.update(updatedVehicle);
        const index = this.vehicles.findIndex(vehicle => vehicle.placa === updatedVehicle.placa);
        if (index !== -1) {
            this.vehicles[index] = updatedVehicle;
        }
    }

    // Ocultar un vehículo (no eliminar)
    async deleteVehicle(placa: string): Promise<void> {
        await this.sqlite.delete(placa);
        const index = this.vehicles.findIndex(vehicle => vehicle.placa === placa);
        if (index !== -1) {
            this.vehicles[index].oculto = true;
        }
    }
}