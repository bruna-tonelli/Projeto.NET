namespace FinanceiroService.Services
{
    public interface IFinanceiroService
    {
        Task RegistrarTransacaoAsync(int movimentacaoId, string tipo, decimal valorTotal);
        Task<decimal> CalcularSaldoAsync();
    }
}
