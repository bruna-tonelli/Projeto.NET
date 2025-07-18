import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Inventario, CreateInventarioDto, AddItemInventarioDto, ComparacaoInventario } from '../models/inventario.model';
import { ProdutoEstoque } from '../models/produto-estoque.model';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {
  private readonly apiUrl = 'http://localhost:5000/api/inventario';
  private readonly produtosUrl = 'http://localhost:5000/api/produtos';

  constructor(private http: HttpClient) {}

  // Listar todos os inventários
  getInventarios(): Observable<Inventario[]> {
    return this.http.get<Inventario[]>(this.apiUrl);
  }

  // Obter inventário específico
  getInventario(id: number): Observable<Inventario> {
    return this.http.get<Inventario>(`${this.apiUrl}/${id}`);
  }

  // Criar novo inventário
  criarInventario(dto: CreateInventarioDto): Observable<Inventario> {
    return this.http.post<Inventario>(this.apiUrl, dto);
  }

  // Adicionar item ao inventário
  adicionarItem(inventarioId: number, dto: AddItemInventarioDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/${inventarioId}/itens`, dto);
  }

  // Comparar inventário com estoque
  compararInventario(inventarioId: number): Observable<ComparacaoInventario> {
    return this.http.post<ComparacaoInventario>(`${this.apiUrl}/${inventarioId}/comparar`, {});
  }

  // Atualizar estoque com base no inventário
  atualizarEstoque(inventarioId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${inventarioId}/atualizar-estoque`, {});
  }

  // Editar item do inventário
  editarItem(itemId: number, dto: AddItemInventarioDto): Observable<any> {
    return this.http.put(`${this.apiUrl}/itens/${itemId}`, dto);
  }

  // Remover item do inventário
  removerItem(itemId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/itens/${itemId}`);
  }

  // Finalizar inventário
  finalizarInventario(inventarioId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${inventarioId}/finalizar`, {});
  }

  // Obter produtos para seleção
  getProdutos(): Observable<ProdutoEstoque[]> {
    return this.http.get<ProdutoEstoque[]>(this.produtosUrl);
  }
}