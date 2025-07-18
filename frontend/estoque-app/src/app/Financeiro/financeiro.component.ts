import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Movimentacao } from '../models/movimentacao.model';
import { MovimentacaoService } from '../services/movimentacao.service';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType, ChartOptions } from 'chart.js';
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
    BaseChartDirective
  ],
  templateUrl: './financeiro.component.html',
  styleUrls: ['./financeiro.component.scss']
})
export class FinanceiroComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  
  public termoBusca: string = '';
  public isLoading: boolean = true;
  public movimentacoesExibidas: MovimentacaoFinanceira[] = [];
  public itemSelecionado: MovimentacaoFinanceira | null = null;
  public  listaCompletaMovimentacoes: MovimentacaoFinanceira[] = [];
  public pesquisaRealizada: boolean = false;
  public caixaDaEmpresa: number = 0;
  public dadosGrafico: boolean = false;
  
  // Controle de visibilidade do gráfico
  public mostrarGrafico: boolean = false;

  // Configurações do Gráfico simplificadas
  public barChartType: ChartType = 'bar';
  public barChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      }
    }
  };
  
  public barChartData: ChartConfiguration['data'] = {
    labels: [],
    datasets: [
      { 
        data: [], 
        label: 'Entradas', 
        backgroundColor: '#dc3545'
      },
      { 
        data: [], 
        label: 'Saídas', 
        backgroundColor: '#28a745'
      }
    ]
  };

  constructor(
    private financeiroService: FinanceiroService,
    private movimentacaoService: MovimentacaoService
  ) {}

  ngOnInit(): void {
    console.log('🏁 FinanceiroComponent iniciado');
    this.isLoading = true;
    this.carregarMovimentacoes();
    this.carregarDadosFinanceiros();
  }

  // Método para alternar visibilidade do gráfico
  toggleGrafico(): void {
    this.mostrarGrafico = !this.mostrarGrafico;
    console.log('Gráfico visível:', this.mostrarGrafico);
  }

  carregarMovimentacoes(): void {
    console.log('📦 Carregando movimentações para financeiro...');
    
    this.movimentacaoService.getMovimentacoesExpandidas().subscribe({
      next: (movimentacoes) => {
        console.log('📦 Movimentações recebidas:', movimentacoes?.length || 0);
        
        this.listaCompletaMovimentacoes = movimentacoes.map(mov => this.converterParaMovimentacaoFinanceira(mov));
        this.movimentacoesExibidas = [...this.listaCompletaMovimentacoes];
        
        console.log('💰 Movimentações convertidas:', this.listaCompletaMovimentacoes.length);
      },
      error: (err) => {
        console.error('❌ Erro ao carregar movimentações:', err);
      },
      complete: () => {
        console.log('✅ Carregamento de movimentações concluído');
        this.isLoading = false;
      }
    });
  }

  carregarDadosFinanceiros(): void {
    console.log('💰 Carregando dados financeiros...');
    
    // Busca o saldo operacional
    this.financeiroService.getSaldoOperacional().subscribe({
      next: (saldo) => {
        console.log('💰 Saldo operacional calculado:', saldo);
        this.caixaDaEmpresa = saldo;
      },
      error: (err) => {
        console.error('❌ Erro ao carregar saldo:', err);
      }
    });

    // Busca os dados para o gráfico
    this.movimentacaoService.getMovimentacoesExpandidas().subscribe({
      next: (movimentacoes) => {
        console.log('📊 Dados para gráfico:', movimentacoes?.length || 0);
        
        const resumoMensal = this.calcularResumoMensal(movimentacoes);
        console.log('📊 Resumo calculado:', resumoMensal);
        
        if (resumoMensal && resumoMensal.length > 0) {
          this.barChartData = {
            labels: resumoMensal.map(r => r.nomeMes),
            datasets: [
              { 
                data: resumoMensal.map(r => r.totalEntradas), 
                label: 'Entradas', 
                backgroundColor: '#dc3545'
              },
              { 
                data: resumoMensal.map(r => r.totalSaidas), 
                label: 'Saídas', 
                backgroundColor: '#28a745'
              }
            ]
          };
          
          this.dadosGrafico = true;
          console.log('📊 Gráfico configurado com sucesso');
        } else {
          console.log('⚠️ Nenhum dado para o gráfico');
          this.dadosGrafico = false;
        }
      },
      error: (err) => {
        console.error('❌ Erro ao carregar dados do gráfico:', err);
        this.dadosGrafico = false;
      }
    });
  }

  private calcularResumoMensal(movimentacoes: Movimentacao[]): ResumoMensal[] {
    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const resumoPorMes = new Map<string, { entradas: number, saidas: number }>();

    movimentacoes.forEach((mov) => {
      if (mov.dataMovimentacao && mov.precoVenda && mov.quantidade) {
        const data = new Date(mov.dataMovimentacao);
        const chave = `${data.getFullYear()}-${data.getMonth()}`;
        
        if (!resumoPorMes.has(chave)) {
          resumoPorMes.set(chave, { entradas: 0, saidas: 0 });
        }
        
        const resumo = resumoPorMes.get(chave)!;
        const valor = mov.precoVenda * mov.quantidade;
        
        if (mov.tipo === 'ENTRADA') {
          resumo.entradas += valor;
        } else if (mov.tipo === 'SAÍDA' || mov.tipo === 'SAIDA') {
          resumo.saidas += valor;
        }
      }
    });

    return Array.from(resumoPorMes.entries()).map(([chave, dados]) => {
      const [ano, mes] = chave.split('-').map(Number);
      return {
        ano,
        mes,
        nomeMes: `${meses[mes]}/${ano}`,
        totalEntradas: dados.entradas,
        totalSaidas: dados.saidas
      };
    }).sort((a, b) => a.ano - b.ano || a.mes - b.mes);
  }

  private converterParaMovimentacaoFinanceira(movimentacao: Movimentacao): MovimentacaoFinanceira {
    let valorTotal = 0;
    const quantidade = movimentacao.quantidade || 0;

    if (movimentacao.tipo === 'ENTRADA') {
      valorTotal = quantidade * (movimentacao.precoVenda || 0);
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