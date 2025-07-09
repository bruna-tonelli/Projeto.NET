// Local: src/app/models/movimentacao.model.ts
export interface Movimentacao {
  id: string;
  nomeProduto: string;
  quantidade: number;
  tipo: 'COMPRA' | 'VENDA'; // Define que o tipo só pode ser 'COMPRA' ou 'VENDA'
}