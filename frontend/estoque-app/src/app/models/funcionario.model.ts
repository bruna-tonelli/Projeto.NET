export interface Funcionario {
  id?: string; // GUID como string
  nome: string;
  cargo: string;
  email: string;
  salario?: number;
  departamento?: string;
  telefone?: string;
  dataCadastro?: string;
  dataAtualizacao?: string;
  dataCriacao?: string;
  ultimoLogin?: string;
  ativo?: boolean;
}
