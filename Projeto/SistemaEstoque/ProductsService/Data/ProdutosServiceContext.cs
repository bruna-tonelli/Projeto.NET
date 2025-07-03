using Microsoft.EntityFrameworkCore;
using ProductsService.Model; // Ajuste para o namespace correto da sua Model Produto

namespace ProductsService.Data // Ajuste este namespace
{
    public class ProductsServiceContext : DbContext {
        public ProductsServiceContext(DbContextOptions<ProductsServiceContext> options)
            : base(options) {
        }

        // O nome da propriedade é Produtos (plural), mesmo que a classe seja Produto.
        // O atributo [Table("Produto")] na classe Produto Model cuidará do mapeamento.
        public DbSet<Produto> Produtos { get; set; } = default!;

        protected override void OnModelCreating(ModelBuilder modelBuilder) {
            // Se você usou [Table("Produto")] na sua Model, esta linha não é estritamente necessária,
            // mas mostra como você poderia configurar o nome da tabela via Fluent API.
            // modelBuilder.Entity<Produto>().ToTable("Produto"); 

            modelBuilder.Entity<Produto>()
                .Property(p => p.valorProduto)
                .HasColumnType("decimal(18,2)"); // Defina a precisão do seu valor decimal
        }
    }
}