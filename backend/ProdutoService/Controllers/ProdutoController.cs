using Microsoft.AspNetCore.Mvc;
using ProdutoService.Models;
using ProdutoService.Services;
using ProdutoService.Data;
using Microsoft.EntityFrameworkCore;

namespace ProdutoService.Controllers
{
    [ApiController]
    [Route("api/produtos")]
    public class ProdutoController : ControllerBase
    {
        private readonly Services.ProdutoService _service;
        public ProdutoController(Services.ProdutoService service) => _service = service;

        [HttpGet]
        public async Task<IActionResult> Get() 
        {
            try
            {
                Console.WriteLine("Iniciando busca de produtos...");
                var produtos = await _service.GetAllAsync();
                Console.WriteLine($"Produtos encontrados: {produtos.Count()}");
                return Ok(produtos);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro ao buscar produtos: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                return StatusCode(500, new { message = ex.Message, stackTrace = ex.StackTrace });
            }
        }

        [HttpGet("pesquisar")]
        public async Task<IActionResult> Pesquisar([FromQuery] string termo)
        {
            Console.WriteLine($"Termo de pesquisa recebido: '{termo}'");
            var produtos = await _service.SearchAsync(termo);
            Console.WriteLine($"Produtos encontrados: {produtos.Count()}");
            foreach (var produto in produtos)
            {
                Console.WriteLine($"- ID: {produto.Id}, Nome: {produto.Nome}");
            }
            return Ok(produtos);
        }

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