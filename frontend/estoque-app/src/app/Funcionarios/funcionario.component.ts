import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Funcionario } from '../models/funcionario.model';
import { FuncionarioService } from '../services/funcionario.service';

@Component({
  selector: 'app-funcionario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './funcionario.component.html',
  styleUrls: ['./funcionario.component.scss']
})
export class FuncionarioComponent implements OnInit {
  public termoBusca: string = '';
  public isLoading: boolean = true;
  public funcionariosExibidos: Funcionario[] = [];
  public funcionarioSelecionado: Funcionario | null = null;
  private listaCompletaFuncionarios: Funcionario[] = [];
  public pesquisaRealizada: boolean = false;

  modalAberto = false;
  modalEditarAberto = false;

  novoFuncionario: { nome: string; cargo: string; email: string; salario: number | null } = {
    nome: '',
    cargo: '',
    email: '',
    salario: null
  };

  funcionarioEditando: Funcionario | null = null;

  constructor(private funcionarioService: FuncionarioService) {}

  ngOnInit(): void {
    this.carregarFuncionarios();
  }

  carregarFuncionarios(): void {
    this.isLoading = true;
    this.funcionarioService.getFuncionarios().subscribe(data => {
      this.listaCompletaFuncionarios = data;
      this.funcionariosExibidos = data;
      this.isLoading = false;
    });
  }

  private searchTimeout: any;

  buscar(): void {
    this.pesquisaRealizada = false;
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    this.searchTimeout = setTimeout(() => {
      this.realizarPesquisa();
    }, 300);
  }

  private realizarPesquisa(): void {
    if (!this.termoBusca || this.termoBusca.trim() === '') {
      this.funcionariosExibidos = this.listaCompletaFuncionarios;
      return;
    }

    this.isLoading = true;
    this.funcionarioService.pesquisarFuncionarios(this.termoBusca.trim()).subscribe({
      next: (data) => {
        this.funcionariosExibidos = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro na pesquisa:', error);
        this.funcionariosExibidos = this.listaCompletaFuncionarios;
        this.isLoading = false;
      }
    });
  }

  pesquisarPorBotao(): void {
    this.pesquisaRealizada = true;
    if (!this.termoBusca.trim()) {
      this.funcionariosExibidos = this.listaCompletaFuncionarios;
      return;
    }

    this.isLoading = true;
    this.funcionarioService.pesquisarFuncionarios(this.termoBusca.trim()).subscribe({
      next: (data) => {
        this.funcionariosExibidos = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro na pesquisa:', error);
        this.funcionariosExibidos = this.listaCompletaFuncionarios;
        this.isLoading = false;
      }
    });
  }

  limparPesquisa(): void {
    this.termoBusca = '';
    this.pesquisaRealizada = false;
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    this.funcionariosExibidos = this.listaCompletaFuncionarios;
  }

  selecionarFuncionario(funcionario: Funcionario): void {
    if (this.funcionarioSelecionado?.id === funcionario.id) {
      this.funcionarioSelecionado = null;
    } else {
      this.funcionarioSelecionado = funcionario;
    }
  }

  editarFuncionario(funcionario: Funcionario): void {
    this.funcionarioEditando = { ...funcionario };
    this.modalEditarAberto = true;
  }

  abrirModalAdicionar(): void {
    this.novoFuncionario = { nome: '', cargo: '', email: '', salario: null };
    this.modalAberto = true;
  }

  fecharModal(): void {
    this.modalAberto = false;
  }

  fecharModalEditar(): void {
    this.modalEditarAberto = false;
    this.funcionarioEditando = null;
  }

  adicionarFuncionario(): void {
    if (
      !this.novoFuncionario.nome ||
      !this.novoFuncionario.cargo ||
      !this.novoFuncionario.email ||
      this.novoFuncionario.salario === null ||
      this.novoFuncionario.salario < 0
    ) return;

    const dataAtual = new Date().toISOString();

    const funcionario: Funcionario = {
  nome: this.novoFuncionario.nome,
  cargo: this.novoFuncionario.cargo,
  email: this.novoFuncionario.email,
  salario: this.novoFuncionario.salario ?? 0, // valor default caso esteja null
  dataCadastro: dataAtual,
  dataAtualizacao: dataAtual,
  ativo: true
};

    this.funcionarioService.adicionarFuncionario(funcionario).subscribe(() => {
      this.fecharModal();
      this.carregarFuncionarios();
    });
  }

  removerFuncionario(id: string | number): void {
    const numericId = typeof id === 'string' ? Number(id) : id;
    if (isNaN(numericId)) {
      alert('ID do funcionário inválido.');
      return;
    }

    if (confirm('Tem certeza que deseja remover este funcionário?')) {
      this.funcionarioService.removerFuncionario(numericId).subscribe(() => {
        this.carregarFuncionarios();
        if (this.funcionarioSelecionado?.id === id) {
          this.funcionarioSelecionado = null;
        }
      });
    }
  }

  salvarEdicaoFuncionario(): void {
    if (
      !this.funcionarioEditando ||
      !this.funcionarioEditando.nome ||
      !this.funcionarioEditando.cargo ||
      !this.funcionarioEditando.email ||
      this.funcionarioEditando.salario === null ||
      this.funcionarioEditando.salario < 0
    ) return;

    this.funcionarioEditando.dataAtualizacao = new Date().toISOString();

    this.funcionarioService.atualizarFuncionario(
      Number(this.funcionarioEditando.id),
      this.funcionarioEditando
    ).subscribe(() => {
      this.fecharModalEditar();
      this.carregarFuncionarios();
    });
  }
}
