using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProdutoService.Models
{
    public class Produto
    {
        public int Id { get; set; }
        
        [Required]
        public string Nome { get; set; } = string.Empty;
        
        public string? Descricao { get; set; }
        
        [Required]
        public int Quantidade { get; set; }
        
        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal PrecoCompra { get; set; }
        
        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal PrecoVenda { get; set; }
        
        public DateTime DataCadastro { get; set; } = DateTime.UtcNow;
        
        public DateTime DataAtualizacao { get; set; } = DateTime.UtcNow;
        
        public bool Ativo { get; set; } = true;
    }
}
