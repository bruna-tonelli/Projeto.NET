using System.ComponentModel.DataAnnotations;

namespace ProductsService.Models;

public class Produto
{
    public int PRODUTOID { get; set; }

    [Required(ErrorMessage = "O nome do produto é obrigatório")]
    [StringLength(200, ErrorMessage = "O nome deve ter no máximo 200 caracteres")]
    public string PRODUTONOME { get; set; } = string.Empty;

    [Required(ErrorMessage = "A quantidade é obrigatória")]
    [Range(0, int.MaxValue, ErrorMessage = "A quantidade não pode ser negativa")]
    public int PRODUTOQUANTIDADE { get; set; }

    [Required(ErrorMessage = "O valor é obrigatório")]
    [Range(0.01, double.MaxValue, ErrorMessage = "O valor deve ser maior que zero")]
    public decimal PRODUTOVALOR { get; set; }
}