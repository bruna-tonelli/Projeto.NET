using System.ComponentModel.DataAnnotations;

namespace FuncionarioServices.DTOs
{
    public class CreateFuncionarioDto
    {
        [Required(ErrorMessage = "O nome é obrigatório.")]
        [StringLength(100)]
        public string Nome { get; set; }

        [Required(ErrorMessage = "O e-mail é obrigatório.")]
        [EmailAddress]
        public string Email { get; set; }

        [Required(ErrorMessage = "O cargo é obrigatório.")]
        [StringLength(50)]
        public string Cargo { get; set; }

        [Required(ErrorMessage = "O salário é obrigatório.")]
        [Range(0.01, double.MaxValue, ErrorMessage = "O salário deve ser maior que zero.")]
        public decimal Salario { get; set; }
    }
}