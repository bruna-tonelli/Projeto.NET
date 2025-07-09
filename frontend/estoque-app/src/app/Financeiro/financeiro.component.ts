import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransacaoFinanceira, NovaTransacao } from '../models/transacao-financeira.model';
import { FinanceiroService } from './financeiro.service';

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
  public transacoesExibidas: TransacaoFinanceira[] = [];
  public itemSelecionado: TransacaoFinanceira | null = null;
  private listaCompletaTransacoes: TransacaoFinanceira[] = [];
  public pesquisaRealizada: boolean = false;

  modalAberto = false;
  novaTransacao = {
    TIPO: '',
    VALOR_TOTAL: 0,
    MOVIMENTACAO_ID: 0
  };

  constructor(private financeiroService: FinanceiroService) { }

  ngOnInit(): void {
    this.carregarTransacoes();
  }

  carregarTransacoes(): void {
    this.isLoading = true;
    this.financeiroService.getTransacoes().subscribe({
      next: (data) => {
        this.listaCompletaTransacoes = data;
        this.transacoesExibidas = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar transações', err);
        this.isLoading = false;
      }
    });
  }

  adicionarTransacao(): void {
    // Validação dos campos
    if (
      !this.novaTransacao.TIPO ||
      this.novaTransacao.VALOR_TOTAL === null ||
      this.novaTransacao.VALOR_TOTAL <= 0 ||
      this.novaTransacao.MOVIMENTACAO_ID === null ||
      this.novaTransacao.MOVIMENTACAO_ID <= 0
    ) return;

    // Cria o objeto com o tipo correto
    const novaTransacao: NovaTransacao = {
      TIPO: this.novaTransacao.TIPO as 'COMPRA' | 'VENDA',
      VALOR_TOTAL: this.novaTransacao.TIPO === 'COMPRA' ? 
        -Math.abs(this.novaTransacao.VALOR_TOTAL) : 
        Math.abs(this.novaTransacao.VALOR_TOTAL),
      MOVIMENTACAO_ID: this.novaTransacao.MOVIMENTACAO_ID
    };

    // Chama o serviço
    this.financeiroService.criarTransacao(novaTransacao).subscribe({
      next: () => {
        this.carregarTransacoes();
        this.fecharModal();
      },
      error: (err) => console.error('Erro ao criar transação', err)
    });
  }


  buscar(): void {
    if (!this.termoBusca) {
      this.transacoesExibidas = this.listaCompletaTransacoes;
      return;
    }
    const termo = this.termoBusca.toLowerCase();
    this.transacoesExibidas = this.listaCompletaTransacoes.filter(t =>
      t.TIPO.toLowerCase().includes(termo) ||
      String(t.TRANSACAO_ID).includes(termo) ||
      String(t.MOVIMENTACAO_ID).includes(termo)
    );
  }

  pesquisarPorBotao(): void {
    this.pesquisaRealizada = true;
    this.buscar();
  }

  limparPesquisa(): void {
    this.termoBusca = '';
    this.pesquisaRealizada = false;
    this.transacoesExibidas = this.listaCompletaTransacoes;
  }

  selecionarItem(transacao: TransacaoFinanceira): void {
    this.itemSelecionado = this.itemSelecionado?.TRANSACAO_ID === transacao.TRANSACAO_ID ?
      null :
      transacao;
  }

  abrirModalAdicionar(): void {
    this.novaTransacao = { TIPO: '', VALOR_TOTAL: 0, MOVIMENTACAO_ID: 0 };
    this.modalAberto = true;
  }

  fecharModal(): void {
    this.modalAberto = false;
  }
}