using InventarioService.Models;
using InventarioService.Services;
using Microsoft.AspNetCore.Mvc;
using System;

[ApiController]
[Route("api/[controller]")]
public class InventarioController : ControllerBase
{
    private readonly IInventarioService _inventarioService;
    public InventarioController(IInventarioService inventarioService) 
    {
        _inventarioService = inventarioService; 
    }

    [HttpGet("pendentes")]
    public async Task<ActionResult<IEnumerable<Inventario>>> GetPendentes()
    {
        var itens = await _inventarioService.ListarPendentesAsync(); 
        return Ok(itens);
    }

    [HttpPost]
    public async Task<ActionResult> Adicionar([FromBody] Inventario item)
    {
        item.Confirmado = false;
        item.DataCadastro = DateTime.UtcNow;

        await _inventarioService.AdicionarItemAsync(item); 
        return CreatedAtAction(nameof(GetPendentes), null);
    }

    [HttpPost("confirmar")]
    public async Task<ActionResult> Confirmar()
    {
        await _inventarioService.ConfirmarInventarioAsync();
        return Ok(new { mensagem = "Inventário confirmado com sucesso!" });
    }
}