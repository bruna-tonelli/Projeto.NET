using InventarioService.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace InventarioService.Repositories
{
    public interface IInventarioRepository
    {
        Task<IEnumerable<Inventario>> GetTodosAsync();
        Task<IEnumerable<Inventario>> GetPendentesAsync();
        Task<Inventario?> GetPorIdAsync(int id);
        Task AdicionarAsync(Inventario inventario);
        Task ConfirmarInventarioAsync();
        Task SalvarAsync();
    }
}