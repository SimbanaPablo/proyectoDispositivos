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
      contrasenia: 'Fiallos',
      hashContrasenia: this.hashContrasenia('Fiallos'),
      imagen: 'assets/img/p-1.png'
    }, 
    {
      usuario: 'leonardo',
      nombre: 'Leonardo',
      apellido: 'Ramírez',
      contrasenia: 'Ramírez',
      hashContrasenia: this.hashContrasenia('Ramírez'),
      imagen: 'assets/img/p-2.png'
    },
    {
      usuario: 'pablo',
      nombre: 'Pablo',
      apellido: 'Simbaña',
      contrasenia: 'Simbaña',
      hashContrasenia: this.hashContrasenia('Simbaña'),
      imagen: 'assets/img/p-3.png'
    },
    {
      usuario: 'edlith',
      nombre: 'Edlith',
      apellido: 'Vinueza',
      contrasenia: 'Vinueza',
      hashContrasenia: this.hashContrasenia('Vinueza'),
      imagen: 'assets/img/p-4.png'
    }
  ];

  private usuarioAutenticado: Usuario | null = null;

  constructor() { }

  agregarUsuario(usuario: string, nombre: string, apellido: string, contrasenia: string, imagen: string): void {
    const hashedContrasenia = this.hashContrasenia(contrasenia);
    this.usuarios.push({ usuario, nombre, apellido, contrasenia, hashContrasenia: hashedContrasenia, imagen });
  }

  verificarUsuario(usuario: string, contrasenia: string): boolean {
    const hash = this.hashContrasenia(contrasenia);
    const usuarioEncontrado = this.usuarios.find(u => 
      u.usuario === usuario && 
      u.hashContrasenia === hash
    );
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

  public hashContrasenia(contrasenia: string): string {
    return CryptoJS.SHA256(contrasenia).toString(CryptoJS.enc.Hex);
  }
}