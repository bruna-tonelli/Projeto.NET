namespace FinanceiroService.Models
{
    public class TransacaoFinanceira
    {
        public int TRANSACAO_ID { get; set; }
        public int MOVIMENTACAO_ID { get; set; }
        public decimal VALOR_TOTAL { get; set; }
        public string TIPO { get; set; } = string.Empty;

        // --- CAMPO ADICIONADO ---
        // A data e hora em que a transação foi registrada
        public DateTime DATA_TRANSACAO { get; set; }
    }
}