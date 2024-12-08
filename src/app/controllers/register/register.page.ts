import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario.model';
import { Platform, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';

// Este es nuestro controlador de la vista register
@Component({
  selector: 'app-register',
  templateUrl: '../../views/register/register.page.html', // Actualiza la ruta según la nueva ubicación
  styleUrls: ['../../views/register/register.page.scss'],
})
export class RegisterPage {
  isAlertOpen = false;
  nombreCompleto: string | undefined;
  usuario: string | undefined;
  correo: string | undefined;
  contrasena: string | undefined;
  usuarioError: string = '';
  correoError: string = '';
  contrasenaError: string = '';
  showPassword: boolean = false; // Variable para controlar la visibilidad de la contraseña
  backButtonSubscription: Subscription | undefined;

  constructor(
    private router: Router,
    private usuarioService: UsuarioService,
    private toastController: ToastController,
    private platform: Platform
  ) { }

  ngOnInit() {
    // Limpiar los campos de entrada cuando la página se carga
    this.nombreCompleto = '';
    this.usuario = '';
    this.correo = '';
    this.contrasena = '';

    // Suscribirse al evento del botón de regresar del celular
    this.backButtonSubscription = this.platform.backButton.subscribeWithPriority(10, () => {
      this.showConfirmAlert();
    });
  }

  ngOnDestroy() {
    // Desuscribirse del evento del botón de regresar del celular
    if (this.backButtonSubscription) {
      this.backButtonSubscription.unsubscribe();
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword; // Alternar la visibilidad de la contraseña
  }

  validarNombreCompleto(nombre: string): boolean {
    const regex = /^[A-Z][a-z]*\s[A-Z][a-z]*$/;
    return regex.test(nombre);
  }

  validarUsuario(usuario: string): boolean {
    const regex = /^[A-Za-z0-9]{8,13}$/;
    return regex.test(usuario) && !this.usuarioService.getUsuario(usuario);
  }

  validarCorreo(correo: string): boolean {
    const regex = /^[a-zA-Z0-9._%+-]+@(gmail|hotmail|outlook)\.com$/;
    return regex.test(correo);
  }

  validarContrasena(contrasena: string): boolean {
    const regex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,13}$/;
    return regex.test(contrasena);
  }

  validateForm() {
    this.usuarioError = '';
    this.correoError = '';
    this.contrasenaError = '';

    if (!this.nombreCompleto || !this.validarNombreCompleto(this.nombreCompleto)) {
      this.usuarioError = 'El nombre completo debe iniciar con mayúscula.';
    }

    if (!this.usuario || !this.validarUsuario(this.usuario)) {
      this.usuarioError = 'El usuario no debe repetirse, no debe tener espacios y debe tener entre 8 y 13 caracteres.';
    }

    if (!this.correo || !this.validarCorreo(this.correo)) {
      this.correoError = 'El correo debe contener @ y ser de gmail, hotmail o outlook.';
    }

    if (!this.contrasena || !this.validarContrasena(this.contrasena)) {
      this.contrasenaError = 'La contraseña debe tener una letra mayúscula, un número y entre 8 y 13 caracteres.';
    }
  }

  register() {
    console.log('Intentando registrar usuario...');
    this.validateForm();
    if (!this.usuarioError && !this.correoError && !this.contrasenaError && this.nombreCompleto && this.usuario && this.correo && this.contrasena) {
      const [nombre, apellido] = this.nombreCompleto.split(' ');
      const hashContrasenia = this.usuarioService.hashContrasenia(this.contrasena);
      const imagenes = ['assets/img/p-1.png', 'assets/img/p-2.png', 'assets/img/p-3.png', 'assets/img/p-4.png'];
      const imagen = imagenes[Math.floor(Math.random() * imagenes.length)];

      const nuevoUsuario: Usuario = {
        usuario: this.usuario,
        nombre: nombre,
        apellido: apellido,
        contrasenia: hashContrasenia,
        imagen: imagen,
        correo: this.correo
      };

      this.usuarioService.agregarUsuario(nuevoUsuario);

      // Redirigir al usuario a la página de login con un mensaje de éxito
      this.router.navigate(['/login'], { state: { message: 'Registro exitoso' } });
      this.presentToast('Registro exitoso, bienvendio a la aplicación.');
      console.log('Usuario registrado con éxito:', nuevoUsuario);
    } else {
      this.validateForm();
      this.presentToast('Error en el registro. Por favor, verifica los datos ingresados.');
    }
  }

  // Método para mostrar el toast
  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom',
      cssClass: 'custom-toast'
    });
    toast.present();
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
  backLogin() {
    this.isAlertOpen = false;
    this.presentToast('Se cancelo su registro.');
    this.router.navigate(['/login']);
  }
}