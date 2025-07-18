import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProdutoEstoque } from '../../models/produto-estoque.model';
import { EstoqueService } from '../../services/estoque.service';
import { DarkModeService } from '../../services/dark-mode.service';

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
  public modoEscuroAtivo: boolean = false;

  modalAberto = false;
  novoProduto: { nome: string; quantidade: number; precoCompra: number | null; precoVenda: number | null; descricao: string } = {
    nome: '',
    quantidade: 0, // Sempre 0 para novos produtos
    precoCompra: null,
    precoVenda: null,
    descricao: ''
  };


  modalEditarAberto = false;
  produtoEditando: ProdutoEstoque | null = null;

  modalConfirmacaoAberto = false;
  produtoParaRemover: ProdutoEstoque | null = null;

  modalFiltroAberto = false;

  filtroPorValorAtivado = false;

  filtros = {
    tipo: ''
  };


  constructor(
    private estoqueService: EstoqueService,
    private darkModeService: DarkModeService
  ) {}



  ngOnInit(): void {
    this.darkModeService.darkMode$.subscribe(isDark => {
      this.modoEscuroAtivo = isDark;
    });

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
    this.novoProduto = { nome: '', quantidade: 0, precoCompra: null, precoVenda: null, descricao: '' };
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
      this.novoProduto.precoCompra === null ||
      this.novoProduto.precoCompra === undefined ||
      this.novoProduto.precoCompra < 0 ||
      this.novoProduto.precoVenda === null ||
      this.novoProduto.precoVenda === undefined ||
      this.novoProduto.precoVenda < 0
    ) {
      console.log('Validação falhou:', {
        nome: this.novoProduto.nome,
        precoCompra: this.novoProduto.precoCompra,
        precoVenda: this.novoProduto.precoVenda
      });
      return;
    }

    const agora = new Date().toISOString();

    const produto = {
      nome: this.novoProduto.nome.trim(),
      quantidade: 0, // Sempre 0 para novos produtos
      precoCompra: Number(this.novoProduto.precoCompra),
      precoVenda: Number(this.novoProduto.precoVenda),
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

  aplicarFiltro(): void {
    this.estoqueExibido = this.listaCompletaEstoque.filter(produto => {
    const tipoOk = !this.filtros.tipo || produto.descricao.toLowerCase().includes(this.filtros.tipo.toLowerCase());
    return tipoOk;
  });

    this.fecharModalFiltrar();
  }

  abrirModalFiltrar(): void {
    this.modalFiltroAberto = true;
  }

  fecharModalFiltrar(): void {
    this.modalFiltroAberto = false;
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
      this.produtoEditando.precoCompra === null ||
      this.produtoEditando.precoCompra < 0 ||
      this.produtoEditando.precoVenda === null ||
      this.produtoEditando.precoVenda < 0
    ) return;

    // Buscar o produto original para preservar a quantidade
    const produtoOriginal = this.listaCompletaEstoque.find(p => p.id === this.produtoEditando!.id);
    if (!produtoOriginal) {
      alert('Erro: produto original não encontrado');
      return;
    }

    // Criar o objeto para atualização preservando a quantidade original
    const produtoParaAtualizar = {
      ...this.produtoEditando,
      quantidade: produtoOriginal.quantidade, // Preservar a quantidade original
      dataAtualizacao: new Date().toISOString()
    };

    this.estoqueService.atualizarProduto(
      Number(this.produtoEditando.id),
      produtoParaAtualizar
    ).subscribe(() => {
      this.fecharModalEditar();
      this.carregarEstoque();
    });
  }
}