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
      { id: '01', nomeProduto: 'PRODUTO X', quantidade: 1, tipo: 'COMPRA' },
      { id: '02', nomeProduto: 'PRODUTO Y', quantidade: 1, tipo: 'VENDA' },
      { id: '03', nomeProduto: 'PRODUTO Z', quantidade: 1, tipo: 'VENDA' },
      { id: '04', nomeProduto: 'PRODUTO W', quantidade: 1, tipo: 'COMPRA' }
    ];

    return of(mockMovimentacoes).pipe(delay(500));
  }
}