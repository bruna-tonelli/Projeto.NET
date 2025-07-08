using ProdutoService.Data;
using ProdutoService.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace ProdutoService.Services
{
    public class ProdutoService
    {
        private readonly AppDbContext _context;
        public ProdutoService(AppDbContext context) => _context = context;

        public async Task<IEnumerable<Produto>> GetAllAsync() =>
            await _context.Produtos.ToListAsync();

        public async Task<Produto?> GetByIdAsync(int id) =>
            await _context.Produtos.FindAsync(id);

        public async Task AddAsync(Produto produto)
        {
            _context.Produtos.Add(produto);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Produto produto)
        {
            _context.Entry(produto).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var produto = await _context.Produtos.FindAsync(id);
            if (produto != null)
            {
                _context.Produtos.Remove(produto);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<Produto>> SearchAsync(string searchTerm)
        {
            if (string.IsNullOrWhiteSpace(searchTerm))
                return await GetAllAsync();

            var term = searchTerm.Trim();
            Console.WriteLine($"Pesquisando por termo: '{term}'");

            // Primeiro, tenta buscar por ID exato
            if (int.TryParse(term, out int id))
            {
                var produtoPorId = await _context.Produtos
                    .Where(p => p.Id == id)
                    .ToListAsync();
                
                if (produtoPorId.Any())
                {
                    Console.WriteLine($"Encontrado produto por ID: {produtoPorId.Count}");
                    return produtoPorId;
                }
            }

            // Depois busca por nome (case-insensitive)
            var termLower = term.ToLower();
            var produtosPorNome = await _context.Produtos
                .Where(p => p.Nome.ToLower().Contains(termLower))
                .ToListAsync();

            Console.WriteLine($"Produtos encontrados por nome: {produtosPorNome.Count}");
            foreach (var p in produtosPorNome)
            {
                Console.WriteLine($"- {p.Id}: {p.Nome}");
            }

            // Se não encontrou por nome, busca na descrição
            if (!produtosPorNome.Any())
            {
                var produtosPorDescricao = await _context.Produtos
                    .Where(p => p.Descricao != null && p.Descricao.ToLower().Contains(termLower))
                    .ToListAsync();
                
                Console.WriteLine($"Produtos encontrados por descrição: {produtosPorDescricao.Count}");
                return produtosPorDescricao;
            }

            return produtosPorNome;
        }
    }
}
