import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Inventario } from '../models/inventario.model';
import { InventarioService } from '../services/inventario.service';

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.scss']
})

export class InventarioComponent implements OnInit{ 
  public isLoading: boolean = true;
  private listaCompletaInventario: Inventario[] = [];
  public inventarioExibido: Inventario[] = [];

  modalAberto = false;
  registrarProduto: { nome: string; quantidade: number | null; valorTotal: number } = {
    nome: '',
    quantidade: null,
    valorTotal: 0
  };

  modalEditarAberto = false;
  produtoEditando: Inventario | null = null;

  constructor(private inventarioService: InventarioService) {}
    
    ngOnInit(): void {
        this.carregarInventario();
    }

    carregarInventario(): void {
        this.isLoading = true;
        console.log('Carregando inventário...');
        this.inventarioService.getInventario().subscribe({
            next: (data) => {
                console.log('Dados recebidos:', data);
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

    


    abrirModalRegistrar(): void {
        this.registrarProduto = {nome:'', quantidade: 0, valorTotal: 0};
        this.modalAberto = true;
    }

    fecharModal(): void {
        this.modalAberto = false;
    }

    RegistrarProduto(): void {
        if (
        !this.registrarProduto.nome ||
        this.registrarProduto.quantidade === null ||
        this.registrarProduto.quantidade < 0 ||
        this.registrarProduto.valorTotal === null 
        ) return;
    }




}















