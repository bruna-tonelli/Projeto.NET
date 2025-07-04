import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ProdutoEstoque } from '../models/produto-estoque.model';

@Injectable({
  providedIn: 'root'
})
export class EstoqueService {
  // Quando você tiver um backend, descomente a linha abaixo e coloque a URL real
  // private apiUrl = 'http://sua-api.com/produtos';

  constructor(private http: HttpClient) {}

  /**
   * Retorna um Observable com a lista de produtos do estoque.
   * Atualmente, simula uma chamada de rede com dados de exemplo.
   */
  getEstoque(): Observable<ProdutoEstoque[]> {
    const mockEstoque: ProdutoEstoque[] = [
      { id: '0001', nome: 'Monitor Gamer Curvo 27"', quantidade: 150 },
      { id: '0002', nome: 'Teclado Mecânico RGB', quantidade: 520 },
      { id: '0003', nome: 'Mouse sem Fio Logitech MX', quantidade: 849 },
      { id: '0004', nome: 'Webcam 4K com Microfone', quantidade: 320 },
      { id: '0005', nome: 'SSD NVMe Kingston 1TB', quantidade: 430 }
    ];

    // Simula um tempo de espera de 500ms, como se fosse uma requisição de rede real
    return of(mockEstoque).pipe(delay(500));

    // No futuro, você usará a linha abaixo para chamar sua API de verdade:
    // return this.http.get<ProdutoEstoque[]>(this.apiUrl);
  }
}