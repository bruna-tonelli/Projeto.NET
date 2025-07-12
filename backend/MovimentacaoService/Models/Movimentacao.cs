using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace MovimentacaoService.Models {
    public class Movimentacao {
        public int Id { get; set; }
        public int Quantidade { get; set; }
        public string Tipo { get; set; } = string.Empty;
        public int? ProdutoId { get; set; }
        public string? FuncionarioId { get; set; } // Mudança para string para aceitar GUID
        public DateTime? DataMovimentacao { get; set; }
        public string? Observacoes { get; set; }
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal? PrecoCompra { get; set; }
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal? PrecoVenda { get; set; }
        
        // Propriedades para exibição (não mapeadas no banco)
        [NotMapped]
        public string? ProdutoNome { get; set; }
        [NotMapped]
        public string? FuncionarioNome { get; set; }
    }
}
