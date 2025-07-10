
using FuncionarioServices.DTOs;
using FuncionarioServices.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FuncionarioServices.Services
{
    public interface IFuncionarioService
    {
        Task<IEnumerable<Funcionario>> GetAllFuncionariosAsync();
        Task<Funcionario> GetFuncionarioByIdAsync(int id);
        Task<Funcionario> CreateFuncionarioAsync(CreateFuncionarioDto funcionarioDto);
        Task UpdateFuncionarioAsync(int id, UpdateFuncionarioDto funcionarioDto);
        Task DeleteFuncionarioAsync(int id);
    }
}