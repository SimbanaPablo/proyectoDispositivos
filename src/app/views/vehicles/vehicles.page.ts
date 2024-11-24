import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VehicleService } from '../../services/vehicle.service';
import { UsuarioService } from '../../services/usuario.service';
import { Vehicle } from '../../models/vehicle.model';
import { Platform, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.page.html',
  styleUrls: ['./vehicles.page.scss'],
})
export class VehiclesPage implements OnInit {
  vehicles: Vehicle[] | undefined;
  user: { nombre: string, apellido: string, imagen: string } | undefined;

  constructor(
    private vehicleService: VehicleService,
    private usuarioService: UsuarioService,
    private router: Router,
    private platform: Platform,
    private toastController: ToastController
  ) {
    this.platform.backButton.subscribeWithPriority(10, () => {
      if (this.router.url === '/vehicles') {
        console.log('Botón de regresar presionado');
        this.presentToast('Por favor, use el botón "Cerrar Sesión" para salir.');
        this.router.navigate(['/login']);
      }
    });
  }

  ngOnInit() {
    this.vehicles = this.vehicleService.getVehicles();
    this.loadUserData();
  }

  loadUserData() {
    const usuarioAutenticado = this.usuarioService.obtenerUsuarioAutenticado();
    if (usuarioAutenticado) {
      this.user = { nombre: usuarioAutenticado.nombre, apellido: usuarioAutenticado.apellido, imagen: usuarioAutenticado.imagen };
    }
  }

  goToNewVehicle() {
    this.router.navigate(['/new-vehicle']);
  }

  logout() {
    console.log('Cerrar sesión');
    this.usuarioService.cerrarSesion();
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