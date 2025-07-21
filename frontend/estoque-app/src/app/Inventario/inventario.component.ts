import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventarioService } from '../services/inventario.service';
import { AuthService } from '../services/auth.service';
import { 
  Inventario, 
  CreateInventarioDto, 
  UpdateInventarioDto, 
  AddProdutoInventarioDto,
  Produto 
} from '../models/inventario.model';

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.scss']
})
export class InventarioComponent implements OnInit {
  inventarios: Inventario[] = [];
  produtos: Produto[] = [];
  isLoading = false;

  // Modais
  modalNovoInventarioAberto = false;
  modalAdicionarProdutoAberto = false;

  // Dados dos formulários
  novoInventario: CreateInventarioDto = {
    nome: '',
    responsavel: '',
    status: 'Pendente'
  };

  inventarioSelecionado: Inventario | null = null;

  novoProdutoInventario: AddProdutoInventarioDto = {
    produtoId: 0,
    quantidadeContada: 0,
    inventarioId: 0
  };

  // Estado
  usuarioLogado: any;

  // Modais de confirmação
  modalConfirmacaoExclusao = false;
  modalConfirmacaoFinalizacao = false;
  inventarioParaExcluir: Inventario | null = null;
  modalConfirmacaoRemocaoProduto = false;
  produtoParaRemover: any = null;
diferencasEncontradas: any[] = [];

  // Toast notifications
  mensagemToast = '';
  toastSucessoVisivel = false;
  toastErroVisivel = false;

  constructor(
    private inventarioService: InventarioService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.carregarDados();
  }

  // === MÉTODOS DE INICIALIZAÇÃO ===

  private carregarDados(): void {
    this.carregarUsuarioLogado();
    this.carregarInventarios();
    this.carregarProdutos();
  }

  private carregarUsuarioLogado(): void {
    this.usuarioLogado = this.authService.getCurrentUser();
  }

  private carregarProdutos(): void {
  console.log('Carregando produtos...');
  this.inventarioService.obterProdutos().subscribe({
    next: (produtos) => {
      console.log('Produtos recebidos do backend:', produtos);
      this.produtos = produtos;
    },
    error: (error) => {
      console.error('Erro ao carregar produtos:', error);
    }
  });
}

  private carregarInventarios(): void {
  this.isLoading = true;
  this.inventarioService.listarInventarios().subscribe({
    next: (inventarios) => {
      this.inventarios = inventarios;
      
      // Se há um inventário selecionado, atualize-o com os dados mais recentes
      if (this.inventarioSelecionado) {
        const inventarioAtualizado = inventarios.find(i => i.id === this.inventarioSelecionado!.id);
        if (inventarioAtualizado) {
          this.inventarioSelecionado = inventarioAtualizado;
        }
      }
      
      this.isLoading = false;
    },
    error: (error) => {
      console.error('Erro ao carregar inventários:', error);
      this.isLoading = false;
    }
  });
}

  // === MÉTODOS DE INVENTÁRIO ===
  
  abrirModalNovoInventario(): void {
    this.modalNovoInventarioAberto = true;
    this.novoInventario = {
      nome: '',
      responsavel: this.usuarioLogado?.name || this.usuarioLogado?.email || '',
      status: 'Pendente'
    };
  }

  fecharModalNovoInventario(): void {
    this.modalNovoInventarioAberto = false;
  }

  criarInventario(): void {
    if (!this.novoInventario.nome.trim()) return;

    const inventarioData: CreateInventarioDto = {
      nome: this.novoInventario.nome,
      responsavel: this.usuarioLogado?.name || this.usuarioLogado?.email || 'Usuário',
      status: 'Pendente'
    };

    this.inventarioService.criarInventario(inventarioData).subscribe({
      next: () => {
        this.exibirToastSucesso('Inventário criado com sucesso!');
        this.fecharModalNovoInventario();
        this.carregarInventarios();
      },
      error: (error) => {
        console.error('Erro ao criar inventário:', error);
        this.exibirToastErro('Erro ao criar inventário.');
      }
    });
  }

