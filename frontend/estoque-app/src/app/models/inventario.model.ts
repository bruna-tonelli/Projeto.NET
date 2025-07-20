export interface Inventario {
  id: number;
  dataCriacao: Date;
  responsavel?: string;
  status?: string;
  produtos: InventarioProduto[];
  nome?: string; // Novo campo para o nome do inventário
}

export interface InventarioProduto {
  id: number;
  produtoId: number;
  quantidadeContada: number;
  inventarioId?: number;
}

export interface CreateInventarioDto {
  nome: string; // Mudança: agora pede apenas o nome
  responsavel?: string; // Será preenchido automaticamente
  status?: string; // Será sempre "Pendente"
}

export interface UpdateInventarioDto {
  nome?: string;
  responsavel?: string;
  status?: string;
}

export interface AddProdutoInventarioDto {
  produtoId: number;
  quantidadeContada: number;
  inventarioId?: number;
}

export interface Produto {
  id: number;
  nome: string;
  descricao: string;
  quantidade: number;
  precoCompra: number;
  precoVenda: number;
  ativo: boolean;
}