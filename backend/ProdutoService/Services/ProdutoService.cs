using Microsoft.EntityFrameworkCore;
using ProdutoService.Data;
using ProdutoService.Models;
using ProdutoService.Repositories;
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
                Console.WriteLine($"Termo é numérico, buscando por ID: {id}");
                var produtoPorId = await _context.Produtos
                    .Where(p => p.Id == id)
                    .ToListAsync();

                if (produtoPorId.Any())
                {
                    Console.WriteLine($"Produto encontrado por ID: {produtoPorId.First().Nome}");
                    return produtoPorId;
                }
            }

            // Se não encontrou por ID, busca por nome
            Console.WriteLine("Buscando por nome...");
            var produtosPorNome = await _context.Produtos
                .Where(p => p.Nome.ToLower().Contains(term.ToLower()))
                .ToListAsync();

            Console.WriteLine($"Produtos encontrados por nome: {produtosPorNome.Count}");
            return produtosPorNome;
        }

        public async Task AtualizarQuantidadesAsync(List<Controllers.AtualizarQuantidadeDto> atualizacoes)
        {
            try
            {
                Console.WriteLine($"Iniciando atualização de {atualizacoes.Count} produtos");
                
                foreach (var atualizacao in atualizacoes)
                {
                    var produto = await _context.Produtos.FindAsync(atualizacao.Id);
                    if (produto != null)
                    {
                        Console.WriteLine($"Atualizando produto {produto.Nome}: {produto.Quantidade} → {atualizacao.Quantidade}");
                        produto.Quantidade = atualizacao.Quantidade;
                        produto.DataAtualizacao = DateTime.Now;
                    }
                    else
                    {
                        Console.WriteLine($"Produto com ID {atualizacao.Id} não encontrado");
                    }
                }
                
                await _context.SaveChangesAsync();
                Console.WriteLine("Todas as quantidades foram atualizadas no banco");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro no serviço de atualização: {ex.Message}");
                throw;
            }
        }
    }
}
