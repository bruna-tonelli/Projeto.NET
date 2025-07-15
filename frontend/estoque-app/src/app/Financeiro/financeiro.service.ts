import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TransacaoFinanceira, NovaTransacao } from '../models/transacao-financeira.model';

@Injectable({
  providedIn: 'root'
})
export class FinanceiroService {
  private readonly apiUrl = 'http://localhost:8083/api';

  constructor(private http: HttpClient) { }

  getTransacoes(): Observable<TransacaoFinanceira[]> {
    return this.http.get<TransacaoFinanceira[]>(`${this.apiUrl}/transacoes`);
  }

  getTransacao(id: number): Observable<TransacaoFinanceira> {
    return this.http.get<TransacaoFinanceira>(`${this.apiUrl}/transacoes/${id}`);
  }

  criarTransacao(transacao: NovaTransacao): Observable<TransacaoFinanceira> {
    return this.http.post<TransacaoFinanceira>(`${this.apiUrl}/transacoes`, transacao);
  }

  atualizarTransacao(id: number, transacao: Partial<TransacaoFinanceira>): Observable<TransacaoFinanceira> {
    return this.http.put<TransacaoFinanceira>(`${this.apiUrl}/transacoes/${id}`, transacao);
  }

  deletarTransacao(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/transacoes/${id}`);
  }
}
