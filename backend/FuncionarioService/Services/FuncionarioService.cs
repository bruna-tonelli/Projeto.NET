
using FuncionarioServices.DTOs;
using FuncionarioServices.Models;
using FuncionarioServices.Repositories;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FuncionarioServices.Services
{
    public class FuncionarioService : IFuncionarioService
    {
        private readonly IFuncionarioRepository _repository;

        public FuncionarioService(IFuncionarioRepository repository)
        {
            _repository = repository;
        }

        public Task<IEnumerable<Funcionario>> GetAllFuncionariosAsync() => _repository.GetAllAsync();

        public Task<Funcionario> GetFuncionarioByIdAsync(int id) => _repository.GetByIdAsync(id);

        public async Task<Funcionario> CreateFuncionarioAsync(CreateFuncionarioDto funcionarioDto)
        {
            var funcionario = new Funcionario
            {
                Nome = funcionarioDto.Nome,
                Email = funcionarioDto.Email,
                Cargo = funcionarioDto.Cargo,
                Salario = funcionarioDto.Salario,
            };
            return await _repository.AddAsync(funcionario);
        }

        public async Task UpdateFuncionarioAsync(int id, UpdateFuncionarioDto funcionarioDto)
        {
            var funcionarioExistente = await _repository.GetByIdAsync(id);
            if (funcionarioExistente == null)
            {
                throw new KeyNotFoundException("Funcionário não encontrado.");
            }

            funcionarioExistente.Nome = funcionarioDto.Nome;
            funcionarioExistente.Email = funcionarioDto.Email;
            funcionarioExistente.Cargo = funcionarioDto.Cargo;
            funcionarioExistente.Salario = funcionarioDto.Salario;

            await _repository.UpdateAsync(funcionarioExistente);
        }

        public async Task DeleteFuncionarioAsync(int id)
        {
            var funcionarioExistente = await _repository.GetByIdAsync(id);
            if (funcionarioExistente == null)
            {
                throw new KeyNotFoundException("Funcionário não encontrado.");
            }
            await _repository.DeleteAsync(id);
        }
    }
}