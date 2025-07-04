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
      produto.id.toLowerCase().includes(termo)
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
}