using SeuProjeto.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FuncionarioService.Repositories
{
    // A interface define um "contrato" de quais métodos de acesso a dados devem existir.
    public interface IFuncionarioRepository
    {
        Task<IEnumerable<Funcionario>> GetAllAsync();
        Task<Funcionario> GetByIdAsync(int id);
        Task<Funcionario> AddAsync(Funcionario funcionario);
        Task UpdateAsync(Funcionario funcionario);
        Task DeleteAsync(int id);
    }
}