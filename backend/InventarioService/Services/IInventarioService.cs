using InventarioService.Services;
using System.Collections.Generic;
using System.Threading.Tasks;
using global::InventarioService.Models;
using InventarioService.Models;

namespace InventarioService.Services
{
    public interface IInventarioService
    {
        Task<IEnumerable<Inventario>> ListarPendentesAsync();
        Task AdicionarItemAsync(Inventario item);
        Task ConfirmarInventarioAsync();
    }
}

