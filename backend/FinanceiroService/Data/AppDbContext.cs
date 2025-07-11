using Microsoft.EntityFrameworkCore;
using FinanceiroService.Models;

namespace FinanceiroService.Data
{
    public class FinanceiroDbContext : DbContext
    {
        public FinanceiroDbContext(DbContextOptions<FinanceiroDbContext> options) : base(options) { }
        public DbSet<TransacaoFinanceira> Transacoes { get; set; }
    }
}