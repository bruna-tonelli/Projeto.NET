using System.Collections.Generic;
using InventarioService.Models;
using Microsoft.EntityFrameworkCore;

namespace InventarioService.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        { }

        public DbSet<Inventario> Inventarios { get; set; }
        public DbSet<InventarioProduto> InventariosProduto { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configuração da tabela Inventarios
            modelBuilder.Entity<Inventario>(entity =>
            {
                entity.ToTable("Inventarios");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.DataCriacao).IsRequired();
                entity.Property(e => e.Responsavel).HasMaxLength(100);
                entity.Property(e => e.Status).HasMaxLength(50);
            });

            // Configuração da tabela InventariosProduto
            modelBuilder.Entity<InventarioProduto>(entity =>
            {
                entity.ToTable("InventariosProduto");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.ProdutoId).IsRequired();
                entity.Property(e => e.QuantidadeContada).IsRequired();
                
                // Relacionamento opcional
                entity.HasOne(e => e.Inventario)
                      .WithMany(i => i.Produtos)
                      .HasForeignKey(e => e.InventarioId)
                      .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}