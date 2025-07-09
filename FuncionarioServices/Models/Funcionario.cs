using System.ComponentModel.DataAnnotations;

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
    }
}