  editarInventario(inventario: Inventario): void {
  // Garantir que os produtos estão carregados antes de abrir o modal
  if (!this.produtos || this.produtos.length === 0) {
    this.carregarProdutos();
  }
  
  this.inventarioSelecionado = inventario;
  this.novoProdutoInventario.inventarioId = inventario.id;
  this.abrirModalAdicionarProduto();
}

  confirmarExclusaoInventario(inventario: Inventario): void {
    this.inventarioParaExcluir = inventario;
    this.modalConfirmacaoExclusao = true;
  }

  cancelarExclusao(): void {
    this.modalConfirmacaoExclusao = false;
    this.inventarioParaExcluir = null;
  }

  confirmarExclusao(): void {
    if (this.inventarioParaExcluir) {
      this.inventarioService.excluirInventario(this.inventarioParaExcluir.id).subscribe({
        next: () => {
          this.exibirToastSucesso('Inventário excluído com sucesso!');
          this.cancelarExclusao();
          this.carregarInventarios();
        },
        error: (error) => {
          console.error('Erro ao excluir inventário:', error);
          this.exibirToastErro('Erro ao excluir inventário.');
        }
      });
    }
  }

  cancelarFinalizacao(): void {
    this.modalConfirmacaoFinalizacao = false;
  }

  finalizarInventario(): void {
    if (!this.inventarioSelecionado) return;

    const updateData: UpdateInventarioDto = {
      status: 'Finalizado'
    };

    // USAR O NOVO MÉTODO finalizarInventario QUE CHAMA O ENDPOINT /finalizar
    this.inventarioService.finalizarInventario(this.inventarioSelecionado.id, updateData).subscribe({
      next: () => {
        console.log('Inventário finalizado com sucesso');
        
        // Se há diferenças, aguardar um pouco para o backend processar
        if (this.diferencasEncontradas.length > 0) {
          console.log('Aguardando atualização de produtos...');
          // Aguardar 2 segundos para o backend processar
          setTimeout(() => {
            this.finalizacaoCompleta();
          }, 2000);
        } else {
          this.finalizacaoCompleta();
        }
      },
      error: (error) => {
        console.error('Erro ao finalizar inventário:', error);
        this.exibirToastErro('Erro ao finalizar inventário.');
      }
    });
  }


private atualizarQuantidadesProdutos(): void {
  // Este método não deveria ser chamado separadamente
  this.finalizacaoCompleta();
}

private finalizacaoCompleta(): void {
  this.exibirToastSucesso('Inventário finalizado e estoque atualizado com sucesso!');
  this.cancelarFinalizacao();
  this.fecharModalAdicionarProduto();
  this.carregarInventarios();
  this.carregarProdutos(); // Recarregar produtos para refletir as novas quantidades
}

  // === MÉTODOS DE PRODUTOS ===

  abrirModalAdicionarProduto(): void {
    this.modalAdicionarProdutoAberto = true;
    this.novoProdutoInventario = {
      produtoId: 0,
      quantidadeContada: 0,
      inventarioId: this.inventarioSelecionado?.id || 0
    };
  }

  fecharModalAdicionarProduto(): void {
    this.modalAdicionarProdutoAberto = false;
    this.inventarioSelecionado = null;
  }

  resetarFormularioProduto(): void {
  this.novoProdutoInventario = {
    produtoId: 0,
    quantidadeContada: 0,
    inventarioId: this.inventarioSelecionado?.id || 0
  };
}

