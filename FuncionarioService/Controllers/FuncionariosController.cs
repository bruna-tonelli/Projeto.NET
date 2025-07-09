using Microsoft.AspNetCore.Mvc;
using SeuProjeto.DTOs;
using SeuProjeto.Services;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SeuProjeto.Controllers
{
    [ApiController]
    [Route("api/[controller]")] // Define a rota base como -> /api/funcionarios
    public class FuncionariosController : ControllerBase
    {
        private readonly IFuncionarioService _service;

        // Injetamos o serviço que criamos na etapa anterior.
        public FuncionariosController(IFuncionarioService service)
        {
            _service = service;
        }

        // GET: /api/funcionarios
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var funcionarios = await _service.GetAllFuncionariosAsync();
            return Ok(funcionarios); // Retorna 200 OK com a lista de funcionários.
        }

        // GET: /api/funcionarios/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var funcionario = await _service.GetFuncionarioByIdAsync(id);
            if (funcionario == null)
            {
                return NotFound(); // Retorna 404 Not Found se não encontrar.
            }
            return Ok(funcionario);
        }

        // POST: /api/funcionarios
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateFuncionarioDto funcionarioDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState); // Retorna 400 Bad Request se os dados forem inválidos.
            }

            var novoFuncionario = await _service.CreateFuncionarioAsync(funcionarioDto);
            // Retorna 201 Created com a localização do novo recurso e o objeto criado.
            return CreatedAtAction(nameof(GetById), new { id = novoFuncionario.Id }, novoFuncionario);
        }

        // PUT: /api/funcionarios/5
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
                return NoContent(); // Retorna 204 No Content em caso de sucesso.
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }

        // DELETE: /api/funcionarios/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                await _service.DeleteFuncionarioAsync(id);
                return NoContent(); // Retorna 204 No Content em caso de sucesso.
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }
    }
}