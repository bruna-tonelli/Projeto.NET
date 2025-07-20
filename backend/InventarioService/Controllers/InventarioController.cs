using InventarioService.DTOs;
using InventarioService.Services;
using Microsoft.AspNetCore.Mvc;

namespace InventarioService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InventarioController : ControllerBase
    {
        private readonly IInventarioService _inventarioService;

        public InventarioController(IInventarioService inventarioService)
        {
            _inventarioService = inventarioService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<InventarioDto>>> ListarInventarios()
        {
            try
            {
                var inventarios = await _inventarioService.ListarInventariosAsync();
                return Ok(inventarios);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro interno: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<InventarioDto>> ObterInventario(int id)
        {
            try
            {
                var inventario = await _inventarioService.ObterInventarioAsync(id);
                if (inventario == null)
                    return NotFound("Inventário não encontrado");

                return Ok(inventario);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro interno: {ex.Message}");
            }
        }

        [HttpPost]
        public async Task<ActionResult<InventarioDto>> CriarInventario([FromBody] CreateInventarioDto dto)
        {
            try
            {
                var inventario = await _inventarioService.CriarInventarioAsync(dto);
                return CreatedAtAction(nameof(ObterInventario), new { id = inventario.Id }, inventario);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro interno: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<InventarioDto>> AtualizarInventario(int id, [FromBody] UpdateInventarioDto dto)
        {
            try
            {
                var inventario = await _inventarioService.AtualizarInventarioAsync(id, dto);
                return Ok(inventario);
            }
            catch (ArgumentException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro interno: {ex.Message}");
            }
        }

        [HttpPut("{id}/finalizar")]
        public async Task<ActionResult<InventarioDto>> FinalizarInventario(int id, [FromBody] UpdateInventarioDto dto)
        {
            try
            {
                // Atualizar status do inventário
                var inventario = await _inventarioService.AtualizarInventarioAsync(id, dto);
                
                // Se o status é "Finalizado", atualizar quantidades dos produtos
                if (dto.Status?.ToLower() == "finalizado")
                {
                    var inventarioCompleto = await _inventarioService.ObterInventarioAsync(id);
                    if (inventarioCompleto?.Produtos?.Any() == true)
                    {
                        var atualizacoes = inventarioCompleto.Produtos.Select(p => new AtualizarQuantidadeDto
                        {
                            Id = p.ProdutoId,
                            Quantidade = p.QuantidadeContada
                        }).ToList();

                        await _inventarioService.AtualizarQuantidadesProdutosAsync(atualizacoes);
                    }
                }
                
                return Ok(inventario);
            }
            catch (ArgumentException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro interno: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> ExcluirInventario(int id)
        {
            try
            {
                var sucesso = await _inventarioService.ExcluirInventarioAsync(id);
                if (!sucesso)
                    return NotFound("Inventário não encontrado");

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro interno: {ex.Message}");
            }
        }

        [HttpPost("produtos")]
        public async Task<ActionResult<InventarioProdutoDto>> AdicionarProduto([FromBody] AddProdutoInventarioDto dto)
        {
            try
            {
                var produto = await _inventarioService.AdicionarProdutoAsync(dto);
                return Ok(produto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro interno: {ex.Message}");
            }
        }

        [HttpGet("produtos")]
        public async Task<ActionResult<IEnumerable<InventarioProdutoDto>>> ListarProdutosInventario()
        {
            try
            {
                var produtos = await _inventarioService.ListarProdutosInventarioAsync();
                return Ok(produtos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro interno: {ex.Message}");
            }
        }

        [HttpDelete("produtos/{produtoInventarioId}")]
        public async Task<ActionResult> RemoverProduto(int produtoInventarioId)
        {
            try
            {
                var sucesso = await _inventarioService.RemoverProdutoAsync(produtoInventarioId);
                if (!sucesso)
                    return NotFound("Produto não encontrado no inventário");

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro interno: {ex.Message}");
            }
        }

        [HttpPut("atualizar-quantidades")]
        public async Task<ActionResult> AtualizarQuantidades([FromBody] List<AtualizarQuantidadeDto> atualizacoes)
        {
            try
            {
                await _inventarioService.AtualizarQuantidadesProdutosAsync(atualizacoes);
                return Ok("Quantidades atualizadas com sucesso");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro ao atualizar quantidades: {ex.Message}");
            }
        }

        [HttpGet("teste-conexao")]
        public async Task<ActionResult> TesteConexao()
        {
            try
            {
                var inventarios = await _inventarioService.ListarInventariosAsync();
                return Ok($"Conexão OK. Inventários encontrados: {inventarios.Count()}");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro de conexão: {ex.Message}");
            }
        }
    }
}