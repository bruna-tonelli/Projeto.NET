namespace InventarioService.DTOs
{
    public class CreateInventarioDto
    {
        public string Nome { get; set; } = string.Empty;
        public string? Descricao { get; set; }
        public int Quantidade { get; set; }
        public decimal PrecoVenda { get; set; }
    }
}