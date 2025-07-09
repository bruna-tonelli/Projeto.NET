using System.ComponentModel.DataAnnotations;

namespace FuncionarioServices.DTOs
{
    public class UpdateFuncionarioDto
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
    }
}