using System.Globalization;

namespace FinanceiroService.DTOs
{
    public class ResumoMensalDto
    {
        // Propriedades para ajudar na ordenação e formatação
        public int Ano { get; set; }
        public int Mes { get; set; }

        // Propriedade que será usada como label no gráfico (ex: "julho/2025")
        public string NomeMes { get; set; }

        // Valores que serão as barras ou pontos no gráfico
        public decimal TotalEntradas { get; set; }
        public decimal TotalSaidas { get; set; }

        // Construtor para facilitar a formatação do nome do mês
        public ResumoMensalDto(int ano, int mes)
        {
            Ano = ano;
            Mes = mes;
            // Cria uma data para formatar o nome do mês em português
            NomeMes = new DateTime(ano, mes, 1).ToString("MMMM/yyyy", new CultureInfo("pt-BR"));
        }
    }
}