import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TransacaoFinanceira } from '../models/transacao-financeira.model';

@Injectable({
  providedIn: 'root'
})
export class FinanceiroService {
  private apiUrl = 'api/transacoes'; // Ajuste para sua API

  constructor(private http: HttpClient) { }

  getTransacoes(): Observable<TransacaoFinanceira[]> {
    return this.http.get<TransacaoFinanceira[]>(this.apiUrl);
  }

  criarTransacao(transacao: Omit<TransacaoFinanceira, 'TRANSACAO_ID'>): Observable<TransacaoFinanceira> {
    return this.http.post<TransacaoFinanceira>(this.apiUrl, transacao);
  }
}