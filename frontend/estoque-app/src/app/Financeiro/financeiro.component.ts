import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpParams } from '@angular/common/http';
import { Movimentacao } from '../models/movimentacao.model';
import { MovimentacaoService } from '../services/movimentacao.service';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType, ChartOptions } from 'chart.js';
import { FinanceiroService, ResumoMensal } from './financeiro.service';
import { DarkModeService } from '../services/dark-mode.service';

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

  modalFiltroAberto = false;
  
  filtros = {
    tipo: '',
    dataInicial: null as string | Date | null,
    dataFinal: null as string | Date | null,
  };
  
  public termoBusca: string = '';
  public isLoading: boolean = true;
  public movimentacoesExibidas: MovimentacaoFinanceira[] = [];
  public itemSelecionado: MovimentacaoFinanceira | null = null;
  public listaCompletaMovimentacoes: MovimentacaoFinanceira[] = [];
  public pesquisaRealizada: boolean = false;
  public caixaDaEmpresa: number = 0;
  public dadosGrafico: boolean = false;
  public modoEscuroAtivo: boolean = false;
  
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
  private movimentacaoService: MovimentacaoService,
  private darkModeService: DarkModeService
) {}

  ngOnInit(): void {
  console.log('🏁 FinanceiroComponent iniciado');
  
  // Inscrever-se no serviço de modo escuro
  this.darkModeService.darkMode$.subscribe(isDark => {
    this.modoEscuroAtivo = isDark;
  });
  
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

  abrirModalFiltrar(): void {
    this.modalFiltroAberto = true;
  }

  fecharModalFiltrar(): void {
    this.modalFiltroAberto = false;
  }

  aplicarFiltro(): void {
    console.log('🔍 Iniciando aplicação de filtros...');
    
    // Se não houver filtros, mostrar todas as transações
    if (!this.filtros.tipo && !this.filtros.dataInicial && !this.filtros.dataFinal) {
      console.log('📝 Nenhum filtro aplicado, carregando todas as movimentações');
      this.carregarMovimentacoes();
      this.fecharModalFiltrar();
      return;
    }

    // Validar e converter datas de forma mais segura
    let dataInicial: Date | undefined = undefined;
    let dataFinal: Date | undefined = undefined;

    try {
      if (this.filtros.dataInicial) {
        if (typeof this.filtros.dataInicial === 'string') {
          dataInicial = new Date(this.filtros.dataInicial + 'T00:00:00');
        } else {
          dataInicial = new Date(this.filtros.dataInicial);
        }
        
        // Validar se a data é válida
        if (isNaN(dataInicial.getTime())) {
          console.error('Data inicial inválida:', this.filtros.dataInicial);
          dataInicial = undefined;
        }
      }

      if (this.filtros.dataFinal) {
        if (typeof this.filtros.dataFinal === 'string') {
          dataFinal = new Date(this.filtros.dataFinal + 'T23:59:59');
        } else {
          dataFinal = new Date(this.filtros.dataFinal);
          dataFinal.setHours(23, 59, 59, 999);
        }
        
        // Validar se a data é válida
        if (isNaN(dataFinal.getTime())) {
          console.error('Data final inválida:', this.filtros.dataFinal);
          dataFinal = undefined;
        }
      }
    } catch (error) {
      console.error('Erro ao processar datas:', error);
      alert('Erro: Datas inválidas. Por favor, verifique os campos de data.');
      return;
    }

    console.log('🔍 Aplicando filtros:', {
      tipo: this.filtros.tipo,
      dataInicial: dataInicial?.toISOString(),
      dataFinal: dataFinal?.toISOString()
    });

    // Verificar se o método existe no service
    if (typeof this.financeiroService.buscarTransacoesFiltradas !== 'function') {
      console.error('❌ Método buscarTransacoesFiltradas não encontrado no service');
      alert('Erro: Funcionalidade de filtro não está disponível.');
      this.fecharModalFiltrar();
      return;
    }

    // Aplicar filtros via service
    this.financeiroService.buscarTransacoesFiltradas(
      this.filtros.tipo || undefined,
      dataInicial,
      dataFinal
    ).subscribe({
      next: (movimentacoes) => {
        console.log('✅ Movimentações filtradas recebidas:', movimentacoes.length);
        
        // Converter para MovimentacaoFinanceira
        this.listaCompletaMovimentacoes = movimentacoes.map(mov => this.converterParaMovimentacaoFinanceira(mov));
        this.movimentacoesExibidas = [...this.listaCompletaMovimentacoes];
        
        console.log('💰 Filtro aplicado com sucesso:', this.movimentacoesExibidas.length, 'resultados');
        this.fecharModalFiltrar();
      },
      error: (error) => {
        console.error('❌ Erro ao aplicar filtros:', error);
        alert('Erro ao aplicar filtros. Tente novamente.');
        this.fecharModalFiltrar();
      }
    });
  }

  limparFiltros(): void {
    this.filtros = {
      tipo: '',
      dataInicial: null,
      dataFinal: null,
    };
    this.carregarMovimentacoes();
    this.fecharModalFiltrar();
  }
}