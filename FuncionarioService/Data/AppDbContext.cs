
using FuncionarioServices.Models;
using Microsoft.EntityFrameworkCore;

namespace FuncionarioServices.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<Funcionario> Funcionarios { get; set; }
    }
}