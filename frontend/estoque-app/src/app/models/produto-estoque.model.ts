export interface ProdutoEstoque {
  id?: number;
  nome: string;
  quantidade: number;
  precoUnitario: number;
  descricao: string;
  dataCadastro?: string;
  dataAtualizacao?: string;
  ativo?: boolean;
}