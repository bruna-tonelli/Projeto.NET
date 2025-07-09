using Microsoft.AspNetCore.Mvc;
using ProdutoService.Models;
using ProdutoService.Services;

namespace ProdutoService.Controllers
{
    [ApiController]
    [Route("api/estoque")]
    public class EstoqueController : ControllerBase
    {
        private readonly ProdutoService.Services.ProdutoService _service;
        
        public EstoqueController(ProdutoService.Services.ProdutoService service) 
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetEstoque()
        {
            var produtos = await _service.GetAllAsync();
            return Ok(produtos);
        }

        [HttpGet("pesquisar")]
        public async Task<IActionResult> PesquisarEstoque([FromQuery] string termo)
        {
            var produtos = await _service.SearchAsync(termo);
            return Ok(produtos);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetEstoqueProduto(int id)
        {
            var produto = await _service.GetByIdAsync(id);
            return produto == null ? NotFound() : Ok(produto);
        }

        [HttpPut("{id}/quantidade")]
        public async Task<IActionResult> AtualizarQuantidade(int id, [FromBody] int novaQuantidade)
        {
            var produto = await _service.GetByIdAsync(id);
            if (produto == null) return NotFound();

            produto.Quantidade = novaQuantidade;
            produto.DataAtualizacao = DateTime.Now;
            
            await _service.UpdateAsync(produto);
            return Ok(produto);
        }
    }
}
