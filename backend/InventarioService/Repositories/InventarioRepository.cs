
using InventarioService.Data;
using InventarioService.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace InventarioService.Services
{
    public class InventarioService
    {
        private readonly AppDbContext _context;

        public InventarioService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Inventario>> ListarPendentesAsync()
        {
            return await _context.Inventarios
                .Where(i => !i.Confirmado)
                .ToListAsync();
        }

        public async Task AdicionarItemAsync(Inventario item)
        {
            await _context.Inventarios.AddAsync(item);
            await _context.SaveChangesAsync();
        }

        public async Task ConfirmarInventarioAsync()
        {
            var pendentes = await _context.Inventarios
                .Where(i => !i.Confirmado)
                .ToListAsync();

            _context.Inventarios.RemoveRange(pendentes);
            await _context.SaveChangesAsync();
        }

        private async Task AtualizarEstoque(IEnumerable<Inventario> itens)
        {
            foreach (var item in itens)
            {
            }
            await _context.SaveChangesAsync();
        }
    }
}