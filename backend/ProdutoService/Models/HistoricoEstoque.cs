using System;

namespace ProdutoService.Models
{
    public class HistoricoEstoque
    {
        public int Id { get; set; }
        public int ProdutoId { get; set; }
        public int QuantidadeAnterior { get; set; }
        public int QuantidadeNova { get; set; }
        public int? MovimentacaoId { get; set; }
        public DateTime DataAlteracao { get; set; }

        public Produto Produto { get; set; }
        public Movimentacao Movimentacao { get; set; }
    }
}