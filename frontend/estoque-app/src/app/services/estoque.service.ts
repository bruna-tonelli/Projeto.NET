import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProdutoEstoque } from '../models/produto-estoque.model'; // ajuste conforme seu projeto

@Injectable({
  providedIn: 'root'
})
export class EstoqueService {
  private apiUrl = 'http://localhost:5232/api/produtos'; // URL do seu backend

  constructor(private http: HttpClient) {}

  getEstoque(): Observable<ProdutoEstoque[]> {
    return this.http.get<ProdutoEstoque[]>(this.apiUrl);
  }

  getProduto(id: number): Observable<ProdutoEstoque> {
    return this.http.get<ProdutoEstoque>(`${this.apiUrl}/${id}`);
  }

  adicionarProduto(produto: ProdutoEstoque): Observable<ProdutoEstoque> {
    return this.http.post<ProdutoEstoque>(this.apiUrl, produto);
  }

  atualizarProduto(id: number, produto: ProdutoEstoque): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, produto);
  }

  removerProduto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}