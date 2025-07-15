import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { Inventario } from '../models/inventario.model';
import { InventarioService } from '../services/inventario.service';
import { ProdutoEstoque } from '../models/produto-estoque.model';

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.scss']
})
export class InventarioComponent implements OnInit {
  public isLoading: boolean = true;
  public listaCompletaInventario: Inventario[] = [];
  public inventarioExibido: Inventario[] = [];

  public produtos: ProdutoEstoque[] = [];

  modalAberto = false;
  registrarProduto: { nome: string; quantidade: number | null; valorTotal: number; produtoId?: number } = {
    nome: '',
    quantidade: null,
    valorTotal: 0,
  };

  constructor(private inventarioService: InventarioService) {}

  ngOnInit(): void {
    this.carregarInventario();
    this.carregarProdutos();
  }

  carregarInventario(): void {
    this.isLoading = true;
    this.inventarioService.getInventario().subscribe({
      next: (data) => {
        this.listaCompletaInventario = data;
        this.inventarioExibido = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar inventário:', error);
        this.isLoading = false;
      }
    });
  }

  carregarProdutos(): void {
    this.inventarioService.getProdutos().subscribe({
      next: (produtos) => {
        this.produtos = produtos;
      },
      error: (error) => {
        console.error('Erro ao carregar produtos:', error);
      }
    });
  }

  abrirModalRegistrar(): void {
    this.registrarProduto = {
      nome: '',
      quantidade: null,
      valorTotal: 0,
    };
    this.modalAberto = true;
  }

  fecharModal(): void {
    this.modalAberto = false;
  }

  onProdutoSelecionado(): void {
    const produtoSelecionado = this.produtos.find(p => p.nome === this.registrarProduto.nome);
    if (produtoSelecionado) {
      this.registrarProduto.quantidade = produtoSelecionado.quantidade;
      this.registrarProduto.valorTotal = produtoSelecionado.precoVenda * produtoSelecionado.quantidade;
      this.registrarProduto.produtoId = produtoSelecionado.id;
    } else {
      this.registrarProduto.quantidade = null;
      this.registrarProduto.valorTotal = 0;
      this.registrarProduto.produtoId = undefined;
    }
  }

  RegistrarProduto(): void {
    const produtoSelecionado = this.produtos.find(p => p.nome === this.registrarProduto.nome);

    if (!produtoSelecionado || this.registrarProduto.quantidade === null) return;

    const novoItem: Inventario = {
      produtoId: produtoSelecionado.id,
      nome: produtoSelecionado.nome,
      quantidade: produtoSelecionado.quantidade,
      valorTotal: produtoSelecionado.quantidade * produtoSelecionado.precoVenda
    };

    this.listaCompletaInventario.push(novoItem);
    this.inventarioExibido = [...this.listaCompletaInventario];

    this.fecharModal();
  }
}
