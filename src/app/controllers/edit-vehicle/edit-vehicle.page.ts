import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { VehicleService } from '../../services/vehicle.service';
import { Vehicle } from '../../models/vehicle.model';
import { Platform, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-edit-vehicle',
  templateUrl: '../../views/edit-vehicle/edit-vehicle.page.html',
  styleUrls: ['../../views/edit-vehicle/edit-vehicle.page.scss'],
})
export class EditVehiclePage implements OnInit {
  vehicles: Vehicle[] | undefined;
  isAlertOpen = false;
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
    this.vehicles = this.vehicleService.getVehicles();
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
    this.showConfirmAlert();

  }
  // Mostrar alerta de confirmación
  showConfirmAlert() {
    this.isAlertOpen = true;
  }

  // Cancelar la alerta de confirmación
  cancelAlert() {
    this.isAlertOpen = false;
  }

  // Confirmar la alerta
  backVehicles() {
    this.isAlertOpen = false;
    this.router.navigate(['/vehicles']);
  }

}
