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
        public int Quantidade { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal PrecoVenda { get; set; }

        public bool Confirmado { get; set; } = false;
        public DateTime DataCadastro { get; set; } = DateTime.UtcNow;
    }
}