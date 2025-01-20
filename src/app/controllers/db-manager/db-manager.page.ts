import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SqliteService } from '../../services/sqlite.service';

@Component({
  selector: 'app-db-manager',
  templateUrl: '../../views/db-manager/db-manager.page.html',
  styleUrls: ['../../views/db-manager/db-manager.page.scss']
})
export class DbManagerPage {
  sqlQuery: string = '';
  queryResults: any[] = [];
  queryKeys: string[] = [];
  errorMessage: string = '';

  constructor(private sqliteService: SqliteService, private router: Router) {}

  async executeQuery() {
    if (this.sqlQuery.trim() === '') {
      this.errorMessage = 'La consulta SQL no puede estar vacía.';
      return;
    }

    try {
      const response = await this.sqliteService.executeQuery(this.sqlQuery);

      if (response.length > 0) {
        this.queryResults = response;
        this.queryKeys = Object.keys(response[0]);
        this.errorMessage = '';
      } else {
        this.queryResults = [];
        this.queryKeys = [];
        this.errorMessage = 'No se encontraron resultados.';
      }
    } catch (err) {
      this.errorMessage = 'Error ejecutando la consulta: ' + err.message;
      console.error('Error ejecutando la consulta:', err);
    }
  }
}