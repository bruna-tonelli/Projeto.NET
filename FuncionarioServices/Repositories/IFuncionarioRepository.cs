using FuncionarioServices.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FuncionarioServices.Repositories
{
    public interface IFuncionarioRepository
    {
        Task<IEnumerable<Funcionario>> GetAllAsync();
        Task<Funcionario> GetByIdAsync(int id);
        Task<Funcionario> AddAsync(Funcionario funcionario);
        Task UpdateAsync(Funcionario funcionario);
        Task DeleteAsync(int id);
    }
}