  adicionarProdutoInventario(): void {
  if (!this.inventarioSelecionado || this.novoProdutoInventario.produtoId <= 0) return;

    // Verificar se os produtos foram carregados
  if (!this.produtos || this.produtos.length === 0) {
    console.warn('Lista de produtos não carregada, recarregando...');
    this.carregarProdutos();
    return;
  }

  // Inicializar array de produtos se não existir
  if (!this.inventarioSelecionado.produtos) {
    this.inventarioSelecionado.produtos = [];
  }

  // Verificar se o produto já foi adicionado
  const produtoJaAdicionado = this.inventarioSelecionado.produtos.some(p => p.produtoId === this.novoProdutoInventario.produtoId);
  if (produtoJaAdicionado) {
    this.exibirToastErro('Este produto já foi adicionado ao inventário.');
    return;
  }

  const produtoData: AddProdutoInventarioDto = {
    inventarioId: this.inventarioSelecionado.id,
    produtoId: this.novoProdutoInventario.produtoId,
    quantidadeContada: this.novoProdutoInventario.quantidadeContada
  };

  this.inventarioService.adicionarProduto(produtoData).subscribe({
    next: (response) => {
      console.log('Resposta do backend:', response); // Para debug
      this.exibirToastSucesso('Produto adicionado ao inventário!');
      
      // Atualizar APENAS o inventário selecionado localmente
      if (this.inventarioSelecionado) {
        if (!this.inventarioSelecionado.produtos) {
          this.inventarioSelecionado.produtos = [];
        }
        
        // Adicionar o produto à lista local
        this.inventarioSelecionado.produtos.push({
          id: response.id || Date.now(),
          produtoId: produtoData.produtoId,
          quantidadeContada: produtoData.quantidadeContada,
          inventarioId: produtoData.inventarioId
        });
        
        // Atualizar também na lista geral de inventários
        const index = this.inventarios.findIndex(i => i.id === this.inventarioSelecionado!.id);
        if (index !== -1) {
          this.inventarios[index] = { ...this.inventarioSelecionado };
        }
      }
      
      // Resetar formulário após atualizar a lista
      this.resetarFormularioProduto();
      
      // Atualizar também a lista geral de inventários para manter consistência
      this.atualizarInventarioNaLista();
    },
    error: (error) => {
      console.error('Erro ao adicionar produto:', error);
      this.exibirToastErro('Erro ao adicionar produto ao inventário.');
    }
  });
}

// Novo método para atualizar apenas o inventário específico na lista
private atualizarInventarioNaLista(): void {
  if (this.inventarioSelecionado) {
    const index = this.inventarios.findIndex(i => i.id === this.inventarioSelecionado!.id);
    if (index !== -1) {
      // Fazer uma cópia simples sem recarregar dados
      this.inventarios[index] = { 
        ...this.inventarios[index],
        produtos: [...(this.inventarioSelecionado.produtos || [])]
      };
    }
  }
}

// Modificar o método de remoção também para manter consistência
removerProdutoInventario(produto: any): void {
  if (!this.inventarioSelecionado || this.inventarioSelecionado.status === 'Finalizado') {
    return;
  }

  // Abrir modal customizado em vez do confirm padrão
  this.produtoParaRemover = produto;
  this.modalConfirmacaoRemocaoProduto = true;
}

// Métodos para remoção de produto
confirmarRemocaoProduto(): void {
  if (!this.produtoParaRemover) return;

  const inventarioProdutoId = this.produtoParaRemover.id;
  
  this.inventarioService.removerProdutoInventario(inventarioProdutoId).subscribe({
    next: () => {
      this.exibirToastSucesso('Produto removido do inventário!');
      
      // Remover o produto localmente da lista para atualização imediata
      if (this.inventarioSelecionado && this.inventarioSelecionado.produtos) {
        this.inventarioSelecionado.produtos = this.inventarioSelecionado.produtos
          .filter(p => p.id !== inventarioProdutoId);
      }
      
      // Atualizar também a lista geral de inventários
      this.atualizarInventarioNaLista();
      this.cancelarRemocaoProduto();
    },
    error: (error: any) => {
      console.error('Erro ao remover produto:', error);
      this.exibirToastErro('Erro ao remover produto do inventário.');
    }
  });
}

cancelarRemocaoProduto(): void {
  this.modalConfirmacaoRemocaoProduto = false;
  this.produtoParaRemover = null;
}

// Métodos para finalização com diferenças
confirmarFinalizarInventario(): void {
  if (!this.inventarioSelecionado) return;

  // Calcular diferenças antes de abrir o modal
  this.calcularDiferencasEstoque();
  this.modalConfirmacaoFinalizacao = true;
}

private calcularDiferencasEstoque(): void {
  this.diferencasEncontradas = [];
  
  if (!this.inventarioSelecionado?.produtos) return;

  this.inventarioSelecionado.produtos.forEach(produtoInventario => {
    const produtoReal = this.produtos.find(p => p.id === produtoInventario.produtoId);
    
    if (produtoReal) {
      const diferenca = produtoInventario.quantidadeContada - produtoReal.quantidade;
      
      if (diferenca !== 0) {
        this.diferencasEncontradas.push({
          nome: produtoReal.nome,
          quantidadeInventario: produtoInventario.quantidadeContada,
          quantidadeReal: produtoReal.quantidade,
          diferenca: diferenca,
          produtoId: produtoReal.id
        });
      }
    }
  });
}


