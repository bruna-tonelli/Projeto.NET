import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Inventario, CreateInventarioDto, AddItemInventarioDto, ComparacaoInventario, DiferencaItem } from '../models/inventario.model';
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
  public inventarios: Inventario[] = [];
  public produtos: ProdutoEstoque[] = [];
  
  // Estados dos modais
  public modalNovoInventario = false;
  public modalAdicionarItens = false;
  public modalComparacao = false;
  public modalEdicao = false;

  // Dados do formulário
  public novoInventario: CreateInventarioDto = {
    nome: '',
    descricao: ''
  };

  public inventarioAtual: Inventario | null = null;
  public produtoSelecionado: ProdutoEstoque | null = null;
  public quantidadeDigitada: number = 0;
  public produtoAtualIndex = 0;
  public itensInventario: AddItemInventarioDto[] = [];

  // Dados da comparação
  public comparacao: ComparacaoInventario | null = null;
  public itemEditando: DiferencaItem | null = null;

  constructor(private inventarioService: InventarioService) {}

  ngOnInit(): void {
    this.carregarInventarios();
    this.carregarProdutos();
  }

  carregarInventarios(): void {
    this.isLoading = true;
    this.inventarioService.getInventarios().subscribe({
      next: (inventarios) => {
        this.inventarios = inventarios;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar inventários:', error);
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

  // === MODAL NOVO INVENTÁRIO ===
  abrirModalNovoInventario(): void {
    this.novoInventario = { nome: '', descricao: '' };
    this.modalNovoInventario = true;
  }

  fecharModalNovoInventario(): void {
    this.modalNovoInventario = false;
  }

  criarInventario(): void {
    if (!this.novoInventario.nome) {
      alert('Nome do inventário é obrigatório');
      return;
    }

    this.inventarioService.criarInventario(this.novoInventario).subscribe({
      next: (inventario) => {
        this.inventarios.unshift(inventario);
        this.fecharModalNovoInventario();
        this.iniciarAdicionarItens(inventario);
      },
      error: (error) => {
        console.error('Erro ao criar inventário:', error);
        alert('Erro ao criar inventário');
      }
    });
  }

  // === MODAL ADICIONAR ITENS ===
  iniciarAdicionarItens(inventario: Inventario): void {
    this.inventarioAtual = inventario;
    this.produtoAtualIndex = 0;
    this.itensInventario = [];
    this.proximoProduto();
    this.modalAdicionarItens = true;
  }

  proximoProduto(): void {
    if (this.produtoAtualIndex < this.produtos.length) {
      this.produtoSelecionado = this.produtos[this.produtoAtualIndex];
      this.quantidadeDigitada = 0;
    } else {
      this.finalizarAdicionarItens();
    }
  }

  adicionarItemAtual(): void {
  if (!this.produtoSelecionado || !this.inventarioAtual || !this.produtoSelecionado.id) {
    alert('Produto inválido selecionado');
    return;
  }

  const item: AddItemInventarioDto = {
    produtoId: this.produtoSelecionado.id,
    produtoNome: this.produtoSelecionado.nome,
    quantidadeContada: this.quantidadeDigitada,
    precoVenda: this.produtoSelecionado.precoVenda
  };

  this.inventarioService.adicionarItem(this.inventarioAtual.id, item).subscribe({
    next: () => {
      this.itensInventario.push(item);
      this.produtoAtualIndex++;
      this.proximoProduto();
    },
    error: (error) => {
      console.error('Erro ao adicionar item:', error);
      alert('Erro ao adicionar item');
    }
  });
}

  pularProduto(): void {
    this.produtoAtualIndex++;
    this.proximoProduto();
  }

  finalizarAdicionarItens(): void {
    this.modalAdicionarItens = false;
    this.carregarInventarios();
  }

  fecharModalAdicionarItens(): void {
    this.modalAdicionarItens = false;
  }

  // === COMPARAÇÃO ===
  compararInventario(inventario: Inventario): void {
    this.inventarioService.compararInventario(inventario.id).subscribe({
      next: (comparacao) => {
        this.comparacao = comparacao;
        this.modalComparacao = true;
      },
      error: (error) => {
        console.error('Erro ao comparar inventário:', error);
        alert('Erro ao comparar inventário');
      }
    });
  }

  fecharModalComparacao(): void {
    this.modalComparacao = false;
    this.comparacao = null;
  }

  // === EDIÇÃO ===
  editarItem(item: DiferencaItem): void {
    this.itemEditando = { ...item };
    this.modalEdicao = true;
  }

  salvarEdicao(): void {
    if (!this.itemEditando) return;

    const dto: AddItemInventarioDto = {
      produtoId: this.itemEditando.produtoId,
      produtoNome: this.itemEditando.produtoNome,
      quantidadeContada: this.itemEditando.quantidadeContada,
      precoVenda: 0 // Será obtido do backend
    };

    // Aqui você precisaria do itemId, que deveria vir da comparação
    // Por simplicidade, vou assumir que você tem uma forma de obter isso
    // this.inventarioService.editarItem(itemId, dto).subscribe(...)
    
    this.fecharModalEdicao();
  }

  fecharModalEdicao(): void {
    this.modalEdicao = false;
    this.itemEditando = null;
  }

  // === AÇÕES FINAIS ===
  atualizarEstoque(inventarioId: number): void {
    if (confirm('Tem certeza que deseja atualizar o estoque com base neste inventário? Esta ação não pode ser desfeita.')) {
      this.inventarioService.atualizarEstoque(inventarioId).subscribe({
        next: () => {
          alert('Estoque atualizado com sucesso!');
          this.fecharModalComparacao();
          this.carregarInventarios();
        },
        error: (error) => {
          console.error('Erro ao atualizar estoque:', error);
          alert('Erro ao atualizar estoque');
        }
      });
    }
  }

  // === UTILITÁRIOS ===
  getStatusClass(status: string): string {
    switch (status) {
      case 'Pendente': return 'status-pendente';
      case 'Comparado': return 'status-comparado';
      case 'Confirmado': return 'status-confirmado';
      default: return '';
    }
  }

  getTipoDiferencaClass(tipo: string): string {
    switch (tipo) {
      case 'Sobra': return 'diferenca-positiva';
      case 'Falta': return 'diferenca-negativa';
      case 'Igual': return 'diferenca-neutra';
      default: return '';
    }
  }

  get progressoAtual(): number {
    return this.produtos.length > 0 ? (this.produtoAtualIndex / this.produtos.length) * 100 : 0;
  }

  get produtoAtualNome(): string {
    return this.produtoSelecionado?.nome || '';
  }

  get produtoAtualEstoque(): number {
    return this.produtoSelecionado?.quantidade || 0;
  }
}
