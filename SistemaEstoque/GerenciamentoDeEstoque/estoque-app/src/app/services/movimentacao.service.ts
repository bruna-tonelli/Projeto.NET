import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Movimentacao } from '../models/movimentacao.model';

@Injectable({
  providedIn: 'root'
})
export class MovimentacaoService {

  constructor() { }

  getMovimentacoes(): Observable<Movimentacao[]> {
    const mockMovimentacoes: Movimentacao[] = [
      { id: '0001', nomeProduto: 'PRODUTO X', quantidade: 10001, tipo: 'COMPRA' },
      { id: '0001', nomeProduto: 'PRODUTO X', quantidade: 10001, tipo: 'VENDA' },
      { id: '0001', nomeProduto: 'PRODUTO X', quantidade: 10001, tipo: 'VENDA' },
      { id: '0001', nomeProduto: 'PRODUTO X', quantidade: 10001, tipo: 'COMPRA' }
    ];

    return of(mockMovimentacoes).pipe(delay(500));
  }
}