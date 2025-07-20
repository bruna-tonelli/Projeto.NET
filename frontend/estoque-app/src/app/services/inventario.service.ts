import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { 
  Inventario, 
  CreateInventarioDto, 
  UpdateInventarioDto, 
  AddProdutoInventarioDto,
  Produto 
} from '../models/inventario.model';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {
  private apiUrl = 'http://localhost:5000/api/inventario';
  private produtoUrl = 'http://localhost:5000/api/produtos';

  constructor(private http: HttpClient) { }

  // Métodos de Inventário
  listarInventarios(): Observable<Inventario[]> {
    return this.http.get<Inventario[]>(this.apiUrl).pipe(
      catchError(error => {
        console.error('Erro ao listar inventários:', error);
        return of([]);
      })
    );
  }

  obterInventario(id: number): Observable<Inventario> {
    return this.http.get<Inventario>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Erro ao obter inventário:', error);
        throw error;
      })
    );
  }

  criarInventario(dto: CreateInventarioDto): Observable<Inventario> {
    return this.http.post<Inventario>(this.apiUrl, dto).pipe(
      catchError(error => {
        console.error('Erro ao criar inventário:', error);
        throw error;
      })
    );
  }

  atualizarInventario(id: number, dto: UpdateInventarioDto): Observable<Inventario> {
    return this.http.put<Inventario>(`${this.apiUrl}/${id}`, dto).pipe(
      catchError(error => {
        console.error('Erro ao atualizar inventário:', error);
        throw error;
      })
    );
  }

  finalizarInventario(id: number, updateData: UpdateInventarioDto): Observable<Inventario> {
    return this.http.put<Inventario>(`${this.apiUrl}/${id}/finalizar`, updateData).pipe(
      catchError(error => {
        console.error('Erro ao finalizar inventário:', error);
        throw error;
      })
    );
  }  

  excluirInventario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Erro ao excluir inventário:', error);
        throw error;
      })
    );
  }

  // Métodos de Produtos do Inventário
  adicionarProduto(dto: AddProdutoInventarioDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/produtos`, dto).pipe(
      catchError(error => {
        console.error('Erro ao adicionar produto:', error);
        throw error;
      })
    );
  }

  // Método para remover produto do inventário
  removerProdutoInventario(produtoInventarioId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/produtos/${produtoInventarioId}`).pipe(
      catchError(error => {
        console.error('Erro ao remover produto do inventário:', error);
        throw error;
      })
    );
  }

  // Obter produtos disponíveis
  obterProdutos(): Observable<Produto[]> {
    return this.http.get<Produto[]>(this.produtoUrl).pipe(
      catchError(error => {
        console.error('Erro ao obter produtos:', error);
        return of([]);
      })
    );
  }

  // Teste de conexão
  testarConexao(): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/teste-conexao`).pipe(
      catchError(error => {
        console.error('Erro no teste de conexão:', error);
        return of('Erro de conexão');
      })
    );
  }

  // Atualizar quantidades dos produtos
atualizarQuantidadesProdutos(atualizacoes: any[]): Observable<any> {
  return this.http.put(`http://localhost:5000/api/produtos/atualizar-quantidades`, atualizacoes).pipe(
    catchError(error => {
      console.error('Erro ao atualizar quantidades dos produtos:', error);
      throw error;
    })
  );
}
}
