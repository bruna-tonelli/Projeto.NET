using FinanceiroService.Services;
using Microsoft.AspNetCore.Mvc;

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
    }
    public class TransacaoRequest
    {
        public int MOVIMENTACAO_ID { get; set; }
        public string TIPO { get; set; } = string.Empty;
        public decimal VALOR_TOTAL { get; set; }
    }
}
