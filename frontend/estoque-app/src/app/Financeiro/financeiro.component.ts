import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Movimentacao } from '../models/movimentacao.model';
import { MovimentacaoService } from '../services/movimentacao.service';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';
import { FinanceiroService, ResumoMensal } from './financeiro.service';

export interface MovimentacaoFinanceira {
  id: number;
  produtoNome: string;
  quantidade: number;
  valorTotal: number;
  tipo: string;
  dataMovimentacao?: string;
}

@Component({
  selector: 'app-financeiro',
  standalone: true,
 imports: [
  CommonModule, 
  FormsModule,
  BaseChartDirective // <-- Linha nova e correta
],
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
  public caixaDaEmpresa: number = 0; // O saldo agora virá da API

  // --- Configurações do Gráfico ---
  public barChartType: ChartType = 'bar';
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { beginAtZero: true, ticks: { callback: value => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value)) } },
      x: { ticks: { autoSkip: false, maxRotation: 45, minRotation: 45 } }
    },
    plugins: {
      legend: { display: true, position: 'top' },
      tooltip: {
        callbacks: {
          label: context => ` ${context.dataset.label}: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(context.parsed.y)}`
        }
      }
    }
  };
  public barChartData: ChartConfiguration['data'] = {
    labels: [],
    datasets: [
      { data: [], label: 'Entradas (Vendas)', backgroundColor: '#28a745', borderRadius: 4 },
      { data: [], label: 'Saídas (Compras)', backgroundColor: '#dc3545', borderRadius: 4 }
    ]
  };

  constructor(
    private financeiroService: FinanceiroService,
    private movimentacaoService: MovimentacaoService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.carregarMovimentacoes();
    this.carregarDadosFinanceiros();
  }

  carregarMovimentacoes(): void {
    this.movimentacaoService.getMovimentacoesExpandidas().subscribe({
      next: (movimentacoes) => {
        this.listaCompletaMovimentacoes = movimentacoes.map(mov => this.converterParaMovimentacaoFinanceira(mov));
        this.movimentacoesExibidas = [...this.listaCompletaMovimentacoes]; // Cria uma nova referência para o array
      },
      error: (err) => console.error('Erro ao carregar movimentações', err),
      complete: () => {
        this.isLoading = false; // Finaliza o loading após todas as chamadas
      }
    });
  }

  carregarDadosFinanceiros(): void {
    // Busca o saldo da API
    this.financeiroService.getSaldo().subscribe(saldo => {
      this.caixaDaEmpresa = saldo;
    });

    // Busca os dados para o gráfico
    this.financeiroService.getResumoMensal().subscribe(resumos => {
      if (resumos && resumos.length > 0) {
        this.barChartData.labels = resumos.map(r => r.nomeMes);
        this.barChartData.datasets[0].data = resumos.map(r => r.totalEntradas);
        this.barChartData.datasets[1].data = resumos.map(r => r.totalSaidas);
      }
    });
  }

  private converterParaMovimentacaoFinanceira(movimentacao: Movimentacao): MovimentacaoFinanceira {
    let valorTotal = 0;
    const quantidade = movimentacao.quantidade || 0;

    if (movimentacao.tipo === 'ENTRADA') {
      valorTotal = -(quantidade * (movimentacao.precoCompra || 0));
    } else if (movimentacao.tipo === 'SAIDA' || movimentacao.tipo === 'SAÍDA') {
      valorTotal = quantidade * (movimentacao.precoVenda || 0);
    }
    return {
      id: movimentacao.id,
      produtoNome: movimentacao.produtoNome || 'N/A',
      quantidade: quantidade,
      valorTotal: valorTotal,
      tipo: movimentacao.tipo || 'N/A',
      dataMovimentacao: movimentacao.dataMovimentacao
    };
  }

  buscar(): void {
    if (!this.termoBusca) {
      this.movimentacoesExibidas = [...this.listaCompletaMovimentacoes];
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
    this.movimentacoesExibidas = [...this.listaCompletaMovimentacoes];
  }

  
}