using FinanceiroService.DTOs;
using FinanceiroService.Models;
using FinanceiroService.Repositories;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;


namespace FinanceiroService.Services
{
    
    public class FinanceiroServiceImpl : IFinanceiroService
    {
        private readonly ITransacaoRepository _repository;
        public FinanceiroServiceImpl(ITransacaoRepository repository) => _repository = repository;

        
        public async Task RegistrarTransacaoAsync(int movimentacaoId, string tipo, decimal valorTotal)
        {
            var transacao = new TransacaoFinanceira
            {
                MOVIMENTACAO_ID = movimentacaoId,
                TIPO = tipo.ToUpper(),
                VALOR_TOTAL = tipo.ToUpper() == "COMPRA" ? -valorTotal : valorTotal,
                DATA_TRANSACAO = DateTime.UtcNow
            };
            await _repository.AdicionarAsync(transacao);
        }

        public async Task<decimal> CalcularSaldoAsync()
            => (await _repository.ObterTodasAsync()).Sum(t => t.VALOR_TOTAL);

        public async Task<IEnumerable<ResumoMensalDto>> GetResumoMensalAsync()
        {
            var todasAsTransacoes = await _repository.ObterTodasAsync();
            var resumo = todasAsTransacoes
                .GroupBy(transacao => new { transacao.DATA_TRANSACAO.Year, transacao.DATA_TRANSACAO.Month })
                .Select(grupo => new ResumoMensalDto(grupo.Key.Year, grupo.Key.Month)
                {
                    TotalEntradas = grupo.Where(t => t.VALOR_TOTAL > 0).Sum(t => t.VALOR_TOTAL),
                    TotalSaidas = grupo.Where(t => t.VALOR_TOTAL < 0).Sum(t => t.VALOR_TOTAL) * -1
                })
                .OrderBy(r => r.Ano).ThenBy(r => r.Mes);
            return resumo;
        }
    }
}