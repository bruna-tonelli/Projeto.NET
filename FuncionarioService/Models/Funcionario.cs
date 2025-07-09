using System.ComponentModel.DataAnnotations; // Necessário para [Key], [Required], etc.

namespace FuncionarioService.Models
{
    // Esta classe representa a tabela 'Funcionarios' no banco de dados.
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