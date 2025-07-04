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
      mov.id.toLowerCase().includes(termo)
    );
  }

  selecionarItem(movimentacao: Movimentacao): void {
    if (this.itemSelecionado?.id === movimentacao.id && this.itemSelecionado?.tipo === movimentacao.tipo) {
      this.itemSelecionado = null;
    } else {
      this.itemSelecionado = movimentacao;
    }
  }

  editar(): void {
    if (!this.itemSelecionado) {
      alert('Por favor, selecione uma movimentação da lista para editar.');
      return;
    }
    alert(`Editando a movimentação do produto: ${this.itemSelecionado.nomeProduto}`);
  }
}