import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';

// Este es nuestro controlador de la vista login
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  usuario: string | undefined;
  contrasena: string | undefined;
  usuarioError: boolean = false;
  contrasenaError: boolean = false;
  showPassword: boolean = false; // Variable para controlar la visibilidad de la contraseña

  constructor(private router: Router, private usuarioService: UsuarioService) { }

  validateForm() {
    this.usuarioError = !this.usuario;
    this.contrasenaError = !this.contrasena;
  }

  login() {
    this.validateForm();
    if (!this.usuarioError && !this.contrasenaError && this.usuario && this.contrasena) {
      const hashContrasenia = this.usuarioService.hashContrasenia(this.contrasena);
      console.log('Hashed Contraseña:', hashContrasenia);

      // Verificar el hash de la contraseña
      const isValid = this.usuarioService.verificarUsuario(this.usuario, this.contrasena);
      if (isValid) {
        console.log('Hash verificado correctamente');
        this.router.navigate(['/vehicles']);
      } else {
        alert('Las credenciales son incorrectas');
      }
    } else {
      this.validateForm();
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword; // Alternar la visibilidad de la contraseña
  }
}