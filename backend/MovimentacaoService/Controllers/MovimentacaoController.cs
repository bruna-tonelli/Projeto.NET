using Microsoft.AspNetCore.Mvc;
using MovimentacaoService.Services;
using Microsoft.EntityFrameworkCore;
using MovimentacaoService.Models;
using MovimentacaoService.Data;

namespace MovimentacaoService.Controllers {

    [ApiController]
    [Route("api/movimentacao")]
    public class MovimentacaoController : ControllerBase{

        private readonly MovimentacaoService.Services.MovimentacaoService _service;
        public MovimentacaoController(MovimentacaoService.Services.MovimentacaoService service) => _service = service;

        [HttpGet("tipo/{tipo}")] // Novo endpoint para filtro por tipo
        public async Task<IActionResult> GetByTipo(string tipo) {
            var movimentacoes = await _service.GetByTipoAsync(tipo);
            if (!movimentacoes.Any()) {
                return NotFound($"Nenhuma movimentação encontrada para o tipo: {tipo}");
            }
            return Ok(movimentacoes);
        }

        [HttpGet("filtrar")]
        public async Task<IActionResult> FiltrarMovimentacoes(
            [FromQuery] string? tipo,
            [FromQuery] DateTime? dataInicial,
            [FromQuery] DateTime? dataFinal)
        {
            var movimentacoes = await _service.FiltrarMovimentacoesAsync(tipo, dataInicial, dataFinal);
            return Ok(movimentacoes);
        }

        [HttpGet]
        public async Task<IActionResult> Get() => Ok(await _service.GetAllAsync());

        [HttpGet("pesquisar")]
        public async Task<IActionResult> Pesquisar([FromQuery] string termo) {
            Console.WriteLine($"Termo de pesquisa recebido: '{termo}'");
            var movimentar = await _service.SearchAsync(termo);
            Console.WriteLine($"Movimentações encontradas: {movimentar.Count()}");
            foreach (var movimentacao in movimentar) {
                Console.WriteLine($"- ID: {movimentacao.Id}, Tipo: {movimentacao.Tipo}, Quantidade: {movimentacao.Quantidade}");
            }
            return Ok(movimentar);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id) {
            var movimentar = await _service.GetByIdAsync(id);
            return movimentar == null ? NotFound() : Ok(movimentar);
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Movimentacao movimentacao) {
            await _service.AddAsync(movimentacao);
            return CreatedAtAction(nameof(Get), new { id = movimentacao.Id }, movimentacao);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] Movimentacao movimentacao) {
            if (id != movimentacao.Id) return BadRequest();
            await _service.UpdateAsync(movimentacao);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id) {
            await _service.DeleteAsync(id);
            return NoContent();
        }

        [HttpGet("testar-conexao")]
        public async Task<IActionResult> TestarConexao([FromServices] AppDbContext context) {
            try {
                var connString = context.Database.GetDbConnection().ConnectionString;
                if (string.IsNullOrWhiteSpace(connString))
                    return StatusCode(500, "Connection string não configurada!");

                var podeConectar = await context.Database.CanConnectAsync();
                if (!podeConectar)
                    return StatusCode(500, "Não foi possível conectar ao banco de dados!");

                return Ok("Conexão bem-sucedida!");
            }
            catch (Exception ex) {
                return StatusCode(500, $"Erro de conexão: {ex.Message}");
            }
        }
    }
}
