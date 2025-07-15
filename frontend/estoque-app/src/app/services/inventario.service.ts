import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Inventario } from '../models/inventario.model';
import { ProdutoEstoque } from '../models/produto-estoque.model';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {
  private apiUrl = 'http://localhost:5000/api/inventario'; // URL do API Gateway
  private produtosUrl = 'http://localhost:5000/api/produtos'; // URL do API Gateway para produtos

  constructor(private http: HttpClient) {}


  getInventario(): Observable<Inventario[]> {
    return this.http.get<Inventario[]>(this.apiUrl);
  }

  getProdutos(): Observable<ProdutoEstoque[]> {
      return this.http.get<ProdutoEstoque[]>(this.produtosUrl);
    }

}