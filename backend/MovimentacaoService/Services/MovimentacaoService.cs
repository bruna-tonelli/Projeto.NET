using Microsoft.EntityFrameworkCore;
using MovimentacaoService.Data;
using MovimentacaoService.Models;
using System.Text;
using System.Text.Json;

namespace MovimentacaoService.Services {
    public class MovimentacaoService {

        private readonly AppDbContext _context;
        private readonly HttpClient _httpClient;
        private readonly string _produtoServiceUrl = "http://produto-service:8080/api/produtos";

        public MovimentacaoService(AppDbContext context, HttpClient httpClient) {
            _context = context;
            _httpClient = httpClient;
        }

        public async Task<IEnumerable<Movimentacao>> GetByTipoAsync(string tipo) {
    // Normalizar o tipo para tratar variações de acentuação
    var tipoNormalizado = tipo.ToUpper()
        .Replace("SAIDA", "SAÍDA")
        .Replace("SAÍDA", "SAÍDA"); // Garante que fica padronizado
        
        return await _context.movimentacao
                            .Where(m => m.Tipo.ToUpper() == tipoNormalizado || 
                                    (tipoNormalizado == "SAÍDA" && (m.Tipo.ToUpper() == "SAIDA" || m.Tipo.ToUpper() == "SAÍDA")) ||
                                    (tipoNormalizado == "ENTRADA" && m.Tipo.ToUpper() == "ENTRADA"))
                            .ToListAsync();
     }

        public async Task<IEnumerable<Movimentacao>> FiltrarMovimentacoesAsync(string? tipo, DateTime? dataInicial, DateTime? dataFinal)
        {
            var query = _context.movimentacao.AsQueryable();

            if (!string.IsNullOrEmpty(tipo))
            {
                // Normalizar o tipo para tratar variações de acentuação
                var tipoNormalizado = tipo.ToUpper()
                    .Replace("SAIDA", "SAÍDA")
                    .Replace("SAÍDA", "SAÍDA"); // Garante que fica padronizado
                    
                query = query.Where(m => m.Tipo.ToUpper() == tipoNormalizado || 
                                    (tipoNormalizado == "SAÍDA" && (m.Tipo.ToUpper() == "SAIDA" || m.Tipo.ToUpper() == "SAÍDA")) ||
                                    (tipoNormalizado == "ENTRADA" && m.Tipo.ToUpper() == "ENTRADA"));
            }

            if (dataInicial.HasValue)
            {
                query = query.Where(m => m.DataMovimentacao >= dataInicial.Value);
            }

            if (dataFinal.HasValue)
            {
                // Adicionar 23:59:59 à data final para incluir todo o dia
                var dataFinalCompleta = dataFinal.Value.Date.AddDays(1).AddTicks(-1);
                query = query.Where(m => m.DataMovimentacao <= dataFinalCompleta);
            }

            return await query.OrderByDescending(m => m.DataMovimentacao).ToListAsync();
        }

        public async Task<IEnumerable<Movimentacao>> GetAllAsync() =>
            await _context.movimentacao.ToListAsync();

        public async Task<Movimentacao?> GetByIdAsync(int id) =>
            await _context.movimentacao.FindAsync(id);

