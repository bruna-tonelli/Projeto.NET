using InventarioService.Models;
using InventarioService.Services;
using InventarioService.DTOs;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class InventarioController : ControllerBase
{
    private readonly IInventarioService _inventarioService;
    
    public InventarioController(IInventarioService inventarioService) 
    {
        _inventarioService = inventarioService; 
    }

    // Listar todos os inventários
    [HttpGet]
    public async Task<ActionResult<IEnumerable<InventarioCompletoDto>>> GetInventarios()
    {
        var inventarios = await _inventarioService.ListarInventariosAsync();
        return Ok(inventarios);
    }

    // Obter inventário específico
    [HttpGet("{id}")]
    public async Task<ActionResult<InventarioCompletoDto>> GetInventario(int id)
    {
        var inventario = await _inventarioService.ObterInventarioAsync(id);
        if (inventario == null)
            return NotFound();
            
        return Ok(inventario);
    }

    // Criar novo inventário
    [HttpPost]
    public async Task<ActionResult<InventarioCompletoDto>> CriarInventario([FromBody] CreateInventarioDto dto)
    {
        var inventario = await _inventarioService.CriarInventarioAsync(dto);
        return CreatedAtAction(nameof(GetInventario), new { id = inventario.Id }, inventario);
    }

    // Adicionar item ao inventário
    [HttpPost("{id}/itens")]
    public async Task<ActionResult> AdicionarItem(int id, [FromBody] AddItemInventarioDto dto)
    {
        dto.InventarioId = id;
        await _inventarioService.AdicionarItemAsync(dto);
        return Ok();
    }

    // Comparar inventário com estoque
    [HttpPost("{id}/comparar")]
    public async Task<ActionResult<ComparacaoInventario>> CompararInventario(int id)
    {
        var comparacao = await _inventarioService.CompararInventarioAsync(id);
        return Ok(comparacao);
    }

    // Atualizar estoque com base no inventário
    [HttpPost("{id}/atualizar-estoque")]
    public async Task<ActionResult> AtualizarEstoque(int id)
    {
        await _inventarioService.AtualizarEstoqueAsync(id);
        return Ok(new { mensagem = "Estoque atualizado com sucesso!" });
    }

    // Editar item do inventário
    [HttpPut("itens/{itemId}")]
    public async Task<ActionResult> EditarItem(int itemId, [FromBody] AddItemInventarioDto dto)
    {
        await _inventarioService.EditarItemAsync(itemId, dto);
        return Ok();
    }

    // Remover item do inventário
    [HttpDelete("itens/{itemId}")]
    public async Task<ActionResult> RemoverItem(int itemId)
    {
        await _inventarioService.RemoverItemAsync(itemId);
        return Ok();
    }

    // Finalizar inventário
    [HttpPost("{id}/finalizar")]
    public async Task<ActionResult> FinalizarInventario(int id)
    {
        await _inventarioService.FinalizarInventarioAsync(id);
        return Ok(new { mensagem = "Inventário finalizado com sucesso!" });
    }
}