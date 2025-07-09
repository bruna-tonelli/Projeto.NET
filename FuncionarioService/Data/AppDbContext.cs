using Microsoft.EntityFrameworkCore;
using SeuProjeto.Models; // Importa o modelo Funcionario

namespace FuncionarioService.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        // Esta linha diz ao Entity Framework para criar uma tabela chamada "Funcionarios"
        // baseada na estrutura da classe "Funcionario".
        public DbSet<Funcionario> Funcionarios { get; set; }
    }
}