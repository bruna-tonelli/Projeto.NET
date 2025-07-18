import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { Movimentacao } from '../models/movimentacao.model';
import { ProdutoEstoque } from '../models/produto-estoque.model';
import { Funcionario } from '../models/funcionario.model';

@Injectable({
  providedIn: 'root'
})
export class MovimentacaoService {
  private apiUrl = 'http://localhost:5000/api/movimentacao'; // URL do API Gateway
  private produtosUrl = 'http://localhost:5000/api/produtos'; // URL do API Gateway para produtos
  private funcionariosUrl = 'http://localhost:5000/api/auth/users'; // URL do API Gateway para usuários

  constructor(private http: HttpClient) { }

  // Método básico para buscar movimentações sem expansão
  getMovimentacoes(): Observable<Movimentacao[]> {
    console.log('🔍 Buscando movimentações básicas...');
    return this.http.get<Movimentacao[]>(this.apiUrl).pipe(
      catchError(error => {
        console.error('❌ Erro ao buscar movimentações:', error);
        return of([]);
      })
    );
  }

  // Método principal para buscar movimentações com dados expandidos
  getMovimentacoesExpandidas(): Observable<Movimentacao[]> {
    console.log('🔍 Buscando movimentações expandidas...');
    return this.http.get<Movimentacao[]>(this.apiUrl).pipe(
      switchMap(movimentacoes => {
        console.log('📦 Movimentações recebidas:', movimentacoes?.length || 0);
        console.log('📦 Primeira movimentação recebida:', movimentacoes?.[0]);
        
        if (!movimentacoes || movimentacoes.length === 0) {
          console.log('📦 Nenhuma movimentação encontrada');
          return of([]);
        }

        // Buscar produtos e funcionários em paralelo
        return forkJoin({
          produtos: this.getProdutos().pipe(catchError(() => of([]))),
          funcionarios: this.getFuncionarios().pipe(catchError(() => of([])))
        }).pipe(
          map(({ produtos, funcionarios }) => {
            console.log('🏭 Produtos carregados:', produtos?.length || 0);
            console.log('👥 Funcionários carregados:', funcionarios?.length || 0);
            
            // Expandir cada movimentação com nomes
            return movimentacoes.map(mov => {
              const produto = produtos.find(p => p.id === mov.produtoId);
              const funcionario = funcionarios.find(f => String(f.id) === String(mov.funcionarioId));
              
              return {
                ...mov,
                produtoNome: produto?.nome || `Produto ID: ${mov.produtoId}`,
                funcionarioNome: funcionario?.nome || `Funcionário ID: ${mov.funcionarioId}`
              };
            });
          })
        );
      }),
      catchError(error => {
        console.error('❌ Erro ao buscar movimentações expandidas:', error);
        return of([]);
      })
    );
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
    return this.http.get<Movimentacao[]>(`${this.apiUrl}/pesquisar?termo=${termo}`).pipe(
      catchError(error => {
        console.error('❌ Erro ao pesquisar movimentações:', error);
        return of([]);
      })
    );
  }

  // Filtrar movimentações via backend
filtrarMovimentacoes(tipo?: string, dataInicial?: Date, dataFinal?: Date): Observable<Movimentacao[]> {
  let params = new URLSearchParams();
  
  try {
    if (tipo && tipo !== '') {
      params.append('tipo', tipo);
    }
    
    if (dataInicial) {
      let dataString: string;
      if (dataInicial instanceof Date) {
        dataString = dataInicial.toISOString();
      } else if (typeof dataInicial === 'string') {
        dataString = new Date(dataInicial).toISOString();
      } else {
        dataString = new Date(dataInicial as any).toISOString();
      }
      params.append('dataInicial', dataString);
    }
    
    if (dataFinal) {
      let dataString: string;
      if (dataFinal instanceof Date) {
        dataString = dataFinal.toISOString();
      } else if (typeof dataFinal === 'string') {
        dataString = new Date(dataFinal).toISOString();
      } else {
        dataString = new Date(dataFinal as any).toISOString();
      }
      params.append('dataFinal', dataString);
    }

    const url = `${this.apiUrl}/filtrar${params.toString() ? '?' + params.toString() : ''}`;
    console.log('🔍 URL de filtro:', url);
    console.log('🔍 Parâmetros processados:', params.toString());
    
    return this.http.get<Movimentacao[]>(url).pipe(
      catchError(error => {
        console.error('❌ Erro ao filtrar movimentações:', error);
        return of([]);
      })
    );
    
  } catch (error) {
    console.error('❌ Erro ao processar parâmetros de filtro:', error);
    return of([]);
  }
}

  // Expandir movimentações que já foram buscadas
  expandirMovimentacoes(movimentacoes: Movimentacao[]): Observable<Movimentacao[]> {
    if (!movimentacoes || movimentacoes.length === 0) {
      return of([]);
    }

    return forkJoin({
      produtos: this.getProdutos().pipe(catchError(() => of([]))),
      funcionarios: this.getFuncionarios().pipe(catchError(() => of([])))
    }).pipe(
      map(({ produtos, funcionarios }) => {
        return movimentacoes.map(mov => {
          const produto = produtos.find(p => p.id === mov.produtoId);
          const funcionario = funcionarios.find(f => String(f.id) === String(mov.funcionarioId));
          
          return {
            ...mov,
            produtoNome: produto?.nome || `Produto ID: ${mov.produtoId}`,
            funcionarioNome: funcionario?.nome || `Funcionário ID: ${mov.funcionarioId}`
          };
        });
      }),
      catchError(error => {
        console.error('❌ Erro ao expandir movimentações:', error);
        return of(movimentacoes); // Retorna as movimentações originais se der erro
      })
    );
  }

  // Métodos auxiliares para buscar produtos e funcionários
  getProdutos(): Observable<ProdutoEstoque[]> {
    return this.http.get<ProdutoEstoque[]>(this.produtosUrl).pipe(
      catchError(error => {
        console.error('❌ Erro ao buscar produtos:', error);
        return of([]);
      })
    );
  }

  getFuncionarios(): Observable<Funcionario[]> {
    return this.http.get<{success: boolean, message: string, data: Funcionario[]}>(this.funcionariosUrl).pipe(
      map(response => response.data || []),
      catchError(error => {
        console.error('❌ Erro ao buscar funcionários:', error);
        return of([]);
      })
    );
  }
}