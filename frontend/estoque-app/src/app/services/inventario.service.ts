import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Inventario } from '../models/inventario.model';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {
  private apiUrl = 'http://localhost:5000/api/inventario'; // URL do API Gateway

  constructor(private http: HttpClient) {}


  getInventario(): Observable<Inventario[]> {
    return this.http.get<Inventario[]>(this.apiUrl);
  }

}