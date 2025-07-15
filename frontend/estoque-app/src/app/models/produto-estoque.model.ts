export interface ProdutoEstoque {
  id?: number;
  nome: string;
  quantidade: number;
  precoCompra: number;
  precoVenda: number;
  descricao: string;
  dataCadastro?: string;
  dataAtualizacao?: string;
  ativo?: boolean;
}