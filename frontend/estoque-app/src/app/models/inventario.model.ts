export interface Inventario {
  id: number;
  nome: string;
  descricao?: string;
  dataCriacao: Date;
  confirmado: boolean;
  status: string;
  itens: InventarioItem[];
}

export interface InventarioItem {
  id: number;
  produtoId: number;
  produtoNome: string;
  quantidadeContada: number;
  quantidadeEstoque: number;
  diferenca: number;
  precoVenda: number;
  valorTotal: number;
}

export interface CreateInventarioDto {
  nome: string;
  descricao?: string;
}

export interface AddItemInventarioDto {
  produtoId: number;
  produtoNome: string;
  quantidadeContada: number;
  precoVenda: number;
}

export interface ComparacaoInventario {
  inventarioId: number;
  nomeInventario: string;
  dataComparacao: Date;
  diferencas: DiferencaItem[];
}

export interface DiferencaItem {
  produtoId: number;
  produtoNome: string;
  quantidadeEstoque: number;
  quantidadeContada: number;
  diferenca: number;
  tipoDiferenca: string;
}