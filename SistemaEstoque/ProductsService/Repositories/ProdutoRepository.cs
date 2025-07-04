// Repositories/ProdutoRepository.cs
using ProductsService.Data;
using ProductsService.Models;

namespace ProductsService.Repositories;

public interface IProdutoRepository
{
    Task<Produto> AdicionarProdutoAsync(Produto produto);
}

public class ProdutoRepository : IProdutoRepository
{
    private readonly AppDbContext _context;

    public ProdutoRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Produto> AdicionarProdutoAsync(Produto produto)
    {
        _context.PRODUTOS.Add(produto);
        await _context.SaveChangesAsync();
        return produto;
    }
}