  // === GETTERS ===

  // Getter para produtos que ainda não foram adicionados ao inventário
  get produtosDisponiveis(): Produto[] {
    if (!this.inventarioSelecionado || !this.inventarioSelecionado.produtos) {
      return this.produtos;
    }
    
    const produtosJaAdicionados = this.inventarioSelecionado.produtos.map(p => p.produtoId);
    return this.produtos.filter(produto => !produtosJaAdicionados.includes(produto.id));
  }

  get mostrarToastSucesso(): boolean {
    return this.toastSucessoVisivel;
  }

  get mostrarToastErro(): boolean {
    return this.toastErroVisivel;
  }

  // === MÉTODOS AUXILIARES ===

  private exibirToastSucesso(mensagem: string): void {
    this.mensagemToast = mensagem;
    this.toastSucessoVisivel = true;
    setTimeout(() => {
      this.toastSucessoVisivel = false;
    }, 4000);
  }

  private exibirToastErro(mensagem: string): void {
    this.mensagemToast = mensagem;
    this.toastErroVisivel = true;
    setTimeout(() => {
      this.toastErroVisivel = false;
    }, 4000);
  }

  private carregarInventarioAtual(): void {
    if (this.inventarioSelecionado) {
      this.inventarioService.listarInventarios().subscribe({
        next: (inventarios) => {
          this.inventarioSelecionado = inventarios.find(i => i.id === this.inventarioSelecionado!.id) || null;
        }
      });
    }
  }

  obterNomeProduto(produtoId: number): string {
  console.log('Procurando produto com ID:', produtoId);
  console.log('Lista de produtos disponível:', this.produtos);
  
  const produto = this.produtos.find(p => p.id === produtoId);
  console.log('Produto encontrado:', produto);
  
  return produto ? produto.nome : `Produto ID: ${produtoId}`;
}

  obterQuantidadeEstoque(produtoId: number): number {
    const produto = this.produtos.find(p => p.id === produtoId);
    return produto ? produto.quantidade : 0;
  }

  formatarData(data: Date): string {
    return new Date(data).toLocaleString('pt-BR');
  }

  getStatusClass(status?: string): string {
    switch (status?.toLowerCase()) {
      case 'pendente':
        return 'status-pendente';
      case 'finalizado':
        return 'status-finalizado';
      case 'em andamento':
        return 'status-em-andamento';
      default:
        return 'status-pendente';
    }
  }

  getInventarioNome(inventario: Inventario): string {
    return inventario.nome || `Inventário #${inventario.id}`;
  }

  // Método trackBy para melhor performance na lista
  trackByProdutoId(index: number, produto: any): number {
    return produto.id || produto.produtoId;
  }
}
