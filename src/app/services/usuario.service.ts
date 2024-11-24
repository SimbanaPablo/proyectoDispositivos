
import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private usuarios: Usuario[] = [
    {
      usuario: 'Fátima',
      contrasenia: 'Fiallos',
      hashContrasenia: this.hashContrasenia('Fiallos')
    }, 
    {
      usuario: 'Leonardo',
      contrasenia: 'Ramírez',
      hashContrasenia: this.hashContrasenia('Ramírez')
    },
    {
      usuario: 'Pablo',
      contrasenia: 'Simbaña',
      hashContrasenia: this.hashContrasenia('Simbaña')
    },
    {
      usuario: 'Edlith',
      contrasenia: 'Vinueza',
      hashContrasenia: this.hashContrasenia('Vinueza')
    }
  ];

  constructor() { }

  // Metodo para crear nuevo usuario de momento no es necesario usarlo por los datos mokeados
  agregarUsuario(usuario: string, contrasenia: string): void {
    const hashedContrasenia = this.hashContrasenia(contrasenia);
    this.usuarios.push({ usuario, contrasenia, hashContrasenia: hashedContrasenia });
  }

  verificarUsuario(usuario: string, contrasenia: string): boolean {
    const hash = this.hashContrasenia(contrasenia);
    return this.usuarios.some(u => 
      u.usuario === usuario && 
      u.hashContrasenia === hash
    );
  }

  public hashContrasenia(contrasenia: string): string {
    return CryptoJS.SHA256(contrasenia).toString(CryptoJS.enc.Hex);
  }
}