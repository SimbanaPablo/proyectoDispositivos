import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private usuarios: Usuario[] = [
    {
      nombreUsuario: 'Fátima',
      apellido: 'Fiallos',
      hashedApellido: this.hashApellido('Fiallos')
    }, 
    {
        nombreUsuario: 'Leonardo',
        apellido: 'Ramírez',
        hashedApellido: this.hashApellido('Ramírez')
    },
    {
        nombreUsuario: 'Pablo',
        apellido: 'Simbaña',
        hashedApellido: this.hashApellido('Simbaña')
    },
    {
        nombreUsuario: 'Edlith',
        apellido: 'Vinueza',
        hashedApellido: this.hashApellido('Vinueza')
    }
  ];

  constructor() { }

  // Metodo para crear nuevo usuario de momento no es necesario usarlo por los datos mokeados
  agregarUsuario(nombre: string, apellido: string): void {
    const hashedApellido = this.hashApellido(apellido);
    this.usuarios.push({ nombreUsuario: nombre, apellido, hashedApellido });
  }

  verificarUsuario(nombre: string, apellido: string, hashedApellido: string): boolean {
    const hash = this.hashApellido(apellido);
    return this.usuarios.some(usuario => 
      usuario.nombreUsuario === nombre && 
      usuario.hashedApellido === hash
    );
  }

  private hashApellido(apellido: string): string {
    return CryptoJS.SHA256(apellido).toString(CryptoJS.enc.Hex);
  }
}