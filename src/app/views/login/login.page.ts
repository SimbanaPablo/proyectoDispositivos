import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';

//este es nuestro controlador de la vista login
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  nombre: string | undefined;
  apellido: string | undefined;

  constructor(private router: Router, private usuarioService: UsuarioService) { }

  login() {
    if (this.nombre && this.apellido) { 
      const hashedApellido = this.usuarioService['hashApellido'](this.apellido);
      console.log('Hashed Apellido:', hashedApellido);

      // Verificar el hash del apellido
      const isValid = this.usuarioService.verificarUsuario(this.nombre, this.apellido, hashedApellido);
      if (isValid) {
        console.log('Hash verificado correctamente');
        this.router.navigate(['/vehicles']);
      } else {
        alert('Las credenciales son incorrectas');
      }

    } else {
      alert('Por favor ingrese su nombre y apellido');
    }
  }
}

//npm install crypto-js -> instalar para encriptar la contraseña
