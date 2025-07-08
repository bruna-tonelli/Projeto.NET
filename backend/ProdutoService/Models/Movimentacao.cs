using System;

namespace ProdutoService.Models
{
    public class Movimentacao
    {
        public int Id { get; set; }
        public int ProdutoId { get; set; }
        public int TipoMovimentacaoId { get; set; }
        public int Quantidade { get; set; }
        public decimal? ValorUnitario { get; set; }
        public DateTime DataMovimentacao { get; set; }
        public string Observacao { get; set; }
        public string UsuarioResponsavel { get; set; }

        public Produto Produto { get; set; }
        public TipoMovimentacao TipoMovimentacao { get; set; }
    }
}