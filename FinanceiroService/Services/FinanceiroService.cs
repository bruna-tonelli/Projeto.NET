using FinanceiroService.Models;
using FinanceiroService.Repositories;

namespace FinanceiroService.Services
{
    public class FinanceiroService : IFinanceiroService
    {
        private readonly ITransacaoRepository _repository;
        public FinanceiroService(ITransacaoRepository repository) => _repository = repository;

        public async Task RegistrarTransacaoAsync(int movimentacaoId, string tipo, decimal valorTotal)
        {
            var transacao = new TransacaoFinanceira
            {
                MOVIMENTACAO_ID = movimentacaoId,
                TIPO = tipo.ToUpper(),
                VALOR_TOTAL = tipo == "COMPRA" ? -valorTotal : valorTotal
            };
            await _repository.AdicionarAsync(transacao);
        }

        public async Task<decimal> CalcularSaldoAsync()
            => (await _repository.ObterTodasAsync()).Sum(t => t.ValorTotal);
    }
}