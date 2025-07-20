using System.ComponentModel.DataAnnotations;

namespace InventarioService.DTOs
{
    public class CreateInventarioDto
    {
        public string? Responsavel { get; set; }
        public string? Status { get; set; } = "Pendente";
    }

    public class UpdateInventarioDto
    {
        public string? Responsavel { get; set; }
        public string? Status { get; set; }
    }

    public class InventarioDto
    {
        public int Id { get; set; }
        public DateTime DataCriacao { get; set; }
        public string? Responsavel { get; set; }
        public string? Status { get; set; }
        public List<InventarioProdutoDto> Produtos { get; set; } = new List<InventarioProdutoDto>();
    }

    public class InventarioProdutoDto
    {
        public int Id { get; set; }
        public int ProdutoId { get; set; }
        public int QuantidadeContada { get; set; }
        public int? InventarioId { get; set; }
    }

    public class AddProdutoInventarioDto
    {
        public int ProdutoId { get; set; }
        public int QuantidadeContada { get; set; }
        public int? InventarioId { get; set; }
    }
}