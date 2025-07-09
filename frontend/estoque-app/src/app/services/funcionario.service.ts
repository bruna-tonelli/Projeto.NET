import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Funcionario } from '../models/funcionario.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FuncionarioService {
  private baseUrl = 'http://localhost:4200/funcionarios'; // Ajuste conforme seu backend

  constructor(private http: HttpClient) {}

  // Buscar todos os funcionários
  getFuncionarios(): Observable<Funcionario[]> {
    return this.http.get<Funcionario[]>(this.baseUrl);
  }

  // Pesquisar funcionários por nome ou id (assumindo que a API suporta ?q=)
  pesquisarFuncionarios(termo: string): Observable<Funcionario[]> {
    return this.http.get<Funcionario[]>(`${this.baseUrl}?q=${encodeURIComponent(termo)}`);
  }

  // Adicionar novo funcionário
  adicionarFuncionario(funcionario: Funcionario): Observable<Funcionario> {
    return this.http.post<Funcionario>(this.baseUrl, funcionario);
  }

  // Atualizar funcionário existente
  atualizarFuncionario(id: number, funcionario: Funcionario): Observable<Funcionario> {
    return this.http.put<Funcionario>(`${this.baseUrl}/${id}`, funcionario);
  }

  // Remover funcionário
  removerFuncionario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
