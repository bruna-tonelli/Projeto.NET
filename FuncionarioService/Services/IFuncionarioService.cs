using SeuProjeto.DTOs;
using SeuProjeto.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SeuProjeto.Services
{
    // A interface do serviço. Note que ela trabalha com DTOs para entrada de dados.
    public interface IFuncionarioService
    {
        Task<IEnumerable<Funcionario>> GetAllFuncionariosAsync();
        Task<Funcionario> GetFuncionarioByIdAsync(int id);
        Task<Funcionario> CreateFuncionarioAsync(CreateFuncionarioDto funcionarioDto);
        Task UpdateFuncionarioAsync(int id, UpdateFuncionarioDto funcionarioDto);
        Task DeleteFuncionarioAsync(int id);
    }
}