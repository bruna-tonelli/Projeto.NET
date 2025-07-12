// Local: src/app/models/movimentacao.model.ts
export interface Movimentacao {
  id: number;
  quantidade: number;
  tipo: string; // Entrada, Saida, etc.
  produtoId?: number;
  funcionarioId?: string; // GUID como string
  dataMovimentacao?: string;
  observacoes?: string;
  precoCompra?: number | null;
  precoVenda?: number | null;
  // Dados expandidos para exibição
  produtoNome?: string;
  funcionarioNome?: string;
}