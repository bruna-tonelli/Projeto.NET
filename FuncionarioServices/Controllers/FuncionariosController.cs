using Microsoft.AspNetCore.Mvc;
using FuncionarioServices.DTOs;
using FuncionarioServices.Services;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FuncionarioServices.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FuncionariosController : ControllerBase
    {
        private readonly IFuncionarioService _service;

        public FuncionariosController(IFuncionarioService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var funcionarios = await _service.GetAllFuncionariosAsync();
            return Ok(funcionarios);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var funcionario = await _service.GetFuncionarioByIdAsync(id);
            if (funcionario == null)
            {
                return NotFound();
            }
            return Ok(funcionario);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateFuncionarioDto funcionarioDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var novoFuncionario = await _service.CreateFuncionarioAsync(funcionarioDto);
            return CreatedAtAction(nameof(GetById), new { id = novoFuncionario.Id }, novoFuncionario);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateFuncionarioDto funcionarioDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                await _service.UpdateFuncionarioAsync(id, funcionarioDto);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                await _service.DeleteFuncionarioAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }
    }
}