import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FuncionarioService, Usuario, UsuarioDetalhes } from '../services/funcionario.service';

@Component({
  selector: 'app-funcionario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './funcionario.component.html',
  styleUrls: ['./funcionario.component.scss']
})
export class FuncionarioComponent implements OnInit {
  usuarios: Usuario[] = [];
  usuariosExibidos: Usuario[] = [];
  usuarioSelecionado: Usuario | null = null;
  usuarioDetalhes: UsuarioDetalhes | null = null;
  usuarioParaExcluir: Usuario | null = null;
  termoBusca: string = '';
  pesquisaRealizada: boolean = false;
  isLoading: boolean = false;
  modalDetalhesAberto: boolean = false;
  modalConfirmacaoAberto: boolean = false;

  constructor(private funcionarioService: FuncionarioService) {}

  ngOnInit(): void {
    this.carregarUsuarios();
  }

  carregarUsuarios(): void {
    this.isLoading = true;
    this.funcionarioService.getUsuarios().subscribe({
      next: (usuarios) => {
        this.usuarios = usuarios || [];
        this.usuariosExibidos = this.usuarios;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar usuários:', error);
        this.usuarios = [];
        this.usuariosExibidos = [];
        this.isLoading = false;
      }
    });
  }

  buscar(): void {
    if (this.termoBusca.trim() === '') {
      this.usuariosExibidos = this.usuarios;
      this.pesquisaRealizada = false;
    } else {
      this.pesquisaRealizada = true;
      this.usuariosExibidos = this.usuarios.filter(usuario => 
        usuario.nome.toLowerCase().includes(this.termoBusca.toLowerCase()) ||
        usuario.email.toLowerCase().includes(this.termoBusca.toLowerCase()) ||
        usuario.cargo.toLowerCase().includes(this.termoBusca.toLowerCase()) ||
        usuario.id.toString().includes(this.termoBusca)
      );
    }
  }

  pesquisarPorBotao(): void {
    if (this.termoBusca.trim() === '') {
      this.usuariosExibidos = this.usuarios;
      this.pesquisaRealizada = false;
      return;
    }

    this.isLoading = true;
    this.funcionarioService.pesquisarUsuarios(this.termoBusca).subscribe({
      next: (usuarios) => {
        this.usuariosExibidos = usuarios || [];
        this.pesquisaRealizada = true;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao pesquisar usuários:', error);
        this.buscar(); // Fallback para busca local
        this.isLoading = false;
      }
    });
  }

  limparPesquisa(): void {
    this.termoBusca = '';
    this.usuariosExibidos = this.usuarios;
    this.pesquisaRealizada = false;
  }

  selecionarUsuario(usuario: Usuario): void {
    this.usuarioSelecionado = usuario;
  }

  verDetalhes(usuario: Usuario): void {
    this.usuarioDetalhes = usuario;
    this.modalDetalhesAberto = true;
  }

  confirmarExclusao(usuario: Usuario): void {
    this.usuarioParaExcluir = usuario;
    this.modalConfirmacaoAberto = true;
  }

  cancelarExclusao(): void {
    this.modalConfirmacaoAberto = false;
    this.usuarioParaExcluir = null;
  }

  confirmarExclusaoFinal(): void {
    if (this.usuarioParaExcluir) {
      this.excluirUsuario(this.usuarioParaExcluir);
      this.modalConfirmacaoAberto = false;
      this.usuarioParaExcluir = null;
    }
  }

  excluirUsuario(usuario: Usuario): void {
    this.isLoading = true;
    this.funcionarioService.excluirUsuario(usuario.id).subscribe({
      next: () => {
        // Remove o usuário da lista local
        this.usuarios = this.usuarios.filter(u => u.id !== usuario.id);
        this.usuariosExibidos = this.usuariosExibidos.filter(u => u.id !== usuario.id);
        
        // Limpa a seleção se o usuário excluído estava selecionado
        if (this.usuarioSelecionado?.id === usuario.id) {
          this.usuarioSelecionado = null;
        }
        
        this.isLoading = false;
        // Pode adicionar uma notificação de sucesso aqui
      },
      error: (error: any) => {
        console.error('Erro ao excluir usuário:', error);
        this.isLoading = false;
        // Pode adicionar uma notificação de erro aqui
      }
    });
  }

  fecharModalDetalhes(): void {
    this.modalDetalhesAberto = false;
    this.usuarioDetalhes = null;
  }

  formatarData(data: Date | string | undefined): string {
    if (!data) return 'Nunca';
    const dataObj = typeof data === 'string' ? new Date(data) : data;
    return dataObj.toLocaleDateString('pt-BR') + ' às ' + dataObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }
}
