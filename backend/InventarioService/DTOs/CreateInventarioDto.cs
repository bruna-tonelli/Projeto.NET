using System.ComponentModel.DataAnnotations;

namespace InventarioService.DTOs
{
    public class CreateInventarioDto
    {
        [Required]
        public string Nome { get; set; } = string.Empty;
        
        public string? Descricao { get; set; }
    }

    public class AddItemInventarioDto
    {
        [Required]
        public int InventarioId { get; set; }
        
        [Required]
        public int ProdutoId { get; set; }
        
        [Required]
        public string ProdutoNome { get; set; } = string.Empty;
        
        [Required]
        public int QuantidadeContada { get; set; }
        
        public decimal PrecoVenda { get; set; }
    }

    public class InventarioCompletoDto
    {
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string? Descricao { get; set; }
        public DateTime DataCriacao { get; set; }
        public bool Confirmado { get; set; }
        public string Status { get; set; } = string.Empty;
        public List<InventarioItemDto> Itens { get; set; } = new List<InventarioItemDto>();
    }

    public class InventarioItemDto
    {
        public int Id { get; set; }
        public int ProdutoId { get; set; }
        public string ProdutoNome { get; set; } = string.Empty;
        public int QuantidadeContada { get; set; }
        public int QuantidadeEstoque { get; set; }
        public int Diferenca { get; set; }
        public decimal PrecoVenda { get; set; }
        public decimal ValorTotal { get; set; }
    }
}