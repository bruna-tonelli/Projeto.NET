using Microsoft.EntityFrameworkCore;
using MovimentacaoService.Models;

namespace MovimentacaoService.Data {
    public class AppDbContext : DbContext {

        public AppDbContext(DbContextOptions<AppDbContext> options): base(options) { }

        public DbSet<Movimentacao> movimentacao { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder) {
            modelBuilder.Entity<Movimentacao>().ToTable("movimentacao");
        }
    }
}
