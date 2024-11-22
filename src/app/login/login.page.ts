import { Component } from '@angular/core';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  nombre: string | undefined;
  apellido: string | undefined;
  datos: { nombre: string, apellido: string, hashedApellido: string }[] = [];

  constructor(private router: Router) { }

  login() {
    if (this.nombre && this.apellido) {
      const hashedApellido = this.hashApellido(this.apellido);
      console.log('Hashed Apellido:', hashedApellido);
      
      // Guardar los datos en el array
      this.datos.push({ nombre: this.nombre, apellido: this.apellido, hashedApellido });

      // Verificar el hash del apellido
      const isValid = this.verifyHash(this.apellido, hashedApellido);
      if (isValid) {
        console.log('Hash verificado correctamente');
        this.router.navigate(['/vehicles']);
      } else {
        alert('El hash del apellido no coincide');
      }

    } else {
      alert('Por favor ingrese su nombre y apellido');
    }
  }

  hashApellido(apellido: string): string {
    return CryptoJS.SHA256(apellido).toString(CryptoJS.enc.Hex);
  }

  verifyHash(apellido: string, hashedApellido: string): boolean {
    const hash = this.hashApellido(apellido);
    return hash === hashedApellido;
  }
}

//npm install crypto-js -> instalar para encriptar la contraseña
