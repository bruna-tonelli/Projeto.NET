using FinanceiroService.DTOs; // Importar o novo DTO
using System.Collections.Generic; // Para usar IEnumerable
using System.Threading.Tasks; // Para usar Task

namespace FinanceiroService.Services
{
    public interface IFinanceiroService
    {
        Task RegistrarTransacaoAsync(int movimentacaoId, string tipo, decimal valorTotal);
        Task<decimal> CalcularSaldoAsync();

        // --- MÉTODO ADICIONADO ---
        Task<IEnumerable<ResumoMensalDto>> GetResumoMensalAsync();
    }
}