import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProdutoEstoque } from '../../models/produto-estoque.model';
import { EstoqueService } from '../../services/estoque.service';

@Component({
  selector: 'app-estoque',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './estoque.component.html',
  styleUrls: ['./estoque.component.scss']
})
export class EstoqueComponent implements OnInit {
  public termoBusca: string = '';
  public isLoading: boolean = true;
  public estoqueExibido: ProdutoEstoque[] = [];
  public itemSelecionado: ProdutoEstoque | null = null; // Guarda o item clicado
  public pesquisaRealizada: boolean = false; // Adicionar propriedade faltante
  private listaCompletaEstoque: ProdutoEstoque[] = [];

  modalAberto = false;
  novoProduto: { nome: string; quantidade: number | null; precoUnitario: number | null; descricao: string } = {
    nome: '',
    quantidade: null,
    precoUnitario: null,
    descricao: ''
  };

  modalEditarAberto = false;
  produtoEditando: ProdutoEstoque | null = null;
  
  modalConfirmacaoAberto = false;
  produtoParaRemover: ProdutoEstoque | null = null;

  constructor(private estoqueService: EstoqueService) {}

  ngOnInit(): void {
    this.carregarEstoque();
  }

  carregarEstoque(): void {
    this.isLoading = true;
    console.log('Carregando estoque...');
    this.estoqueService.getEstoque().subscribe({
      next: (data) => {
        console.log('Dados recebidos:', data);
        this.listaCompletaEstoque = data;
        this.estoqueExibido = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar estoque:', error);
        this.isLoading = false;
      }
    });
  }

  // Função de busca em tempo real
  buscar(): void {
    if (!this.termoBusca) {
      this.estoqueExibido = this.listaCompletaEstoque;
      this.pesquisaRealizada = false;
      return;
    }
    const termo = this.termoBusca.toLowerCase();
    this.estoqueExibido = this.listaCompletaEstoque.filter(produto =>
      produto.nome.toLowerCase().includes(termo) ||
      (produto.id && produto.id.toString().toLowerCase().includes(termo))
    );
    this.pesquisaRealizada = true;
  }

  // Método para pesquisar por botão
  pesquisarPorBotao(): void {
    this.buscar();
  }

  // Método para limpar pesquisa
  limparPesquisa(): void {
    this.termoBusca = '';
    this.pesquisaRealizada = false;
    this.estoqueExibido = this.listaCompletaEstoque;
  }

  // Seleciona um item ao clicar
  selecionarItem(produto: ProdutoEstoque): void {
    if (this.itemSelecionado?.id === produto.id) {
      this.itemSelecionado = null; // Clicar de novo no mesmo item deseleciona
    } else {
      this.itemSelecionado = produto;
    }
  }

  // Edita apenas o item selecionado
  editar(): void {
    if (!this.itemSelecionado) {
      alert('Por favor, selecione um item da lista para editar.');
      return;
    }
    alert(`Editando o item: ${this.itemSelecionado.nome} (ID: ${this.itemSelecionado.id})`);
  }

  editarProduto(produto: ProdutoEstoque): void {
    this.produtoEditando = { ...produto };
    this.modalEditarAberto = true;
  }

  abrirModalAdicionar(): void {
    this.novoProduto = { nome: '', quantidade: null, precoUnitario: null, descricao: '' };
    this.modalAberto = true;
  }

  fecharModal(): void {
    this.modalAberto = false;
  }

  fecharModalEditar(): void {
    this.modalEditarAberto = false;
    this.produtoEditando = null;
  }

  adicionarProduto(): void {
    console.log('Tentando adicionar produto:', this.novoProduto);
    
    if (
      !this.novoProduto.nome ||
      this.novoProduto.quantidade === null ||
      this.novoProduto.quantidade === undefined ||
      this.novoProduto.quantidade < 0 ||
      this.novoProduto.precoUnitario === null ||
      this.novoProduto.precoUnitario === undefined ||
      this.novoProduto.precoUnitario < 0
    ) {
      console.log('Validação falhou:', {
        nome: this.novoProduto.nome,
        quantidade: this.novoProduto.quantidade,
        precoUnitario: this.novoProduto.precoUnitario
      });
      return;
    }

    const agora = new Date().toISOString();

    const produto = {
      nome: this.novoProduto.nome.trim(),
      quantidade: Number(this.novoProduto.quantidade),
      precoUnitario: Number(this.novoProduto.precoUnitario),
      descricao: this.novoProduto.descricao?.trim() || '',
      dataCadastro: agora,
      dataAtualizacao: agora,
      ativo: true
    };

    console.log('Enviando produto para API:', produto);

    this.estoqueService.adicionarProduto(produto as any).subscribe({
      next: (response) => {
        console.log('Produto adicionado com sucesso:', response);
        this.fecharModal();
        this.carregarEstoque();
      },
      error: (error) => {
        console.error('Erro ao adicionar produto:', error);
        alert('Erro ao adicionar produto. Verifique o console para mais detalhes.');
      }
    });
  }

  removerProduto(id: string | number): void {
    const numericId = typeof id === 'string' ? Number(id) : id;
    if (isNaN(numericId)) {
      return;
    }
    
    // Encontra o produto para mostrar no modal de confirmação
    this.produtoParaRemover = this.estoqueExibido.find(p => p.id === id) || null;
    this.modalConfirmacaoAberto = true;
  }

  cancelarRemocao(): void {
    this.modalConfirmacaoAberto = false;
    this.produtoParaRemover = null;
  }

  confirmarRemocaoFinal(): void {
    if (this.produtoParaRemover && this.produtoParaRemover.id !== undefined) {
      const numericId = typeof this.produtoParaRemover.id === 'string' 
        ? Number(this.produtoParaRemover.id) 
        : this.produtoParaRemover.id;
      
      if (!isNaN(numericId)) {
        this.estoqueService.removerProduto(numericId).subscribe(() => {
          this.carregarEstoque();
          if (this.itemSelecionado?.id === this.produtoParaRemover?.id) {
            this.itemSelecionado = null;
          }
          this.modalConfirmacaoAberto = false;
          this.produtoParaRemover = null;
        });
      }
    }
  }

  salvarEdicaoProduto(): void {
    if (
      !this.produtoEditando ||
      !this.produtoEditando.nome ||
      this.produtoEditando.quantidade === null ||
      this.produtoEditando.quantidade < 0 ||
      this.produtoEditando.precoUnitario === null ||
      this.produtoEditando.precoUnitario < 0
    ) return;

    // Atualiza dataAtualizacao
    this.produtoEditando.dataAtualizacao = new Date().toISOString();

    this.estoqueService.atualizarProduto(
      Number(this.produtoEditando.id),
      this.produtoEditando
    ).subscribe(() => {
      this.fecharModalEditar();
      this.carregarEstoque();
    });
  }
}