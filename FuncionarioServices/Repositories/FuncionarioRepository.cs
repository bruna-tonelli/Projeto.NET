using Microsoft.EntityFrameworkCore;
using FuncionarioServices.Data;
using FuncionarioServices.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FuncionarioServices.Repositories
{
    public class FuncionarioRepository : IFuncionarioRepository
    {
        private readonly ApplicationDbContext _context;

        public FuncionarioRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Funcionario> AddAsync(Funcionario funcionario)
        {
            _context.Funcionarios.Add(funcionario);
            await _context.SaveChangesAsync();
            return funcionario;
        }

        public async Task DeleteAsync(int id)
        {
            var funcionario = await _context.Funcionarios.FindAsync(id);
            if (funcionario != null)
            {
                _context.Funcionarios.Remove(funcionario);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<Funcionario>> GetAllAsync()
        {
            return await _context.Funcionarios.ToListAsync();
        }

        public async Task<Funcionario> GetByIdAsync(int id)
        {
            return await _context.Funcionarios.FindAsync(id);
        }

        public async Task UpdateAsync(Funcionario funcionario)
        {
            _context.Entry(funcionario).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }
    }
}