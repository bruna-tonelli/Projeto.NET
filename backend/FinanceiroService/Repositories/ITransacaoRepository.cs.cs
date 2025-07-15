using FinanceiroService.Models;

namespace FinanceiroService.Repositories
{
    public interface ITransacaoRepository
    {
        Task AdicionarAsync(TransacaoFinanceira transacao);
        Task<IEnumerable<TransacaoFinanceira>> ObterTodasAsync();
    }

}
