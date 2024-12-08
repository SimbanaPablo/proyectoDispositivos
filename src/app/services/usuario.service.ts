import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private usuarios: Usuario[] = [
    {
      usuario: 'fatima',
      nombre: 'Fátima',
      apellido: 'Fiallos',
      contrasenia: this.hashContrasenia('Fiallos'),
      imagen: 'assets/img/p-1.png',
      correo: 'fatima@example.com'
    }, 
    {
      usuario: 'leonardo',
      nombre: 'Leonardo',
      apellido: 'Ramírez',
      contrasenia: this.hashContrasenia('Ramírez'),
      imagen: 'assets/img/p-2.png',
      correo: 'leonardo@example.com'
    },
    {
      usuario: 'pablo',
      nombre: 'Pablo',
      apellido: 'González',
      contrasenia: this.hashContrasenia('González'),
      imagen: 'assets/img/p-3.png',
      correo: 'pablo@example.com'
    }
  ];

  private usuarioAutenticado: Usuario | null = null;

  constructor() { }

  hashContrasenia(contrasenia: string): string {
    return CryptoJS.SHA256(contrasenia).toString();
  }

  verificarUsuario(usuario: string, contrasenia: string): boolean {
    const usuarioEncontrado = this.usuarios.find(u => u.usuario === usuario && u.contrasenia === this.hashContrasenia(contrasenia));
    if (usuarioEncontrado) {
      this.usuarioAutenticado = usuarioEncontrado;
      return true;
    }
    return false;
  }

  obtenerUsuarioAutenticado(): Usuario | null {
    return this.usuarioAutenticado;
  }

  cerrarSesion(): void {
    this.usuarioAutenticado = null;
  }

  getUsuarios(): Usuario[] {
    return this.usuarios;
  }

  getUsuario(usuario: string): Usuario | undefined {
    return this.usuarios.find(u => u.usuario === usuario);
  }

  agregarUsuario(usuario: Usuario): void {
    this.usuarios.push(usuario);
  }
}