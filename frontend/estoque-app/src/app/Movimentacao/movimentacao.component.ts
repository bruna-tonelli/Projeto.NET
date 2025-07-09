import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Movimentacao } from '../models/movimentacao.model';
import { MovimentacaoService } from '../services/movimentacao.service';

@Component({
  selector: 'app-movimentacao',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './movimentacao.component.html',
  styleUrls: ['./movimentacao.component.scss']
})
export class MovimentacaoComponent implements OnInit {
  public termoBusca: string = '';
  public isLoading: boolean = true;
  public movimentacoesExibidas: Movimentacao[] = [];
  public itemSelecionado: Movimentacao | null = null;
  private listaCompletaMovimentacoes: Movimentacao[] = [];
  public pesquisaRealizada: boolean = false; 


  modalAberto = false;
    novaMovimentacao: { tipo: string; quantidade: number; produto_id: number;} = {
      tipo: '',
      quantidade: 0,
      produto_id: 0
    };
  
    modalEditarAberto = false;
      movimentacaoEditando: Movimentacao | null = null;
  

  constructor(private movimentacaoService: MovimentacaoService) {}

  ngOnInit(): void {
    this.carregarMovimentacoes();
  }

  carregarMovimentacoes(): void {
    this.isLoading = true;
    this.movimentacaoService.getMovimentacoes().subscribe(data => {
      this.listaCompletaMovimentacoes = data;
      this.movimentacoesExibidas = data;
      this.isLoading = false;
    });
  }

  buscar(): void {
    if (!this.termoBusca) {
      this.movimentacoesExibidas = this.listaCompletaMovimentacoes;
      return;
    }
    const termo = this.termoBusca.toLowerCase();
    this.movimentacoesExibidas = this.listaCompletaMovimentacoes.filter(mov =>
      mov.nomeProduto.toLowerCase().includes(termo) ||
      String(mov.id).toLowerCase().includes(termo)
    );
  }

  adicionarMovimentacao(): void {
    if (
      !this.novaMovimentacao.tipo ||
      this.novaMovimentacao.quantidade === null ||
      this.novaMovimentacao.quantidade < 0 ||
      this.novaMovimentacao.produto_id === null ||
      this.novaMovimentacao.produto_id< 0
    ) return;
  }

  pesquisarPorBotao(): void {
    this.buscar();
  }

  limparPesquisa(): void {
    this.termoBusca = '';
    this.movimentacoesExibidas = this.listaCompletaMovimentacoes;
  }

  selecionarItem(movimentacao: Movimentacao): void {
    if (this.itemSelecionado?.id === movimentacao.id && this.itemSelecionado?.tipo === movimentacao.tipo) {
      this.itemSelecionado = null;
    } else {
      this.itemSelecionado = movimentacao;
    }
  }

  abrirModalAdicionar(): void {
    this.novaMovimentacao = { tipo: '', quantidade: 0, produto_id: 0};
    this.modalAberto = true;
  }

  fecharModal(): void {
    this.modalAberto = false;
  }

  

  editarMovimentacao(movimentacao: Movimentacao): void {
      this.movimentacaoEditando = { ...movimentacao };
      this.modalEditarAberto = true;
    }
}
