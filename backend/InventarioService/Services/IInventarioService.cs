using InventarioService.Models;
using InventarioService.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;
using global::InventarioService.Models;
using InventarioService.Models;

namespace InventarioService.Services
{
    public interface IInventarioService
    {
        Task<IEnumerable<InventarioCompletoDto>> ListarInventariosAsync();
        Task<InventarioCompletoDto> ObterInventarioAsync(int id);
        Task<InventarioCompletoDto> CriarInventarioAsync(CreateInventarioDto dto);
        Task AdicionarItemAsync(AddItemInventarioDto dto);
        Task<ComparacaoInventario> CompararInventarioAsync(int inventarioId);
        Task AtualizarEstoqueAsync(int inventarioId);
        Task EditarItemAsync(int itemId, AddItemInventarioDto dto);
        Task RemoverItemAsync(int itemId);
        Task FinalizarInventarioAsync(int inventarioId);
    }
}

