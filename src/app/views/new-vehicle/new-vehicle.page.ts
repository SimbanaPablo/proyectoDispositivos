import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { VehicleService } from '../../services/vehicle.service';
import { Vehicle } from '../../models/vehicle.model';

// Este es nuestro controlador de la vista new-vehicle
@Component({
  selector: 'app-new-vehicle',
  templateUrl: './new-vehicle.page.html',
  styleUrls: ['./new-vehicle.page.scss'],
})
export class NewVehiclePage {
  isModalOpen = false;
  tempDate: string | null = null; // Temporal para el modal
  isFormSubmitted = false; // Variable para rastrear si se ha intentado enviar el formulario
  vehicle: Vehicle = {
    placa: '',
    marca: '',
    fecFabricacion: '', // Fecha final en el formulario
    color: '',
    costo: 0,
    activo: true
  };

  constructor(private vehicleService: VehicleService, private router: Router) { }

  addVehicle() {
    this.isFormSubmitted = true; // Marcar el formulario como enviado
    if (this.isFormValid()) {
      this.vehicleService.addVehicle(this.vehicle);
      this.router.navigate(['/vehicles']);
    }
  }

  // Abrir el modal
  openCalendarModal() {
    this.isModalOpen = true;
  }

  // Cerrar el modal
  closeCalendarModal() {
    this.isModalOpen = false;
  }

  // Confirmar la fecha seleccionada
  acceptDate() {
    if (this.tempDate) {
      this.vehicle.fecFabricacion = this.tempDate; // Guardar fecha seleccionada
    }
    this.closeCalendarModal(); // Cerrar modal
  }

  // Método para reiniciar el formulario
  resetForm() {
    this.vehicle = {
      placa: '',
      marca: '',
      fecFabricacion: '',
      color: '',
      costo: 0,
      activo: true
    };
    this.isFormSubmitted = false; // Reiniciar el estado del formulario
  }

  // Manejar cambios en el switch
  onToggleChange() {
    console.log('Estado del vehículo:', this.vehicle.activo ? 'Activo' : 'Inactivo');
  }

  isFormValid() {
    return this.vehicle.placa !== '' &&
      this.vehicle.marca !== '' &&
      this.vehicle.fecFabricacion !== '' &&
      this.vehicle.color !== '' &&
      this.vehicle.costo > 0;
  }
}