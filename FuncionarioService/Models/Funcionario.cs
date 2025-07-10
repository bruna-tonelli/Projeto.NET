using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema; // Necessário para [Column]

namespace FuncionarioServices.Models
{
    public class Funcionario
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Nome { get; set; }

        [Required]
        [EmailAddress]
        [StringLength(150)]
        public string Email { get; set; }

        [Required]
        [StringLength(50)]
        public string Cargo { get; set; }

        [Required]
        [Column(TypeName = "decimal(18, 2)")]
        public decimal Salario { get; set; }
    }
}