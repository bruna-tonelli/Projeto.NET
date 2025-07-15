import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  cargo: string;
  departamento: string;
  telefone: string;
  dataCriacao: Date;
  ultimoLogin?: Date;
  ativo: boolean;
  role: string;
  emailConfirmado: boolean;
}

export interface UsuarioDetalhes extends Usuario {
  role: string;
  emailConfirmado: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class FuncionarioService {
  private baseUrl = 'http://localhost:5000/api/auth'; // URL do API Gateway para UsuarioService

  constructor(private http: HttpClient) {}

  // Buscar todos os usuários registrados
  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<ApiResponse<Usuario[]>>(`${this.baseUrl}/users`)
      .pipe(map(response => response.data || []));
  }

  // Buscar usuário por ID para ver detalhes
  getUsuarioById(id: string): Observable<UsuarioDetalhes> {
    return this.http.get<ApiResponse<UsuarioDetalhes>>(`${this.baseUrl}/users/${id}`)
      .pipe(map(response => response.data));
  }

  // Pesquisar usuários (implementaremos se necessário)
  pesquisarUsuarios(termo: string): Observable<Usuario[]> {
    return this.http.get<ApiResponse<Usuario[]>>(`${this.baseUrl}/users?search=${termo}`)
      .pipe(map(response => response.data || []));
  }

  // Excluir usuário
  excluirUsuario(id: string): Observable<any> {
    return this.http.delete<ApiResponse<any>>(`${this.baseUrl}/users/${id}`)
      .pipe(map(response => response.data));
  }
}
