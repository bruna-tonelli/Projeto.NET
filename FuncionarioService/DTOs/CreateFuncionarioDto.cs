using System.ComponentModel.DataAnnotations;

namespace FuncionarioService.DTOs
{
    // Este objeto define os dados necessários para CRIAR um novo funcionário.
    // Não inclui o 'Id', pois ele será gerado pelo banco de dados.
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
    }
}