using Microsoft.EntityFrameworkCore;
using MovimentacaoService.Data;
using MovimentacaoService.Models;

namespace MovimentacaoService.Repositories {
    public class MovimentacaoRepository {

        private readonly AppDbContext _context;
        public MovimentacaoRepository(AppDbContext context) => _context = context;

        public async Task<IEnumerable<Movimentacao>> GetAllAsync() =>
            await _context.movimentacao.ToListAsync();

        public async Task<Movimentacao?> GetByIdAsync(int id) =>
            await _context.movimentacao.FindAsync(id);

        public async Task AddAsync(Movimentacao movimentar) {
            _context.movimentacao.Add(movimentar);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Movimentacao movimentar) {
            _context.Entry(movimentar).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id) {
            var movimentar = await _context.movimentacao.FindAsync(id);
            if (movimentar != null) {
                _context.movimentacao.Remove(movimentar);
                await _context.SaveChangesAsync();
            }
        }
    }
}
