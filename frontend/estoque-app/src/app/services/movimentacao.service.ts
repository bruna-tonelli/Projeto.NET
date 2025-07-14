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

  getMovimentacoes(): Observable<Movimentacao[]> {
    return this.http.get<Movimentacao[]>(this.apiUrl).pipe(
      map(movimentacoes => {
        // Para cada movimentação, buscar informações do produto e funcionário
        return movimentacoes.map(mov => this.expandirDadosMovimentacao(mov));
      })
    );
  }

  getMovimentacoesExpandidas(): Observable<Movimentacao[]> {
    console.log('🔍 Buscando movimentações expandidas...');
    return this.http.get<Movimentacao[]>(this.apiUrl).pipe(
      switchMap(movimentacoes => {
        console.log('📦 Movimentações recebidas:', movimentacoes?.length || 0);
        console.log('📦 Primeira movimentação recebida:', movimentacoes?.[0]);
        
        if (!movimentacoes || movimentacoes.length === 0) {
          return of([]);
        }

        // Primeiro, buscar todos os produtos e funcionários uma única vez
        return forkJoin({
          produtos: this.getProdutos().pipe(catchError(() => of([]))),
          funcionarios: this.getFuncionarios().pipe(catchError(() => of([])))
        }).pipe(
          map(({ produtos, funcionarios }) => {
            console.log('🏭 Produtos carregados:', produtos?.length || 0);
            console.log('👥 Funcionários carregados:', funcionarios?.length || 0);
            console.log('👥 Primeiro funcionário:', funcionarios?.[0]);
            
            // Mapear movimentações com os nomes dos produtos e funcionários
            return movimentacoes.map(mov => {
              const produto = produtos.find(p => p.id === mov.produtoId);
              
              console.log(`🔍 Movimentação ${mov.id}:`);
              console.log(`   - funcionarioId da movimentação: "${mov.funcionarioId}"`);
              console.log(`   - tipo do funcionarioId: ${typeof mov.funcionarioId}`);
              console.log(`   - lista de funcionários disponíveis:`, funcionarios.map(f => ({id: f.id, nome: f.nome, tipo: typeof f.id})));
              
              // Busca mais robusta do funcionário - comparando strings
              let funcionario = funcionarios.find(f => {
                const funcId = String(f.id).trim().toLowerCase();
                const movFuncId = String(mov.funcionarioId).trim().toLowerCase();
                console.log(`   - comparando: "${funcId}" === "${movFuncId}" = ${funcId === movFuncId}`);
                console.log(`   - f.id original:`, f.id, typeof f.id);
                console.log(`   - mov.funcionarioId original:`, mov.funcionarioId, typeof mov.funcionarioId);
                return funcId === movFuncId;
              });

              // Se não encontrou, tenta busca mais flexível
              if (!funcionario) {
                console.log(`   - ⚠️ Funcionário não encontrado com busca exata, tentando busca flexível...`);
                funcionario = funcionarios.find(f => 
                  f.id === mov.funcionarioId || 
                  String(f.id) === String(mov.funcionarioId) ||
                  (f.id && f.id.toString().includes(String(mov.funcionarioId))) ||
                  (f.id && String(mov.funcionarioId).includes(f.id.toString()))
                );
                if (funcionario) {
                  console.log(`   - ✅ Funcionário encontrado com busca flexível:`, funcionario);
                }
              }
              
              console.log(`   - funcionário encontrado:`, funcionario);
              console.log(`   - nome do funcionário: ${funcionario?.nome}`);
              
              const resultado = {
                ...mov,
                produtoNome: produto?.nome || `Produto ID: ${mov.produtoId}`,
                funcionarioNome: funcionario?.nome || `Funcionário não encontrado (ID: ${mov.funcionarioId})`
              };
              
              console.log(`   - resultado final:`, resultado);
              return resultado;
            });
          })
        );
      }),
      catchError(error => {
        console.error('❌ Erro ao buscar movimentações:', error);
        return of([]);
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
    return this.http.get<{success: boolean, message: string, data: Funcionario[]}>(this.funcionariosUrl).pipe(
      map(response => response.data || [])
    );
  }
}