using InventarioService.Data;
using InventarioService.DTOs;
using InventarioService.Models;
using Microsoft.EntityFrameworkCore;

namespace InventarioService.Services
{
    public interface IInventarioService
    {
        Task<InventarioDto> CriarInventarioAsync(CreateInventarioDto dto);
        Task<InventarioDto?> ObterInventarioAsync(int id);
        Task<IEnumerable<InventarioDto>> ListarInventariosAsync();
        Task<InventarioDto> AtualizarInventarioAsync(int id, UpdateInventarioDto dto);
        Task<bool> ExcluirInventarioAsync(int id);
        Task<InventarioProdutoDto> AdicionarProdutoAsync(AddProdutoInventarioDto dto);
        Task<IEnumerable<InventarioProdutoDto>> ListarProdutosInventarioAsync();
        Task<bool> RemoverProdutoAsync(int produtoInventarioId);
        Task AtualizarQuantidadesProdutosAsync(List<AtualizarQuantidadeDto> atualizacoes);
    }

    public class InventarioServiceImpl : IInventarioService
    {
        private readonly AppDbContext _context;
        private readonly HttpClient _httpClient;

        public InventarioServiceImpl(AppDbContext context, HttpClient httpClient)
        {
            _context = context;
            _httpClient = httpClient;
        }

        public async Task<InventarioDto> CriarInventarioAsync(CreateInventarioDto dto)
        {
            var inventario = new Inventario
            {
                DataCriacao = DateTime.Now,
                Responsavel = dto.Responsavel,
                Status = dto.Status ?? "Pendente"
            };

            _context.Inventarios.Add(inventario);
            await _context.SaveChangesAsync();

            return new InventarioDto
            {
                Id = inventario.Id,
                DataCriacao = inventario.DataCriacao,
                Responsavel = inventario.Responsavel,
                Status = inventario.Status,
                Produtos = new List<InventarioProdutoDto>()
            };
        }

        public async Task<InventarioDto?> ObterInventarioAsync(int id)
        {
            var inventario = await _context.Inventarios
                .Include(i => i.Produtos)
                .FirstOrDefaultAsync(i => i.Id == id);

            if (inventario == null)
                return null;

            return new InventarioDto
            {
                Id = inventario.Id,
                DataCriacao = inventario.DataCriacao,
                Responsavel = inventario.Responsavel,
                Status = inventario.Status,
                Produtos = inventario.Produtos.Select(p => new InventarioProdutoDto
                {
                    Id = p.Id,
                    ProdutoId = p.ProdutoId,
                    QuantidadeContada = p.QuantidadeContada,
                    InventarioId = p.InventarioId
                }).ToList()
            };
        }

        public async Task<IEnumerable<InventarioDto>> ListarInventariosAsync()
        {
            var inventarios = await _context.Inventarios
                .Include(i => i.Produtos)
                .OrderByDescending(i => i.DataCriacao)
                .ToListAsync();

            return inventarios.Select(i => new InventarioDto
            {
                Id = i.Id,
                DataCriacao = i.DataCriacao,
                Responsavel = i.Responsavel,
                Status = i.Status,
                Produtos = i.Produtos.Select(p => new InventarioProdutoDto
                {
                    Id = p.Id,
                    ProdutoId = p.ProdutoId,
                    QuantidadeContada = p.QuantidadeContada,
                    InventarioId = p.InventarioId
                }).ToList()
            });
        }

        public async Task<InventarioDto> AtualizarInventarioAsync(int id, UpdateInventarioDto dto)
        {
            var inventario = await _context.Inventarios.FindAsync(id);
            if (inventario == null)
                throw new ArgumentException("Inventário não encontrado");

            inventario.Responsavel = dto.Responsavel;
            inventario.Status = dto.Status;

            await _context.SaveChangesAsync();

            return new InventarioDto
            {
                Id = inventario.Id,
                DataCriacao = inventario.DataCriacao,
                Responsavel = inventario.Responsavel,
                Status = inventario.Status,
                Produtos = new List<InventarioProdutoDto>()
            };
        }

        public async Task<bool> ExcluirInventarioAsync(int id)
        {
            var inventario = await _context.Inventarios
                .Include(i => i.Produtos)
                .FirstOrDefaultAsync(i => i.Id == id);
            
            if (inventario == null)
                return false;

            try
            {
                if (inventario.Produtos != null && inventario.Produtos.Any())
                {
                    _context.InventariosProduto.RemoveRange(inventario.Produtos);
                }
                
                _context.Inventarios.Remove(inventario);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro ao excluir inventário: {ex.Message}");
                throw;
            }
        }

        public async Task<InventarioProdutoDto> AdicionarProdutoAsync(AddProdutoInventarioDto dto)
        {
            var produto = new InventarioProduto
            {
                ProdutoId = dto.ProdutoId,
                QuantidadeContada = dto.QuantidadeContada,
                InventarioId = dto.InventarioId
            };

            _context.InventariosProduto.Add(produto);
            await _context.SaveChangesAsync();

            return new InventarioProdutoDto
            {
                Id = produto.Id,
                ProdutoId = produto.ProdutoId,
                QuantidadeContada = produto.QuantidadeContada,
                InventarioId = produto.InventarioId
            };
        }

        public async Task<IEnumerable<InventarioProdutoDto>> ListarProdutosInventarioAsync()
        {
            var produtos = await _context.InventariosProduto.ToListAsync();

            return produtos.Select(p => new InventarioProdutoDto
            {
                Id = p.Id,
                ProdutoId = p.ProdutoId,
                QuantidadeContada = p.QuantidadeContada,
                InventarioId = p.InventarioId
            });
        }

        public async Task<bool> RemoverProdutoAsync(int produtoInventarioId)
        {
            var produto = await _context.InventariosProduto.FindAsync(produtoInventarioId);
            if (produto == null)
                return false;

            _context.InventariosProduto.Remove(produto);
            await _context.SaveChangesAsync();
            return true;
        }

       
        public async Task AtualizarQuantidadesProdutosAsync(List<AtualizarQuantidadeDto> atualizacoes)
        {
            try
            {
                Console.WriteLine($"[InventarioService] Iniciando atualização de {atualizacoes.Count} produtos");
                
                // Configurar timeout
                _httpClient.Timeout = TimeSpan.FromSeconds(30);
                
                var response = await _httpClient.PutAsJsonAsync("http://api-gateway:8080/api/produtos/atualizar-quantidades", atualizacoes);
                
                Console.WriteLine($"[InventarioService] Response Status: {response.StatusCode}");
                
                if (!response.IsSuccessStatusCode)
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    Console.WriteLine($"[InventarioService] Erro HTTP: {errorContent}");
                    
                    // NÃO fazer throw - log o erro mas continue
                    Console.WriteLine("[InventarioService] Atualização falhou, mas inventário foi finalizado");
                }
                else
                {
                    Console.WriteLine("[InventarioService] Produtos atualizados com sucesso");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[InventarioService] Erro na atualização: {ex.Message}");
                // NÃO fazer throw - log o erro mas não falhe a operação principal
                Console.WriteLine("[InventarioService] Inventário finalizado apesar do erro na atualização");
            }
        }
    }
}