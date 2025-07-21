using Microsoft.EntityFrameworkCore;
using MovimentacaoService.Data;
using MovimentacaoService.Models;

namespace MovimentacaoService.Repositories {
    public class MovimentacaoRepository {

        private readonly AppDbContext _context;
        public MovimentacaoRepository(AppDbContext context) => _context = context;

        public async Task<IEnumerable<Movimentacao>> GetByTipoAsync(string tipo) {
            return await _context.movimentacao
                                 .Where(m => m.Tipo.ToUpper() == tipo.ToUpper())
                                 .ToListAsync();
        }

        public async Task<IEnumerable<Movimentacao>> FiltrarMovimentacoesAsync(string? tipo, DateTime? dataInicial, DateTime? dataFinal)
        {
            var query = _context.movimentacao.AsQueryable();

            if (!string.IsNullOrEmpty(tipo))
            {
                query = query.Where(m => m.Tipo.ToUpper() == tipo.ToUpper());
            }

            if (dataInicial.HasValue)
            {
                query = query.Where(m => m.DataMovimentacao >= dataInicial.Value);
            }

            if (dataFinal.HasValue)
            {
                // Adicionar 23:59:59 à data final para incluir todo o dia
                var dataFinalCompleta = dataFinal.Value.Date.AddDays(1).AddTicks(-1);
                query = query.Where(m => m.DataMovimentacao <= dataFinalCompleta);
            }

            return await query.OrderByDescending(m => m.DataMovimentacao).ToListAsync();
        }

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
