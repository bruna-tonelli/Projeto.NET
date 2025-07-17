import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  // ATENÇÃO: Verifique se esta URL corresponde à porta do seu backend .NET
  private readonly apiUrl = 'https://localhost:5000/api/Financeiro';

  constructor(private http: HttpClient) { }

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
}