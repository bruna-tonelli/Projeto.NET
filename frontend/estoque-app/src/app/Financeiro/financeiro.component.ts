import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransacaoFinanceira, NovaTransacao } from '../models/transacao-financeira.model';
import { FinanceiroService } from './financeiro.service';
import { MovimentacaoService } from '../services/movimentacao.service';
import { Movimentacao } from '../models/movimentacao.model';

// Interface para exibição na página financeiro
export interface MovimentacaoFinanceira {
  id: number;
  produtoNome: string;
  quantidade: number;
  valorTotal: number;
  tipo: string; // ENTRADA ou SAÍDA
  dataMovimentacao?: string;
}

@Component({
  selector: 'app-financeiro',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './financeiro.component.html',
  styleUrls: ['./financeiro.component.scss']
})
export class FinanceiroComponent implements OnInit {
  public termoBusca: string = '';
  public isLoading: boolean = true;
  public movimentacoesExibidas: MovimentacaoFinanceira[] = [];
  public itemSelecionado: MovimentacaoFinanceira | null = null;
  private listaCompletaMovimentacoes: MovimentacaoFinanceira[] = [];
  public pesquisaRealizada: boolean = false;
  
  // CaixaDaEmpresa - Inicia com R$ 100.000,00
  public caixaDaEmpresa: number = 100000.00;

  constructor(
    private financeiroService: FinanceiroService,
    private movimentacaoService: MovimentacaoService
  ) { 
    console.log('🎯 CONSTRUCTOR DO FINANCEIRO COMPONENT EXECUTADO! 🎯');
  }

  ngOnInit(): void {
    console.log('🚀 FINANCEIRO COMPONENT INICIALIZADO! 🚀');
    this.carregarMovimentacoes();
  }

  carregarMovimentacoes(): void {
    console.log('📊 CARREGANDO MOVIMENTAÇÕES FINANCEIRAS! 📊');
    this.isLoading = true;
    this.movimentacaoService.getMovimentacoesExpandidas().subscribe({
      next: (movimentacoes) => {
        // Converte movimentações para o formato financeiro
        this.listaCompletaMovimentacoes = movimentacoes.map(mov => this.converterParaMovimentacaoFinanceira(mov));
        this.movimentacoesExibidas = this.listaCompletaMovimentacoes;
        
        // Calcula o CaixaDaEmpresa com base nas movimentações
        this.calcularCaixaDaEmpresa();
        
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar movimentações', err);
        this.isLoading = false;
      }
    });
  }

  private converterParaMovimentacaoFinanceira(movimentacao: Movimentacao): MovimentacaoFinanceira {
    console.log('🔥 INICIANDO CONVERSÃO PARA MOVIMENTAÇÃO FINANCEIRA 🔥');
    console.log('Dados da movimentação recebida:', movimentacao);
    
    // Calcula o valor total baseado no tipo de movimentação
    let valorTotal = 0;
    const quantidade = movimentacao.quantidade || 0;
    
    console.log('Quantidade:', quantidade);
    console.log('Tipo:', movimentacao.tipo);
    console.log('PrecoCompra:', movimentacao.precoCompra);
    console.log('PrecoVenda:', movimentacao.precoVenda);
    
    if (movimentacao.tipo === 'ENTRADA') {
      // Para entrada: - (quantidade × precoCompra)
      const precoCompra = movimentacao.precoCompra || 0;
      valorTotal = -(quantidade * precoCompra);
      console.log('Cálculo ENTRADA:', quantidade, 'x', precoCompra, '=', valorTotal);
    } else if (movimentacao.tipo === 'SAIDA' || movimentacao.tipo === 'SAÍDA') {
      // Para saída: + (quantidade × precoVenda)
      const precoVenda = movimentacao.precoVenda || 0;
      valorTotal = quantidade * precoVenda;
      console.log('Cálculo SAÍDA:', quantidade, 'x', precoVenda, '=', valorTotal);
    }

    const resultado = {
      id: movimentacao.id,
      produtoNome: movimentacao.produtoNome || 'Produto não identificado',
      quantidade: quantidade,
      valorTotal: valorTotal,
      tipo: movimentacao.tipo || 'N/A',
      dataMovimentacao: movimentacao.dataMovimentacao
    };
    
    console.log('Resultado final:', resultado);
    return resultado;
  }

  private calcularCaixaDaEmpresa(): void {
    console.log('💰 CALCULANDO CAIXA DA EMPRESA 💰');
    
    // Inicia com R$ 100.000,00
    this.caixaDaEmpresa = 100000.00;
    console.log('Valor inicial do caixa:', this.caixaDaEmpresa);
    
    // Aplica cada movimentação ao caixa
    this.listaCompletaMovimentacoes.forEach(movimentacao => {
      const quantidade = movimentacao.quantidade || 0;
      
      if (movimentacao.tipo === 'ENTRADA') {
        // ENTRADA: Subtrai o custo da compra (quantidade × precoCompra)
        // Como valorTotal já está negativo, vamos somar diretamente
        this.caixaDaEmpresa += movimentacao.valorTotal;
        console.log(`📦 ENTRADA: ${quantidade} unidades - Custo: ${movimentacao.valorTotal} - Caixa: ${this.caixaDaEmpresa}`);
      } else if (movimentacao.tipo === 'SAIDA' || movimentacao.tipo === 'SAÍDA') {
        // SAÍDA: Adiciona a receita da venda (quantidade × precoVenda)
        this.caixaDaEmpresa += movimentacao.valorTotal;
        console.log(`💸 SAÍDA: ${quantidade} unidades - Receita: +${movimentacao.valorTotal} - Caixa: ${this.caixaDaEmpresa}`);
      }
    });
    
    console.log('💰 CAIXA FINAL DA EMPRESA:', this.caixaDaEmpresa);
  }

  buscar(): void {
    if (!this.termoBusca) {
      this.movimentacoesExibidas = this.listaCompletaMovimentacoes;
      return;
    }
    const termo = this.termoBusca.toLowerCase();
    this.movimentacoesExibidas = this.listaCompletaMovimentacoes.filter(m =>
      m.produtoNome.toLowerCase().includes(termo) ||
      String(m.id).includes(termo) ||
      m.tipo.toLowerCase().includes(termo)
    );
  }

  pesquisarPorBotao(): void {
    this.pesquisaRealizada = true;
    this.buscar();
  }

  limparPesquisa(): void {
    this.termoBusca = '';
    this.pesquisaRealizada = false;
    this.movimentacoesExibidas = this.listaCompletaMovimentacoes;
  }

  selecionarItem(movimentacao: MovimentacaoFinanceira): void {
    this.itemSelecionado = this.itemSelecionado?.id === movimentacao.id ?
      null :
      movimentacao;
  }
}