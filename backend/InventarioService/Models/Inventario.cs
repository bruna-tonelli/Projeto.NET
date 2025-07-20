using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InventarioService.Models
{
    [Table("Inventarios")]
    public class Inventario
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [Column("DataCriacao")]
        public DateTime DataCriacao { get; set; } = DateTime.Now;

        [Column("Responsavel")]
        [StringLength(100)]
        public string? Responsavel { get; set; }

        [Column("Status")]
        [StringLength(50)]
        public string? Status { get; set; } = "Pendente";

        // Relacionamento com InventariosProduto
        public virtual ICollection<InventarioProduto> Produtos { get; set; } = new List<InventarioProduto>();
    }

    [Table("InventariosProduto")]
    public class InventarioProduto
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [Column("ProdutoId")]
        public int ProdutoId { get; set; }

        [Required]
        [Column("QuantidadeContada")]
        public int QuantidadeContada { get; set; }

        // Foreign Key para Inventario (se necessário)
        public int? InventarioId { get; set; }
        
        [ForeignKey("InventarioId")]
        public virtual Inventario? Inventario { get; set; }
    }
}