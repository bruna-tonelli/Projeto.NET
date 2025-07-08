export interface Funcionario {
  id?: number;
  nome: string;
  cargo: string;
  email: string;
  salario: number;
  dataCadastro?: string;
  dataAtualizacao?: string;
  ativo?: boolean;
}
