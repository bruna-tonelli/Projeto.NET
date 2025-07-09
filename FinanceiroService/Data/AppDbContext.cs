using System.Collections.Generic;

public class FinanceiroDbContext : DbContext
{
    public FinanceiroDbContext(DbContextOptions<FinanceiroDbContext> options) : base(options) { }
    public DbSet<TransacaoFinanceira> Transacoes { get; set; }
}