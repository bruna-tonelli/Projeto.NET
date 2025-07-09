using Microsoft.EntityFrameworkCore;
using ProdutoService.Models;

namespace ProdutoService.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Produto> Produtos { get; set; }
        public DbSet<TipoMovimentacao> TiposMovimentacao { get; set; }
        public DbSet<Movimentacao> Movimentacoes { get; set; }
        public DbSet<HistoricoEstoque> HistoricoEstoque { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Produto>().ToTable("produtos");
            modelBuilder.Entity<TipoMovimentacao>().ToTable("tipos_movimentacao");
            modelBuilder.Entity<Movimentacao>().ToTable("movimentacoes");
            modelBuilder.Entity<HistoricoEstoque>().ToTable("historico_estoque");
        }
    }
}
