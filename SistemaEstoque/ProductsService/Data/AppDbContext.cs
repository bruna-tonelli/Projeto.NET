// Data/AppDbContext.cs
using Microsoft.EntityFrameworkCore;
using ProductsService.Models;

namespace ProductsService.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Produto> PRODUTOS { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Produto>(entity =>
        {
            entity.ToTable("PRODUTOS");
            entity.HasKey(p => p.PRODUTOID);
            entity.Property(p => p.PRODUTONOME).IsRequired().HasMaxLength(200);
            entity.Property(p => p.PRODUTOQUANTIDADE).IsRequired();
            entity.Property(p => p.PRODUTOVALOR).IsRequired().HasColumnType("decimal(18,2)");
        });
    }
}