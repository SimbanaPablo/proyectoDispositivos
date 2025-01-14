import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Device } from '@capacitor/device';
import { CapacitorSQLite, capSQLiteChanges, capSQLiteValues, JsonSQLite } from '@capacitor-community/sqlite';
import { Preferences } from '@capacitor/preferences';
import { HttpClient } from '@angular/common/http';
import { Vehicle } from '../models/vehicle.model';
import { Usuario } from '../models/usuario.model'; // Importa el modelo Usuario

@Injectable({
  providedIn: 'root'
})
export class SqliteService {
  public dbReady: BehaviorSubject<boolean>
  public isWeb: boolean;
  public isIOS: boolean;
  public dbName: string;

  constructor(
    private http: HttpClient
  ) { 
    this.dbReady = new BehaviorSubject(false);
    this.isWeb = false;
    this.isIOS = false;
    this.dbName = '';

  }

  async init(){
    const info =  await Device.getInfo();
    const sqlite = CapacitorSQLite as any;

    if(info.platform == 'android'){
      try{
        await sqlite.requestPermissions();
      }catch (error){
        console.error("Esta app necesita permisos para funcionar")
      }

    }else if(info.platform == 'web'){
      this.isWeb = true;
      await sqlite.initWebStore();

    }else if(info.platform == 'ios'){
      this.isIOS = true;
    }
    await this.setupdatabase();
    await this.printTableColumns('users');
    await this.printTableColumns('vehicles');
  }

  async setupdatabase(){
    const dbSetup = await Preferences.get({key: 
      'first_setup_key'});      
    if(!dbSetup.value){
      this.downloadDatabase();
    }else{
      this.dbName =  await this.getDbName();  

      await CapacitorSQLite.createConnection({database: 
        this.dbName});
      await CapacitorSQLite.open({database: 
        this.dbName});
      this.dbReady.next(true);
    }
  }

  downloadDatabase(){
    this.http.get('assets/data/db.json').subscribe(
      async (jsonExport: JsonSQLite) =>{
        const jsonstring = JSON.stringify(jsonExport);
        const isValid = await CapacitorSQLite.isJsonValid({
          jsonstring});
        if(isValid.result){
          this.dbName = jsonExport.database;
          await CapacitorSQLite.importFromJson({
            jsonstring});
          await CapacitorSQLite.createConnection({database: 
            this.dbName});
          await CapacitorSQLite.open({database: 
            this.dbName});
        }

        await Preferences.set({key: 'first_setup_key', 
          value:'1'});  
        await Preferences.set({key: 'dbname', 
          value:this.dbName});  

        this.dbReady.next(true);

    })
  }
  async getDbName(){
    if(!this.dbName){
      const dbname = await Preferences.get({key: 'dbname'});  
      if(dbname.value){
        this.dbName = dbname.value;
      }


    }
    return this.dbName;
  }

  async printTableColumns(tableName: string) {
    const dbName = await this.getDbName();
    const sql = `PRAGMA table_info(${tableName})`;
    const result = await CapacitorSQLite.query({
      database: dbName,
      statement: sql,
      values: []
    });
    console.log(`Columns in ${tableName}:`, result.values);
  }

  async createVehicle(vehicle: Vehicle){
    let sql = 'INSERT INTO vehicles (placa, marca, fecFabricacion, color, costo, activo, oculto) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const dbName = await this.getDbName();
    return CapacitorSQLite.executeSet({
      database: dbName,
      set: [
        {
          statement: sql,
          values: [
            vehicle.placa,
            vehicle.marca,
            vehicle.fecFabricacion,
            vehicle.color,
            vehicle.costo,
            vehicle.activo,
            vehicle.oculto
          ]
        }
      ]
    }).then((changes: capSQLiteChanges) =>{
      if(this.isWeb){
        CapacitorSQLite.saveToStore({database: dbName});
      }
      return changes;
    }).catch(err => Promise.reject(err))

  }

  async readVehicle(){
    let sql = 'SELECT * FROM vehicles';
    const dbName = await this.getDbName();
    return CapacitorSQLite.query({
      database: dbName,
      statement: sql,
      values: []
    }).then((response: capSQLiteValues) =>{
      let vehicles: Vehicle[] = [];
      if(this.isIOS && response.values.length > 0){
        response.values.shift();
      }

      for(let index = 0; index < response.values.length; index++){
        const vehicle = response.values[index];
        vehicles.push(vehicle);
      }
      return vehicles;

    }).catch(err => Promise.reject(err));
  }

  async updateVehicle(updatedVehicle: Vehicle){
    let sql = 'UPDATE vehicles SET marca = ?, fecFabricacion = ?, color = ?, costo = ?, activo = ?, oculto = ? WHERE placa = ?';
    const dbName = await this.getDbName();
    return CapacitorSQLite.executeSet({
      database: dbName,
      set:[
        {
          statement: sql,
          values:[
            updatedVehicle.marca,
            updatedVehicle.fecFabricacion,
            updatedVehicle.color,
            updatedVehicle.costo,
            updatedVehicle.activo,
            updatedVehicle.oculto,
            updatedVehicle.placa
          ]
        }
      ] 
    }).then((changes: capSQLiteChanges) =>{
      if(this.isWeb){
        CapacitorSQLite.saveToStore({database: dbName});
      }
      return changes;
    }).catch(err => Promise.reject(err));
  }

  async deleteVehicle(placa: string){
    let sql = 'DELETE FROM vehicles WHERE placa = ?';
    const dbName = await this.getDbName();
    return CapacitorSQLite.executeSet({
      database: dbName,
      set:[
        {
          statement: sql,
          values:[
            placa
          ]
        }
      ] 
    }).then((changes: capSQLiteChanges) =>{
      if(this.isWeb){
        CapacitorSQLite.saveToStore({database: dbName});
      }
      return changes;
    }).catch(err => Promise.reject(err));

  }
}