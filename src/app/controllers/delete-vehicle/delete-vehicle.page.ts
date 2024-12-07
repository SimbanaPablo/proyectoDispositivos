import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { VehicleService } from '../../services/vehicle.service';
import { Vehicle } from '../../models/vehicle.model';
import { Platform, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-delete-vehicle',
  templateUrl: '../../views/delete-vehicle/delete-vehicle.page.html',
  styleUrls: ['../../views/delete-vehicle/delete-vehicle.page.scss'],
})
export class DeleteVehiclePage implements OnInit {
  vehicles: Vehicle[] | undefined;
  isAlertOpen = false;
  placaToDelete: string | null = null;

  constructor(
    private vehicleService: VehicleService,
    private router: Router,
    private platform: Platform,
    private toastController: ToastController
  ) {
    // Manejo de boton regresar
    this.platform.backButton.subscribeWithPriority(10, () => {
      if (this.router.url === '/vehicles') {
        console.log('Botón de regresar presionado');
        // Evita que el usuario regrese a la página de inicio cuando se presiona el botón de regresar del celular
        this.presentToast('Por favor, use el botón "Cerrar Sesión" para salir.');
      }
    });
  }

  // Enlista los vehículos en el sistema
  ngOnInit() {
    this.loadVehicles();
  }

  // Cargar la lista de vehículos
  loadVehicles() {
    this.vehicles = this.vehicleService.getVehicles();
  }

  // Redirecciona a la vista para agregar un nuevo vehículo
  goToNewVehicle() {
    this.router.navigate(['/new-vehicle']);
  }

  // Redirecciona a la vista para editar un vehículo
  goToEditVehicle() {
    this.router.navigate(['/edit-vehicle']);
  }

  // Configuración del Toast (Mensajes a pantalla para móvil)
  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom',
      cssClass: 'custom-toast'
    });
    toast.present();
  }

  // Redirecciona a la vista para editar un vehículo
  redirectToEditVehicle(vehicle: Vehicle): void {
    const navigationExtras: NavigationExtras = {
      state: {
        vehicle: vehicle
      }
    };
    this.router.navigate(['/update-vehiculo'], navigationExtras);
  }

  // Método para regresar a la página anterior
  goBack() {
    this.router.navigate(['/vehicles']);
  }

  // Mostrar alerta de confirmación
  showConfirmAlert(placa: string) {
    this.placaToDelete = placa;
    this.isAlertOpen = true;
  }

  // Cancelar la alerta de confirmación
  cancelAlert() {
    this.isAlertOpen = false;
    this.placaToDelete = null;
  }

  // Confirmar y ocultar el vehículo
  confirmHideVehicle() {
    if (this.placaToDelete) {
      this.hideVehicle(this.placaToDelete);
      this.isAlertOpen = false;
      this.placaToDelete = null;
    }
  }

  // Ocultar un vehículo
  hideVehicle(placa: string): void {
    this.vehicleService.deleteVehicle(placa);
    this.loadVehicles(); // Actualiza la lista de vehículos
    this.presentToast('Vehículo oculto con éxito');
  }
}