import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Movimentacao } from '../models/movimentacao.model';
import { MovimentacaoService } from '../services/movimentacao.service';
import { ProdutoEstoque } from '../models/produto-estoque.model';
import { Funcionario } from '../models/funcionario.model';
import { AuthService, UserInfo } from '../services/auth.service';

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
  public usuarioLogado: UserInfo | null = null;

  // Listas para seleção
  public produtos: ProdutoEstoque[] = [];
  public funcionarios: Funcionario[] = [];

  modalAberto = false;
  novaMovimentacao: { 
    tipo: string; 
    quantidade: number | null; 
    produtoId: number | null;
    funcionarioId: string | null;
    observacoes: string;
    precoCompra: number | null;
    precoVenda: number | null;
  } = {
    tipo: '',
    quantidade: null,
    produtoId: null,
    funcionarioId: null,
    observacoes: '',
    precoCompra: null,
    precoVenda: null
  };

  modalEditarAberto = false;
  movimentacaoEditando: Movimentacao | null = null;

  modalConfirmacaoAberto = false;
  movimentacaoParaRemover: Movimentacao | null = null;

  constructor(
    private movimentacaoService: MovimentacaoService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Obter o usuário logado
    this.usuarioLogado = this.authService.getCurrentUserValue();
    console.log('Usuário logado:', this.usuarioLogado);
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
      
      console.log('Produtos carregados:', this.produtos);
      console.log('Funcionários carregados:', this.funcionarios);
      
      // Encontrar o funcionário correspondente ao usuário logado
      if (this.usuarioLogado && this.funcionarios.length > 0) {
        const funcionarioCorrespondente = this.funcionarios.find(f => f.email === this.usuarioLogado?.email);
        console.log('Funcionário correspondente:', funcionarioCorrespondente);
        if (funcionarioCorrespondente && funcionarioCorrespondente.id) {
          this.novaMovimentacao.funcionarioId = funcionarioCorrespondente.id;
          console.log('FuncionarioId definido:', this.novaMovimentacao.funcionarioId);
        }
      }
      
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
    if (!this.novaMovimentacao.tipo || !this.novaMovimentacao.quantidade || this.novaMovimentacao.quantidade <= 0 || 
        !this.novaMovimentacao.produtoId || !this.novaMovimentacao.funcionarioId) {
      alert('Por favor, preencha todos os campos obrigatórios');
      console.log('Dados da movimentação:', this.novaMovimentacao);
      return;
    }

    const movimentacao: Movimentacao = {
      id: 0, // Will be set by backend
      tipo: this.novaMovimentacao.tipo,
      quantidade: this.novaMovimentacao.quantidade,
      produtoId: this.novaMovimentacao.produtoId,
      funcionarioId: this.novaMovimentacao.funcionarioId,
      observacoes: this.novaMovimentacao.observacoes,
      precoCompra: this.novaMovimentacao.precoCompra,
      precoVenda: this.novaMovimentacao.precoVenda,
      dataMovimentacao: new Date().toISOString()
    };

    console.log('Enviando movimentação:', movimentacao);

    this.movimentacaoService.adicionarMovimentacao(movimentacao).subscribe({
      next: (novaMovimentacao) => {
        console.log('Movimentação criada:', novaMovimentacao);
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
    console.log('=== ABRINDO MODAL ===');
    console.log('Usuario logado:', this.usuarioLogado);
    console.log('Funcionarios disponíveis:', this.funcionarios);
    
    // Usar diretamente o ID do usuário logado ao invés de buscar no sistema de funcionários
    let funcionarioId = null;
    if (this.usuarioLogado) {
      funcionarioId = this.usuarioLogado.id;
      console.log('Usando ID do usuário logado:', funcionarioId);
    }
    
    this.novaMovimentacao = { 
      tipo: '', 
      quantidade: null,
      produtoId: null,
      funcionarioId: funcionarioId,
      observacoes: '',
      precoCompra: null,
      precoVenda: null
    };
    console.log('Nova movimentação configurada:', this.novaMovimentacao);
    this.modalAberto = true;
  }

  fecharModal(): void {
    this.modalAberto = false;
  }

  onProdutoChange(): void {
    console.log('=== onProdutoChange chamado ===');
    console.log('ProdutoId selecionado:', this.novaMovimentacao.produtoId);
    console.log('Tipo do ProdutoId:', typeof this.novaMovimentacao.produtoId);
    console.log('Lista de produtos:', this.produtos);
    
    if (this.novaMovimentacao.produtoId) {
      // Converter para number se for string
      const produtoIdNumero = typeof this.novaMovimentacao.produtoId === 'string' 
        ? parseInt(this.novaMovimentacao.produtoId) 
        : this.novaMovimentacao.produtoId;
      
      console.log('ProdutoId convertido para número:', produtoIdNumero);
      
      const produtoSelecionado = this.produtos.find(p => p.id === produtoIdNumero);
      console.log('Produto encontrado:', produtoSelecionado);
      
      if (produtoSelecionado) {
        console.log('Preços do produto - Compra:', produtoSelecionado.precoCompra, 'Venda:', produtoSelecionado.precoVenda);
        this.novaMovimentacao.precoCompra = produtoSelecionado.precoCompra;
        this.novaMovimentacao.precoVenda = produtoSelecionado.precoVenda;
        console.log('Preços definidos na movimentação - Compra:', this.novaMovimentacao.precoCompra, 'Venda:', this.novaMovimentacao.precoVenda);
      } else {
        console.log('Produto não encontrado na lista!');
      }
    } else {
      console.log('Nenhum produto selecionado, limpando preços');
      this.novaMovimentacao.precoCompra = null;
      this.novaMovimentacao.precoVenda = null;
    }
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
    const movimentacao = this.movimentacoesExibidas.find(m => m.id === id);
    if (movimentacao) {
      this.movimentacaoParaRemover = movimentacao;
      this.modalConfirmacaoAberto = true;
    }
  }

  cancelarRemocao(): void {
    this.modalConfirmacaoAberto = false;
    this.movimentacaoParaRemover = null;
  }

  confirmarRemocaoFinal(): void {
    if (this.movimentacaoParaRemover) {
      this.movimentacaoService.removerMovimentacao(this.movimentacaoParaRemover.id).subscribe({
        next: () => {
          this.carregarDados();
          this.modalConfirmacaoAberto = false;
          this.movimentacaoParaRemover = null;
        },
        error: (error) => {
          console.error('Erro ao excluir movimentação:', error);
          this.modalConfirmacaoAberto = false;
          this.movimentacaoParaRemover = null;
        }
      });
    }
  }

  getFuncionarioLogadoNome(): string {
    if (!this.usuarioLogado) {
      return 'Usuário não identificado';
    }
    
    // Sempre usar o nome do usuário logado, que é mais confiável
    return this.usuarioLogado.name || 'Usuário sem nome';
  }
}
