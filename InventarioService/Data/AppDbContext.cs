using System.Collections.Generic;
using InventarioService.Models;
using Microsoft.EntityFrameworkCore;

namespace InventarioService.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        { }

        public DbSet<Inventario> Inventarios { get; set; }

        internal async Task SaveChangesAsync()
        {
            await base.SaveChangesAsync();
        }
    }
}