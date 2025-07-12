import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Movimentacao } from '../models/movimentacao.model';
import { ProdutoEstoque } from '../models/produto-estoque.model';
import { Funcionario } from '../models/funcionario.model';

@Injectable({
  providedIn: 'root'
})
export class MovimentacaoService {
  private apiUrl = 'http://localhost:5000/api/movimentacao'; // URL do API Gateway
  private produtosUrl = 'http://localhost:5000/api/produtos'; // URL do API Gateway para produtos
  private funcionariosUrl = 'http://localhost:5000/api/funcionarios'; // URL do API Gateway para funcionários

  constructor(private http: HttpClient) { }

  getMovimentacoes(): Observable<Movimentacao[]> {
    return this.http.get<Movimentacao[]>(this.apiUrl).pipe(
      map(movimentacoes => {
        // Para cada movimentação, buscar informações do produto e funcionário
        return movimentacoes.map(mov => this.expandirDadosMovimentacao(mov));
      })
    );
  }

  getMovimentacoesExpandidas(): Observable<Movimentacao[]> {
    return forkJoin({
      movimentacoes: this.http.get<Movimentacao[]>(this.apiUrl),
      produtos: this.http.get<ProdutoEstoque[]>(this.produtosUrl),
      funcionarios: this.http.get<Funcionario[]>(this.funcionariosUrl)
    }).pipe(
      map(({ movimentacoes, produtos, funcionarios }) => {
        return movimentacoes.map(mov => {
          const produto = produtos.find(p => p.id === mov.produtoId);
          const funcionario = funcionarios.find(f => f.id === mov.funcionarioId);
          
          return {
            ...mov,
            produtoNome: produto?.nome || 'Produto não encontrado',
            funcionarioNome: funcionario?.nome || 'Funcionário não encontrado'
          };
        });
      })
    );
  }

  private expandirDadosMovimentacao(movimentacao: Movimentacao): Movimentacao {
    // Esta função será expandida quando tivermos os dados do backend
    return movimentacao;
  }

  getMovimentacao(id: number): Observable<Movimentacao> {
    return this.http.get<Movimentacao>(`${this.apiUrl}/${id}`);
  }

  adicionarMovimentacao(movimentacao: Movimentacao): Observable<Movimentacao> {
    return this.http.post<Movimentacao>(this.apiUrl, movimentacao);
  }

  atualizarMovimentacao(id: number, movimentacao: Movimentacao): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, movimentacao);
  }

  removerMovimentacao(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  pesquisarMovimentacoes(termo: string): Observable<Movimentacao[]> {
    return this.http.get<Movimentacao[]>(`${this.apiUrl}/pesquisar?termo=${termo}`);
  }

  // Métodos auxiliares para buscar produtos e funcionários
  getProdutos(): Observable<ProdutoEstoque[]> {
    return this.http.get<ProdutoEstoque[]>(this.produtosUrl);
  }

  getFuncionarios(): Observable<Funcionario[]> {
    return this.http.get<Funcionario[]>(this.funcionariosUrl);
  }
}