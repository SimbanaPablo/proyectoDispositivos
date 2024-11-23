import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VehicleService } from '../../services/vehicle.service';
import { Vehicle } from '../../models/vehicle.model';
import { Platform, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.page.html',
  styleUrls: ['./vehicles.page.scss'],
})
export class VehiclesPage implements OnInit {
  vehicles: Vehicle[] | undefined;

  constructor(
    private vehicleService: VehicleService,
    private router: Router,
    private platform: Platform,
    private toastController: ToastController
  ) {
    this.platform.backButton.subscribeWithPriority(10, () => {
      // Evitar que el botón de regresar cierre la aplicación
      if (this.router.url === '/vehicles') {
        console.log('Botón de regresar presionado');
        this.presentToast('Por favor, use el botón "Cerrar Sesión" para salir.');
        this.router.navigate(['/login']);
      }
    });
  }

  ngOnInit() {
    this.vehicles = this.vehicleService.getVehicles();
  }

  goToNewVehicle() {
    this.router.navigate(['/new-vehicle']);
  }

  logout() {
    // Aquí puedes agregar la lógica para cerrar sesión, por ejemplo, limpiar el almacenamiento local
    console.log('Cerrar sesión');
    // localStorage.removeItem('userToken'); // Elimina el almacenamiento local
    this.router.navigate(['/login']);
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }
}