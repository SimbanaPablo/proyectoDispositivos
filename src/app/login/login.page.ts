import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  nombre: string | undefined;
  apellido: string | undefined;
  constructor(private router: Router) { }
  login() {
    if (this.nombre && this.apellido) {
      this.router.navigate(['/vehicles']);
    } else {
      alert('Por favor ingrese su nombre y apellido');
    }
  }
}

