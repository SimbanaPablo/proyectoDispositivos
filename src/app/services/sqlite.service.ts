import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Device } from '@capacitor/device';
import { CapacitorSQLite, capSQLiteChanges, capSQLiteValues, JsonSQLite } from '@capacitor-community/sqlite';
import { Preferences } from '@capacitor/preferences';
import { HttpClient } from '@angular/common/http';
import { Vehicle } from '../models/vehicle.model';

@Injectable({
  providedIn: 'root'
})
export class SqliteService {
  public dbReady: BehaviorSubject<boolean>
  public isWeb: boolean;
  public isIOS: boolean;
  public dbName: string;
  private vehicles: Vehicle[] = [
    {
      placa: 'ABC123',
      marca: 'Toyota',
      fecFabricacion: '2020-01-01',
      color: 'blanco',
      costo: 20000,
      activo: true,
      oculto: false
    },
    {
      placa: 'DEF456',
      marca: 'Honda',
      fecFabricacion: '2019-05-15',
      color: 'negro',
      costo: 18000,
      activo: true,
      oculto: false
    },
    {
      placa: 'GHI789',
      marca: 'Ford',
      fecFabricacion: '2018-08-20',
      color: 'azul',
      costo: 22000,
      activo: true,
      oculto: false
    }
  ];

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
    await this.printTableColumns();
    await this.printVehicles();
  }

  async setupdatabase(){
    const dbSetup = await Preferences.get({key: 'first_setup_key'});      
    if(!dbSetup.value){
      await this.downloadDatabase();
    }else{
      this.dbName =  await this.getDbName();  

      await CapacitorSQLite.createConnection({database: this.dbName});
      await CapacitorSQLite.open({database: this.dbName});
      this.dbReady.next(true);
    }
  }
  
  downloadDatabase(){
    this.http.get('assets/data/db.json').subscribe(
      async (jsonExport: JsonSQLite) =>{
        const jsonstring = JSON.stringify(jsonExport);
        const isValid = await CapacitorSQLite.isJsonValid({ jsonstring });
        if(isValid.result){
          this.dbName = jsonExport.database;
          await CapacitorSQLite.importFromJson({ jsonstring });
          await CapacitorSQLite.createConnection({ database: this.dbName });
          await CapacitorSQLite.open({ database: this.dbName });
        }

        await Preferences.set({ key: 'first_setup_key', value: '1' });  
        await Preferences.set({ key: 'dbname', value: this.dbName });  

        this.dbReady.next(true);
        await this.insertInitialVehicles(); // Ensure vehicles are inserted after database setup
      }
    )
  }

  async getDbName(){
    if(!this.dbName){
      const dbname = await Preferences.get({ key: 'dbname' });  
      if(dbname.value){
        this.dbName = dbname.value;
      }
    }
    return this.dbName;
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
      console.log(`Vehicle ${vehicle.placa} inserted`);
      if(this.isWeb){
        CapacitorSQLite.saveToStore({database: dbName});
      }
      return changes;
    }).catch(err => {
      console.error(`Error inserting vehicle ${vehicle.placa}:`, err);
      return Promise.reject(err);
    });
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

  async insertInitialVehicles() {
    for (const vehicle of this.vehicles) {
      await this.createVehicle(vehicle);
    }
  }

  async printTableColumns() {
    const dbName = await this.getDbName();
    const tables = await CapacitorSQLite.query({
      database: dbName,
      statement: "SELECT name FROM sqlite_master WHERE type='table'",
      values: []
    });

    for (const table of tables.values) {
      const columns = await CapacitorSQLite.query({
        database: dbName,
        statement: `PRAGMA table_info(${table.name})`,
        values: []
      });
      console.log(`Table: ${table.name}`);
      columns.values.forEach(column => {
        console.log(`Column: ${column.name}, Type: ${column.type}`);
      });
    }
  }

  async printVehicles() {
    const vehicles = await this.readVehicle();
    console.log('Vehicles:', vehicles);
  }
}