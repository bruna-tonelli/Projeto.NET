using Microsoft.EntityFrameworkCore;
using ProdutoService.Models;

namespace ProdutoService.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Produto> Produtos { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Produto>(entity =>
            {
                entity.ToTable("produtos");
                
                entity.Property(e => e.Id)
                    .HasColumnName("Id");
                    
                entity.Property(e => e.Nome)
                    .HasColumnName("Nome")
                    .IsRequired();
                    
                entity.Property(e => e.Descricao)
                    .HasColumnName("Descricao");
                    
                entity.Property(e => e.Quantidade)
                    .HasColumnName("Quantidade")
                    .IsRequired();
                    
                entity.Property(e => e.PrecoCompra)
                    .HasColumnName("PrecoCompra")
                    .HasColumnType("decimal(18,2)")
                    .IsRequired();
                    
                entity.Property(e => e.PrecoVenda)
                    .HasColumnName("PrecoVenda")
                    .HasColumnType("decimal(18,2)")
                    .IsRequired();
                    
                entity.Property(e => e.DataCadastro)
                    .HasColumnName("DataCadastro")
                    .IsRequired();
                    
                entity.Property(e => e.DataAtualizacao)
                    .HasColumnName("DataAtualizacao")
                    .IsRequired();
                    
                entity.Property(e => e.Ativo)
                    .HasColumnName("Ativo")
                    .IsRequired();
            });
        }
    }
}
