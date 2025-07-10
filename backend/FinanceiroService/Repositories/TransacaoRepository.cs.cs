namespace FinanceiroService.Repositories
{

    public class TransacaoRepository : ITransacaoRepository
    {
        private readonly FinanceiroDbContext _context;
        public TransacaoRepository(FinanceiroDbContext context) => _context = context;

        public async Task AdicionarAsync(TransacaoFinanceira transacao)
        {
            await _context.Transacoes.AddAsync(transacao);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<TransacaoFinanceira>> ObterTodasAsync()
            => await _context.Transacoes.ToListAsync();
    }
}
