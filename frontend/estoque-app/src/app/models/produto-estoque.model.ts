export interface ProdutoEstoque {
  id?: string;
  nome: string;
  quantidade: number;
  precoUnitario: number;
  descricao: string;
  dataCadastro?: string;
  dataAtualizacao?: string;
  ativo?: boolean;
}