using FinanceiroService.Services;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks; // Para usar Task

namespace FinanceiroService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FinanceiroController : ControllerBase
    {
        private readonly IFinanceiroService _financeiroService;
        public FinanceiroController(IFinanceiroService financeiroService)
            => _financeiroService = financeiroService;

        [HttpPost("transacao")]
        public async Task<IActionResult> RegistrarTransacao([FromBody] TransacaoRequest request)
        {
            await _financeiroService.RegistrarTransacaoAsync(
                request.MOVIMENTACAO_ID,
                request.TIPO,
                request.VALOR_TOTAL
            );
            return Ok();
        }

        [HttpGet("saldo")]
        public async Task<ActionResult<decimal>> GetSaldo()
            => Ok(await _financeiroService.CalcularSaldoAsync());

        // --- ENDPOINT ADICIONADO ---
        [HttpGet("resumo-mensal")] // Rota: GET /api/financeiro/resumo-mensal
        public async Task<IActionResult> GetResumoMensal()
        {
            var resumo = await _financeiroService.GetResumoMensalAsync();
            return Ok(resumo);
        }
    }

    // A classe TransacaoRequest continua a mesma
    public class TransacaoRequest
    {
        public int MOVIMENTACAO_ID { get; set; }
        public string TIPO { get; set; } = string.Empty;
        public decimal VALOR_TOTAL { get; set; }
    }
}