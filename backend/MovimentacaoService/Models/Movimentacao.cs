namespace MovimentacaoService.Models {
    public class Movimentacao {
        public int Id { get; set; }
        public int Quantidade { get; set; }
        public string Tipo { get; set; } = string.Empty;
        public int? ProdutoId { get; set; }
        public int? FuncionarioId { get; set; }
        public DateTime? DataMovimentacao { get; set; }
        public string? Observacoes { get; set; }
        
        // Propriedades para exibição (não mapeadas no banco)
        public string? ProdutoNome { get; set; }
        public string? FuncionarioNome { get; set; }
    }
}
