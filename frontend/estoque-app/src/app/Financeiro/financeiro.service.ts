import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'; // ADICIONAR HttpParams
import { Observable, of } from 'rxjs'; // ADICIONAR of
import { map, catchError, switchMap} from 'rxjs/operators'; // ADICIONAR catchError
import { MovimentacaoService } from '../services/movimentacao.service';
import { Movimentacao } from '../models/movimentacao.model';

// Interface para os dados do gráfico que virão da API
export interface ResumoMensal {
  ano: number;
  mes: number;
  nomeMes: string;
  totalEntradas: number;
  totalSaidas: number;
}

@Injectable({
  providedIn: 'root'
})
export class FinanceiroService {
  private valorInicial = 100000.00;
  private readonly apiUrl = 'http://localhost:5000/api/Financeiro';

  constructor(
    private http: HttpClient,
    private movimentacaoService: MovimentacaoService
  ) { }

  getSaldoOperacional(): Observable<number> {
    return this.movimentacaoService.getMovimentacoes().pipe(
      map((movs: Movimentacao[]) => {
        console.log('Movimentações recebidas para saldo:', movs);
        
        let saldo = this.valorInicial;
        
        movs.forEach(mov => {
          if (mov.valorTotal && mov.valorTotal > 0) {
            if (mov.tipo === 'ENTRADA') {
              // ENTRADA = compra de produto = dinheiro saindo da empresa = SUBTRAIR
              saldo -= mov.valorTotal;
              console.log(`ENTRADA (${mov.produtoNome}): -${mov.valorTotal} | Saldo atual: ${saldo}`);
            } else if (mov.tipo === 'SAIDA') {
              // SAÍDA = venda de produto = dinheiro entrando na empresa = SOMAR
              saldo += mov.valorTotal;
              console.log(`SAÍDA (${mov.produtoNome}): +${mov.valorTotal} | Saldo atual: ${saldo}`);
            }
          } else if (mov.precoVenda && mov.precoVenda > 0) {
            // Fallback para usar precoVenda se valorTotal não estiver disponível
            const valor = mov.precoVenda * mov.quantidade;
            if (mov.tipo === 'ENTRADA') {
              saldo -= valor;
              console.log(`ENTRADA (${mov.produtoNome}): -${valor} | Saldo atual: ${saldo}`);
            } else if (mov.tipo === 'SAIDA') {
              saldo += valor;
              console.log(`SAÍDA (${mov.produtoNome}): +${valor} | Saldo atual: ${saldo}`);
            }
          }
        });
        
        console.log('Saldo operacional final:', saldo);
        return saldo;
      })
    );
  }

  /**
   * Busca o saldo operacional total calculado no backend.
   */
  getSaldo(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/saldo`);
  }

  /**
   * Busca os dados agregados por mês para o gráfico de entradas e saídas.
   */
  getResumoMensal(): Observable<ResumoMensal[]> {
    return this.http.get<ResumoMensal[]>(`${this.apiUrl}/resumo-mensal`);
  }

  /**
   * Calcula o resumo mensal baseado nas movimentações do frontend
   * (usado como fallback se a API não estiver disponível)
   */
  getResumoMensalLocal(): Observable<any> {
    return this.movimentacaoService.getMovimentacoes().pipe(
      map(movimentacoes => {
        console.log('Movimentações para gráfico:', movimentacoes);
        
        const resumo: { [key: string]: { entradas: number, saidas: number } } = {};
        
        movimentacoes.forEach(mov => {
          if (mov.dataMovimentacao && mov.valorTotal && mov.valorTotal > 0) {
            const data = new Date(mov.dataMovimentacao);
            const mesAno = `${String(data.getMonth() + 1).padStart(2, '0')}/${data.getFullYear()}`;
            
            if (!resumo[mesAno]) {
              resumo[mesAno] = { entradas: 0, saidas: 0 };
            }
            
            if (mov.tipo === 'ENTRADA') {
              // ENTRADA = gasto da empresa
              resumo[mesAno].entradas += mov.valorTotal;
            } else if (mov.tipo === 'SAIDA') {
              // SAÍDA = receita da empresa
              resumo[mesAno].saidas += mov.valorTotal;
            }
          } else if (mov.dataMovimentacao && mov.precoVenda && mov.precoVenda > 0) {
            // Fallback para usar precoVenda se valorTotal não estiver disponível
            const data = new Date(mov.dataMovimentacao);
            const mesAno = `${String(data.getMonth() + 1).padStart(2, '0')}/${data.getFullYear()}`;
            const valor = mov.precoVenda * mov.quantidade;
            
            if (!resumo[mesAno]) {
              resumo[mesAno] = { entradas: 0, saidas: 0 };
            }
            
            if (mov.tipo === 'ENTRADA') {
              resumo[mesAno].entradas += valor;
            } else if (mov.tipo === 'SAIDA') {
              resumo[mesAno].saidas += valor;
            }
          }
        });
        
        console.log('Resumo mensal calculado:', resumo);
        return resumo;
      })
    );
  }

  buscarTransacoesFiltradas(tipo?: string, dataInicial?: Date, dataFinal?: Date): Observable<Movimentacao[]> {
  // Usar o mesmo método que já funciona no MovimentacaoService
  return this.movimentacaoService.filtrarMovimentacoes(tipo, dataInicial, dataFinal).pipe(
    // Expandir os dados se necessário
    switchMap(movimentacoesFiltradas => {
      return this.movimentacaoService.expandirMovimentacoes(movimentacoesFiltradas);
    }),
    catchError(error => {
      console.error('Erro ao buscar transações filtradas:', error);
      return of([]);
    })
  );
}
}