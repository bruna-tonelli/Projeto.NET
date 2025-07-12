import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Movimentacao } from '../models/movimentacao.model';
import { MovimentacaoService } from '../services/movimentacao.service';
import { ProdutoEstoque } from '../models/produto-estoque.model';
import { Funcionario } from '../models/funcionario.model';

@Component({
  selector: 'app-movimentacao',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './movimentacao.component.html',
  styleUrls: ['./movimentacao.component.scss']
})
export class MovimentacaoComponent implements OnInit {
  public termoBusca: string = '';
  public isLoading: boolean = true;
  public movimentacoesExibidas: Movimentacao[] = [];
  public itemSelecionado: Movimentacao | null = null;
  private listaCompletaMovimentacoes: Movimentacao[] = [];
  public pesquisaRealizada: boolean = false; 

  // Listas para seleção
  public produtos: ProdutoEstoque[] = [];
  public funcionarios: Funcionario[] = [];

  modalAberto = false;
  novaMovimentacao: { 
    tipo: string; 
    quantidade: number; 
    produtoId: number | null;
    funcionarioId: number | null;
    observacoes: string;
  } = {
    tipo: '',
    quantidade: 0,
    produtoId: null,
    funcionarioId: null,
    observacoes: ''
  };

  modalEditarAberto = false;
  movimentacaoEditando: Movimentacao | null = null;

  constructor(private movimentacaoService: MovimentacaoService) {}

  ngOnInit(): void {
    this.carregarDados();
  }

  carregarDados(): void {
    this.isLoading = true;
    // Carregar produtos, funcionários e movimentações
    Promise.all([
      this.movimentacaoService.getProdutos().toPromise(),
      this.movimentacaoService.getFuncionarios().toPromise(),
      this.movimentacaoService.getMovimentacoesExpandidas().toPromise()
    ]).then(([produtos, funcionarios, movimentacoes]) => {
      this.produtos = produtos || [];
      this.funcionarios = funcionarios || [];
      this.listaCompletaMovimentacoes = movimentacoes || [];
      this.movimentacoesExibidas = movimentacoes || [];
      this.isLoading = false;
    }).catch(error => {
      console.error('Erro ao carregar dados:', error);
      this.isLoading = false;
    });
  }

  buscar(): void {
    if (!this.termoBusca) {
      this.movimentacoesExibidas = this.listaCompletaMovimentacoes;
      return;
    }
    
    this.movimentacaoService.pesquisarMovimentacoes(this.termoBusca).subscribe({
      next: (data) => {
        this.movimentacoesExibidas = data;
        this.pesquisaRealizada = true;
      },
      error: (error) => {
        console.error('Erro na pesquisa:', error);
      }
    });
  }

  adicionarMovimentacao(): void {
    if (!this.novaMovimentacao.tipo || this.novaMovimentacao.quantidade <= 0 || 
        !this.novaMovimentacao.produtoId || !this.novaMovimentacao.funcionarioId) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    const movimentacao: Movimentacao = {
      id: 0, // Will be set by backend
      tipo: this.novaMovimentacao.tipo,
      quantidade: this.novaMovimentacao.quantidade,
      produtoId: this.novaMovimentacao.produtoId,
      funcionarioId: this.novaMovimentacao.funcionarioId,
      observacoes: this.novaMovimentacao.observacoes,
      dataMovimentacao: new Date().toISOString()
    };

    this.movimentacaoService.adicionarMovimentacao(movimentacao).subscribe({
      next: (novaMovimentacao) => {
        this.carregarDados();
        this.fecharModal();
      },
      error: (error) => {
        console.error('Erro ao adicionar movimentação:', error);
      }
    });
  }

  pesquisarPorBotao(): void {
    this.buscar();
  }

  limparPesquisa(): void {
    this.termoBusca = '';
    this.movimentacoesExibidas = this.listaCompletaMovimentacoes;
    this.pesquisaRealizada = false;
  }

  selecionarItem(movimentacao: Movimentacao): void {
    if (this.itemSelecionado?.id === movimentacao.id) {
      this.itemSelecionado = null;
    } else {
      this.itemSelecionado = movimentacao;
    }
  }

  abrirModalAdicionar(): void {
    this.novaMovimentacao = { 
      tipo: '', 
      quantidade: 0,
      produtoId: null,
      funcionarioId: null,
      observacoes: ''
    };
    this.modalAberto = true;
  }

  fecharModal(): void {
    this.modalAberto = false;
  }

  editarMovimentacao(movimentacao: Movimentacao): void {
    this.movimentacaoEditando = { ...movimentacao };
    this.modalEditarAberto = true;
  }

  salvarEdicao(): void {
    if (!this.movimentacaoEditando) return;

    this.movimentacaoService.atualizarMovimentacao(this.movimentacaoEditando.id, this.movimentacaoEditando).subscribe({
      next: () => {
        this.carregarDados();
        this.fecharModalEdicao();
      },
      error: (error) => {
        console.error('Erro ao atualizar movimentação:', error);
      }
    });
  }

  fecharModalEdicao(): void {
    this.modalEditarAberto = false;
    this.movimentacaoEditando = null;
  }

  excluirMovimentacao(id: number): void {
    if (confirm('Tem certeza que deseja excluir esta movimentação?')) {
      this.movimentacaoService.removerMovimentacao(id).subscribe({
        next: () => {
          this.carregarDados();
        },
        error: (error) => {
          console.error('Erro ao excluir movimentação:', error);
        }
      });
    }
  }
}
