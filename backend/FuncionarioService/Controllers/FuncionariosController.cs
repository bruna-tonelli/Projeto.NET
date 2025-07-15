
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace FuncionarioServices.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FuncionariosController : ControllerBase
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IConfiguration _configuration;

        public FuncionariosController(IHttpClientFactory httpClientFactory, IConfiguration configuration)
        {
            _httpClientFactory = httpClientFactory;
            _configuration = configuration;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var httpClient = _httpClientFactory.CreateClient();
                var usuarioServiceUrl = _configuration["Services:UsuarioService"] ?? "http://usuario-service:8080";
                
                var response = await httpClient.GetAsync($"{usuarioServiceUrl}/api/auth/users");
                
                if (response.IsSuccessStatusCode)
                {
                    var jsonContent = await response.Content.ReadAsStringAsync();
                    var apiResponse = JsonSerializer.Deserialize<ApiResponse>(jsonContent, new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    });

                    if (apiResponse?.Success == true && apiResponse.Data != null)
                    {
                        var usuarios = JsonSerializer.Deserialize<List<UsuarioDto>>(apiResponse.Data.ToString()!, new JsonSerializerOptions
                        {
                            PropertyNameCaseInsensitive = true
                        });

                        // Converte para o formato de funcionário/usuário
                        var funcionarios = usuarios?.Select(u => new FuncionarioDto
                        {
                            Id = u.Id,
                            Nome = u.Name,
                            Email = u.Email,
                            Cargo = u.Position ?? "Não informado",
                            Departamento = u.Department ?? "Não informado",
                            Telefone = u.Phone ?? "Não informado",
                            DataCriacao = u.CreatedAt,
                            UltimoLogin = u.LastLoginAt,
                            Ativo = u.IsActive
                        }).ToList();

                        return Ok(funcionarios ?? new List<FuncionarioDto>());
                    }
                }
                
                return Ok(new List<FuncionarioDto>());
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            try
            {
                var httpClient = _httpClientFactory.CreateClient();
                var usuarioServiceUrl = _configuration["Services:UsuarioService"] ?? "http://usuario-service:8080";
                
                var response = await httpClient.GetAsync($"{usuarioServiceUrl}/api/auth/users");
                
                if (response.IsSuccessStatusCode)
                {
                    var jsonContent = await response.Content.ReadAsStringAsync();
                    var apiResponse = JsonSerializer.Deserialize<ApiResponse>(jsonContent, new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    });

                    if (apiResponse?.Success == true && apiResponse.Data != null)
                    {
                        var usuario = JsonSerializer.Deserialize<UsuarioDto>(apiResponse.Data.ToString()!, new JsonSerializerOptions
                        {
                            PropertyNameCaseInsensitive = true
                        });

                        if (usuario != null)
                        {
                            var funcionario = new FuncionarioDetalheDto
                            {
                                Id = usuario.Id,
                                Nome = usuario.Name,
                                Email = usuario.Email,
                                Cargo = usuario.Position ?? "Não informado",
                                Departamento = usuario.Department ?? "Não informado",
                                Telefone = usuario.Phone ?? "Não informado",
                                Role = usuario.Role,
                                DataCriacao = usuario.CreatedAt,
                                UltimoLogin = usuario.LastLoginAt,
                                Ativo = usuario.IsActive,
                                EmailConfirmado = usuario.EmailConfirmed
                            };

                            return Ok(funcionario);
                        }
                    }
                }
                
                return NotFound(new { message = "Usuário não encontrado" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpGet("search")]
        public async Task<IActionResult> Search([FromQuery] string searchTerm)
        {
            try
            {
                var httpClient = _httpClientFactory.CreateClient();
                var usuarioServiceUrl = _configuration["Services:UsuarioService"] ?? "http://usuario-service:8080";
                
                var response = await httpClient.GetAsync($"{usuarioServiceUrl}/api/auth/users");
                
                if (response.IsSuccessStatusCode)
                {
                    var jsonContent = await response.Content.ReadAsStringAsync();
                    var apiResponse = JsonSerializer.Deserialize<ApiResponse>(jsonContent, new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    });

                    if (apiResponse?.Success == true && apiResponse.Data != null)
                    {
                        var usuarios = JsonSerializer.Deserialize<List<UsuarioDto>>(apiResponse.Data.ToString()!, new JsonSerializerOptions
                        {
                            PropertyNameCaseInsensitive = true
                        });

                        var funcionarios = usuarios?.Select(u => new FuncionarioDto
                        {
                            Id = u.Id,
                            Nome = u.Name,
                            Email = u.Email,
                            Cargo = u.Position ?? "Não informado",
                            Departamento = u.Department ?? "Não informado",
                            Telefone = u.Phone ?? "Não informado",
                            DataCriacao = u.CreatedAt,
                            UltimoLogin = u.LastLoginAt,
                            Ativo = u.IsActive
                        }).ToList();

                        return Ok(funcionarios ?? new List<FuncionarioDto>());
                    }
                }
                
                return Ok(new List<FuncionarioDto>());
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
    }

    // DTOs para representar os dados
    public class FuncionarioDto
    {
        public string Id { get; set; } = string.Empty;
        public string Nome { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Cargo { get; set; } = string.Empty;
        public string Departamento { get; set; } = string.Empty;
        public string Telefone { get; set; } = string.Empty;
        public DateTime DataCriacao { get; set; }
        public DateTime? UltimoLogin { get; set; }
        public bool Ativo { get; set; }
    }

    public class FuncionarioDetalheDto : FuncionarioDto
    {
        public string Role { get; set; } = string.Empty;
        public bool EmailConfirmado { get; set; }
    }

    public class UsuarioDto
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public string? Department { get; set; }
        public string? Position { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? LastLoginAt { get; set; }
        public bool IsActive { get; set; }
        public bool EmailConfirmed { get; set; }
    }

    public class ApiResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public object? Data { get; set; }
        public string? Error { get; set; }
    }
}