        public async Task AddAsync(Movimentacao movimentar) {
            // Primeiro, verificar se o produto existe e obter suas informações
            var produtoResponse = await _httpClient.GetAsync($"{_produtoServiceUrl}/{movimentar.ProdutoId}");
            if (!produtoResponse.IsSuccessStatusCode) {
                throw new Exception($"Produto com ID {movimentar.ProdutoId} não encontrado");
            }

            var produtoJson = await produtoResponse.Content.ReadAsStringAsync();
            var produto = JsonSerializer.Deserialize<ProdutoDto>(produtoJson, new JsonSerializerOptions {
                PropertyNameCaseInsensitive = true
            });

            if (produto == null) {
                throw new Exception("Erro ao deserializar dados do produto");
            }

            // Calcular nova quantidade baseada no tipo de movimentação
            int novaQuantidade;
            if (movimentar.Tipo.ToUpper() == "ENTRADA") {
                novaQuantidade = produto.Quantidade + movimentar.Quantidade;
            } else if (movimentar.Tipo.ToUpper() == "SAÍDA" || movimentar.Tipo.ToUpper() == "SAIDA") {
                novaQuantidade = produto.Quantidade - movimentar.Quantidade;
                if (novaQuantidade < 0) {
                    throw new Exception($"Estoque insuficiente. Quantidade atual: {produto.Quantidade}, solicitado: {movimentar.Quantidade}");
                }
            } else {
                throw new Exception("Tipo de movimentação inválido. Use 'ENTRADA' ou 'SAÍDA'");
            }

            // Atualizar o produto via API
            var produtoAtualizado = new {
                id = produto.Id,
                nome = produto.Nome,
                descricao = produto.Descricao,
                quantidade = novaQuantidade,
                precoCompra = produto.PrecoCompra,
                precoVenda = produto.PrecoVenda,
                ativo = produto.Ativo
            };

            var jsonContent = JsonSerializer.Serialize(produtoAtualizado);
            var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");
            
            var updateResponse = await _httpClient.PutAsync($"{_produtoServiceUrl}/{produto.Id}", content);
            if (!updateResponse.IsSuccessStatusCode) {
                var errorContent = await updateResponse.Content.ReadAsStringAsync();
                throw new Exception($"Erro ao atualizar estoque do produto: {errorContent}");
            }

            // Se chegou até aqui, pode salvar a movimentação
            _context.movimentacao.Add(movimentar);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Movimentacao movimentar) {
            // Buscar a movimentação original para reverter o estoque
            var movimentacaoOriginal = await _context.movimentacao.AsNoTracking().FirstOrDefaultAsync(m => m.Id == movimentar.Id);
            if (movimentacaoOriginal == null) {
                throw new Exception("Movimentação não encontrada");
            }

            // Verificar se o produto existe
            var produtoResponse = await _httpClient.GetAsync($"{_produtoServiceUrl}/{movimentar.ProdutoId}");
            if (!produtoResponse.IsSuccessStatusCode) {
                throw new Exception($"Produto com ID {movimentar.ProdutoId} não encontrado");
            }

            var produtoJson = await produtoResponse.Content.ReadAsStringAsync();
            var produto = JsonSerializer.Deserialize<ProdutoDto>(produtoJson, new JsonSerializerOptions {
                PropertyNameCaseInsensitive = true
            });

            if (produto == null) {
                throw new Exception("Erro ao deserializar dados do produto");
            }

            // Reverter a movimentação original
            int quantidadeAtual = produto.Quantidade;
            if (movimentacaoOriginal.Tipo.ToUpper() == "ENTRADA") {
                quantidadeAtual -= movimentacaoOriginal.Quantidade; // Remove o que foi adicionado
            } else if (movimentacaoOriginal.Tipo.ToUpper() == "SAÍDA" || movimentacaoOriginal.Tipo.ToUpper() == "SAIDA") {
                quantidadeAtual += movimentacaoOriginal.Quantidade; // Adiciona o que foi removido
            }

            // Aplicar a nova movimentação
            int novaQuantidade;
            if (movimentar.Tipo.ToUpper() == "ENTRADA") {
                novaQuantidade = quantidadeAtual + movimentar.Quantidade;
            } else if (movimentar.Tipo.ToUpper() == "SAÍDA" || movimentar.Tipo.ToUpper() == "SAIDA") {
                novaQuantidade = quantidadeAtual - movimentar.Quantidade;
                if (novaQuantidade < 0) {
                    throw new Exception($"Estoque insuficiente. Quantidade disponível: {quantidadeAtual}, solicitado: {movimentar.Quantidade}");
                }
            } else {
                throw new Exception("Tipo de movimentação inválido. Use 'ENTRADA' ou 'SAÍDA'");
            }

            // Atualizar o produto
            var produtoAtualizado = new {
                id = produto.Id,
                nome = produto.Nome,
                descricao = produto.Descricao,
                quantidade = novaQuantidade,
                precoCompra = produto.PrecoCompra,
                precoVenda = produto.PrecoVenda,
                ativo = produto.Ativo
            };

            var jsonContent = JsonSerializer.Serialize(produtoAtualizado);
            var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");
            
            var updateResponse = await _httpClient.PutAsync($"{_produtoServiceUrl}/{produto.Id}", content);
            if (!updateResponse.IsSuccessStatusCode) {
                var errorContent = await updateResponse.Content.ReadAsStringAsync();
                throw new Exception($"Erro ao atualizar estoque do produto: {errorContent}");
            }

            // Atualizar a movimentação
            _context.Entry(movimentar).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id) {
            var movimentar = await _context.movimentacao.FindAsync(id);
            if (movimentar != null) {
                // Verificar se o produto existe
                var produtoResponse = await _httpClient.GetAsync($"{_produtoServiceUrl}/{movimentar.ProdutoId}");
                if (!produtoResponse.IsSuccessStatusCode) {
                    throw new Exception($"Produto com ID {movimentar.ProdutoId} não encontrado");
                }

                var produtoJson = await produtoResponse.Content.ReadAsStringAsync();
                var produto = JsonSerializer.Deserialize<ProdutoDto>(produtoJson, new JsonSerializerOptions {
                    PropertyNameCaseInsensitive = true
                });

                if (produto == null) {
                    throw new Exception("Erro ao deserializar dados do produto");
                }

                // Reverter a movimentação no estoque
                int novaQuantidade;
                if (movimentar.Tipo.ToUpper() == "ENTRADA") {
                    novaQuantidade = produto.Quantidade - movimentar.Quantidade; // Remove o que foi adicionado
                    if (novaQuantidade < 0) {
                        throw new Exception($"Não é possível excluir esta movimentação. O estoque atual ({produto.Quantidade}) ficaria negativo.");
                    }
                } else if (movimentar.Tipo.ToUpper() == "SAÍDA" || movimentar.Tipo.ToUpper() == "SAIDA") {
                    novaQuantidade = produto.Quantidade + movimentar.Quantidade; // Adiciona de volta o que foi removido
                } else {
                    throw new Exception("Tipo de movimentação inválido");
                }

                // Atualizar o produto
                var produtoAtualizado = new {
                    id = produto.Id,
                    nome = produto.Nome,
                    descricao = produto.Descricao,
                    quantidade = novaQuantidade,
                    precoCompra = produto.PrecoCompra,
                    precoVenda = produto.PrecoVenda,
                    ativo = produto.Ativo
                };

                var jsonContent = JsonSerializer.Serialize(produtoAtualizado);
                var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");
                
                var updateResponse = await _httpClient.PutAsync($"{_produtoServiceUrl}/{produto.Id}", content);
                if (!updateResponse.IsSuccessStatusCode) {
                    var errorContent = await updateResponse.Content.ReadAsStringAsync();
                    throw new Exception($"Erro ao atualizar estoque do produto: {errorContent}");
                }

                // Remover a movimentação
                _context.movimentacao.Remove(movimentar);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<Movimentacao>> SearchAsync(string searchTerm) {
            if (string.IsNullOrWhiteSpace(searchTerm))
                return await GetAllAsync();

            if (int.TryParse(searchTerm.Trim(), out int id)) {
                var resultado = await _context.movimentacao
                    .Where(m => m.Id == id)
                    .ToListAsync();

                return resultado;
            }

            // Se não for um número válido, retorna vazio
            return new List<Movimentacao>();
        }
    }

    // DTO para deserializar o produto
    public class ProdutoDto
    {
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string Descricao { get; set; } = string.Empty;
        public int Quantidade { get; set; }
        public decimal PrecoCompra { get; set; }
        public decimal PrecoVenda { get; set; }
        public bool Ativo { get; set; }
    }
}
