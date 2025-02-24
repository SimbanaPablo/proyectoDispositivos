import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { catchError, switchMap, map } from 'rxjs/operators';
import { Vehicle } from '../models/vehicle.model';
import { Usuario } from '../models/usuario.model';
import { SqliteService } from './sqlite.service';
import { Network } from '@capacitor/network';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
 
  private apiUrl = 'http://54.236.195.149:8081/api/v1.1'; // Replace with your EC2 instance URL

  constructor(private http: HttpClient, private sqliteService: SqliteService) {}

  public async isOnline(): Promise<boolean> {
    const status = await Network.getStatus();
    return status.connected;
  }
  hashContrasenia(contrasenia: string): string {
    return CryptoJS.SHA256(contrasenia).toString(CryptoJS.enc.Hex);
  }

  // Vehicles API
  getVehicles(): Promise<Vehicle[]> {
    return from(this.isOnline()).pipe(
      switchMap(online => {
        if (online) {
          return this.http.get<Vehicle[]>(`${this.apiUrl}/vehiculo/todos`).pipe(
            catchError(() => from(this.sqliteService.readVehicle()))
          );
        } else {
          return from(this.sqliteService.readVehicle());
        }
      })
    ).toPromise();
  }

  createVehicle(vehicle: Vehicle): Promise<Vehicle> {
    return from(this.isOnline()).pipe(
      switchMap(online => {
        if (online) {
          return this.http.post<Vehicle>(`${this.apiUrl}/vehiculo`, vehicle).pipe(
            catchError(() => from(this.sqliteService.createVehicle(vehicle)).pipe(map(() => vehicle)))
          );
        } else {
          return from(this.sqliteService.createVehicle(vehicle)).pipe(map(() => vehicle));
        }
      })
    ).toPromise();
  }

  updateVehicle(vehicle: Vehicle): Promise<Vehicle> {
    return from(this.isOnline()).pipe(
      switchMap(online => {
        if (online) {
          return this.http.put<Vehicle>(`${this.apiUrl}/vehiculo/${vehicle.placa}`, vehicle).pipe(
            catchError(() => from(this.sqliteService.updateVehicle(vehicle)).pipe(map(() => vehicle)))
          );
        } else {
          return from(this.sqliteService.updateVehicle(vehicle)).pipe(map(() => vehicle));
        }
      })
    ).toPromise();
  }

  deleteVehicle(placa: string): Observable<void> {
    return from(this.isOnline()).pipe(
      switchMap(online => {
        if (online) {
          return this.http.delete<void>(`${this.apiUrl}/vehiculo/${placa}`).pipe(
            catchError(() => from(this.sqliteService.deleteVehicle(placa)).pipe(map(() => {})))
          );
        } else {
          return from(this.sqliteService.deleteVehicle(placa)).pipe(map(() => {}));
        }
      })
    );
  }

  // Users API
  getUsers(): Observable<Usuario[]> {
    return from(this.isOnline()).pipe(
      switchMap(online => {
        if (online) {
          return this.http.get<Usuario[]>(`${this.apiUrl}/usuario`).pipe(
            catchError(() => from(this.sqliteService.readUsers()))
          );
        } else {
          return from(this.sqliteService.readUsers());
        }
      })
    );
  }

  createUser(user: Usuario): Observable<Usuario> {
    return from(this.isOnline()).pipe(
      switchMap(online => {
        if (online) {
          return this.http.post<Usuario>(`${this.apiUrl}/usuario`, user).pipe(
            catchError(() => from(this.sqliteService.createUser(user)).pipe(map(() => user)))
          );
        } else {
          return from(this.sqliteService.createUser(user)).pipe(map(() => user));
        }
      })
    );
  }

  updateUser(user: Usuario): Observable<Usuario> {
    return from(this.isOnline()).pipe(
      switchMap(online => {
        if (online) {
          return this.http.put<Usuario>(`${this.apiUrl}/usuario/${user.usuario}`, user).pipe(
            catchError(() => from(this.sqliteService.updateUser(user)).pipe(map(() => user)))
          );
        } else {
          return from(this.sqliteService.updateUser(user)).pipe(map(() => user));
        }
      })
    );
  }

  deleteUser(usuario: string): Observable<void> {
    return from(this.isOnline()).pipe(
      switchMap(online => {
        if (online) {
          return this.http.delete<void>(`${this.apiUrl}/usuario/${usuario}`).pipe(
            catchError(() => from(this.sqliteService.deleteUser(usuario)).pipe(map(() => {})))
          );
        } else {
          return from(this.sqliteService.deleteUser(usuario)).pipe(map(() => {}));
        }
      })
    );
  }

  getUserByCredentials(usuario: string, contrasenia: string): Observable<Usuario> {
    return from(this.isOnline()).pipe(
      switchMap(online => {
        if (online) {
          return this.http.post<Usuario>(`${this.apiUrl}/usuario/login`, { usuario, contrasenia }).pipe(
            catchError(() => from(this.sqliteService.readUserByCredentials(usuario, contrasenia)))
          );
        } else {
          return from(this.sqliteService.readUserByCredentials(usuario, contrasenia));
        }
      })
    );
  }

  getUserByUsuario(usuario: string): Observable<Usuario> {
    return from(this.isOnline()).pipe(
      switchMap(online => {
        if (online) {
          return this.http.get<Usuario>(`${this.apiUrl}/usuario/${usuario}`).pipe(
            catchError(() => from(this.sqliteService.readUserByUsuario(usuario)))
          );
        } else {
          return from(this.sqliteService.readUserByUsuario(usuario));
        }
      })
    );
  }
  
}