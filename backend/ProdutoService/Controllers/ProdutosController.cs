using Microsoft.AspNetCore.Mvc;
using ProdutoService.Models;
using ProdutoService.Services;
using ProdutoService.Data;
using Microsoft.EntityFrameworkCore;

namespace ProdutoService.Controllers
{
    [ApiController]
    [Route("api/produtos")]
    public class ProdutosController : ControllerBase
    {
        private readonly ProdutoService.Services.ProdutoService _service;
        public ProdutosController(ProdutoService.Services.ProdutoService service) => _service = service;

        [HttpGet]
        public async Task<IActionResult> Get() => Ok(await _service.GetAllAsync());

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var produto = await _service.GetByIdAsync(id);
            return produto == null ? NotFound() : Ok(produto);
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Produto produto)
        {
            await _service.AddAsync(produto);
            return CreatedAtAction(nameof(Get), new { id = produto.Id }, produto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] Produto produto)
        {
            if (id != produto.Id) return BadRequest();
            await _service.UpdateAsync(produto);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _service.DeleteAsync(id);
            return NoContent();
        }

        [HttpGet("testar-conexao")]
        public async Task<IActionResult> TestarConexao([FromServices] AppDbContext context)
        {
            try
            {
                var connString = context.Database.GetDbConnection().ConnectionString;
                if (string.IsNullOrWhiteSpace(connString))
                    return StatusCode(500, "Connection string não configurada!");

                var podeConectar = await context.Database.CanConnectAsync();
                if (!podeConectar)
                    return StatusCode(500, "Não foi possível conectar ao banco de dados!");

                return Ok("Conexão bem-sucedida!");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro de conexão: {ex.Message}");
            }
        }
    }
}