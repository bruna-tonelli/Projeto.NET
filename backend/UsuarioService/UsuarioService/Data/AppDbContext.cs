using Microsoft.EntityFrameworkCore;
using UsuarioService.Models;

namespace UsuarioService.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Usuario> Usuarios { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Usuario>(entity =>
        {
            entity.HasKey(u => u.Id);
            entity.HasIndex(u => u.Email).IsUnique();
            entity.Property(u => u.Name).IsRequired().HasMaxLength(100);
            entity.Property(u => u.Email).IsRequired().HasMaxLength(150);
            entity.Property(u => u.PasswordHash).IsRequired();
            entity.Property(u => u.Role).HasMaxLength(50).HasDefaultValue("User");
            entity.Property(u => u.Phone).HasMaxLength(20);
            entity.Property(u => u.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
            entity.Property(u => u.IsActive).HasDefaultValue(true);
            entity.Property(u => u.FailedLoginAttempts).HasDefaultValue(0);
            
            // Índices para melhorar performance
            entity.HasIndex(u => u.Role);
            entity.HasIndex(u => u.IsActive);
            entity.HasIndex(u => u.CreatedAt);
        });

        base.OnModelCreating(modelBuilder);
    }
}
