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

  constructor(private estoqueService: EstoqueService) {}

  ngOnInit(): void {
    this.carregarEstoque();
  }

  carregarEstoque(): void {
    this.isLoading = true;
    this.estoqueService.getEstoque().subscribe(data => {
      this.listaCompletaEstoque = data;
      this.estoqueExibido = data;
      this.isLoading = false;
    });
  }

  // Função de busca em tempo real
  buscar(): void {
    if (!this.termoBusca) {
      this.estoqueExibido = this.listaCompletaEstoque;
      return;
    }
    const termo = this.termoBusca.toLowerCase();
    this.estoqueExibido = this.listaCompletaEstoque.filter(produto =>
      produto.nome.toLowerCase().includes(termo) ||
      (produto.id && produto.id.toLowerCase().includes(termo))
    );
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
    if (
      !this.novoProduto.nome ||
      this.novoProduto.quantidade === null ||
      this.novoProduto.quantidade < 0 ||
      this.novoProduto.precoUnitario === null ||
      this.novoProduto.precoUnitario < 0
    ) return;

    const agora = new Date().toISOString();

    this.estoqueService.adicionarProduto({
      nome: this.novoProduto.nome,
      quantidade: this.novoProduto.quantidade,
      precoUnitario: this.novoProduto.precoUnitario,
      descricao: this.novoProduto.descricao,
      dataCadastro: agora,
      dataAtualizacao: agora,
      ativo: true
    } as any).subscribe(() => {
      this.fecharModal();
      this.carregarEstoque();
    });
  }

  removerProduto(id: string | number): void {
    const numericId = typeof id === 'string' ? Number(id) : id;
    if (isNaN(numericId)) {
      alert('ID do produto inválido.');
      return;
    }
    if (confirm('Tem certeza que deseja remover este produto?')) {
      this.estoqueService.removerProduto(numericId).subscribe(() => {
        this.carregarEstoque();
        if (this.itemSelecionado?.id === id) {
          this.itemSelecionado = null;
        }
      });
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