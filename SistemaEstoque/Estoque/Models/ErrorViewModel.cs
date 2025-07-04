using System.ComponentModel.DataAnnotations;

namespace Estoque.Models
{

    public class Produto
    {
        public int PRODUTOID { get; set; }

        [Required(ErrorMessage = "O nome do produto � obrigat�rio")]
        [StringLength(200, ErrorMessage = "O nome deve ter no m�ximo 200 caracteres")]
        public string PRODUTONOME { get; set; } = string.Empty;

        [Required(ErrorMessage = "A quantidade � obrigat�ria")]
        [Range(0, int.MaxValue, ErrorMessage = "A quantidade n�o pode ser negativa")]
        public int PRODUTOQUANTIDADE { get; set; }

        [Required(ErrorMessage = "O valor � obrigat�rio")]
        [Range(0.01, double.MaxValue, ErrorMessage = "O valor deve ser maior que zero")]
        public decimal PRODUTOVALOR { get; set; }
    }
}