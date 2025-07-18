using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InventarioService.Models
{
    public class Inventario
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Nome { get; set; } = string.Empty;

        public string? Descricao { get; set; }

        [Required]
        public DateTime DataCriacao { get; set; } = DateTime.UtcNow;

        public bool Confirmado { get; set; } = false;

        public string Status { get; set; } = "Pendente"; // Pendente, Comparado, Confirmado

        // Relacionamento com itens
        public List<InventarioItem> Itens { get; set; } = new List<InventarioItem>();
    }

    public class InventarioItem
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int InventarioId { get; set; }
        public Inventario Inventario { get; set; }

        [Required]
        public int ProdutoId { get; set; }

        [Required]
        public string ProdutoNome { get; set; } = string.Empty;

        [Required]
        public int QuantidadeContada { get; set; }

        public int QuantidadeEstoque { get; set; }

        public int Diferenca => QuantidadeContada - QuantidadeEstoque;

        [Column(TypeName = "decimal(18,2)")]
        public decimal PrecoVenda { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal ValorTotal => QuantidadeContada * PrecoVenda;
    }

    public class ComparacaoInventario
    {
        public int InventarioId { get; set; }
        public string NomeInventario { get; set; } = string.Empty;
        public DateTime DataComparacao { get; set; }
        public List<DiferencaItem> Diferencas { get; set; } = new List<DiferencaItem>();
    }

    public class DiferencaItem
    {
        public int ProdutoId { get; set; }
        public string ProdutoNome { get; set; } = string.Empty;
        public int QuantidadeEstoque { get; set; }
        public int QuantidadeContada { get; set; }
        public int Diferenca { get; set; }
        public string TipoDiferenca { get; set; } = string.Empty; // "Sobra", "Falta", "Igual"
    }
}