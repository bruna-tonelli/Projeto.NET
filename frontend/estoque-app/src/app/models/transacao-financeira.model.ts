export interface TransacaoFinanceira {
  TRANSACAO_ID: number;
  MOVIMENTACAO_ID: number;
  VALOR_TOTAL: number;
  TIPO: 'COMPRA' | 'VENDA';
}
export type NovaTransacao = Omit<TransacaoFinanceira, 'TRANSACAO_ID'>;