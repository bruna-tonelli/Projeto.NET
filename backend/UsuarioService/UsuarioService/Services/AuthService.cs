using BCrypt.Net;
using Shared.DTOs;
using Shared.Utils;
using UsuarioService.Models;
using UsuarioService.Repositories;

namespace UsuarioService.Services;

public interface IAuthService
{
    Task<LoginResponse> LoginAsync(LoginRequest request);
    Task<BaseResponse> RegisterAsync(RegisterRequest request);
    Task<Usuario?> GetUserByIdAsync(string userId);
    Task<List<Usuario>> GetAllUsersAsync();
    Task<bool> DeleteUserAsync(string userId);
}

public class AuthService : IAuthService
{
    private readonly IUsuarioRepository _usuarioRepository;
    private readonly JwtHelper _jwtHelper;

    public AuthService(IUsuarioRepository usuarioRepository, JwtHelper jwtHelper)
    {
        _usuarioRepository = usuarioRepository;
        _jwtHelper = jwtHelper;
    }

    public async Task<LoginResponse> LoginAsync(LoginRequest request)
    {
        try
        {
            var user = await _usuarioRepository.GetByEmailAsync(request.Email);
            
            if (user == null)
            {
                return new LoginResponse
                {
                    Success = false,
                    Message = "Credenciais inválidas"
                };
            }
            
            if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                return new LoginResponse
                {
                    Success = false,
                    Message = "Credenciais inválidas"
                };
            }

            var token = _jwtHelper.GenerateToken(user.Id, user.Email, user.Role);

            return new LoginResponse
            {
                Success = true,
                Message = "Login realizado com sucesso",
                Token = token,
                User = new UserInfo
                {
                    Id = user.Id,
                    Name = user.Name,
                    Email = user.Email,
                    Role = user.Role
                }
            };
        }
        catch (Exception ex)
        {
            return new LoginResponse
            {
                Success = false,
                Message = "Erro interno do servidor",
                Error = ex.Message
            };
        }
    }

    public async Task<BaseResponse> RegisterAsync(RegisterRequest request)
    {
        try
        {
            // Verificar se o email já existe
            var existingUser = await _usuarioRepository.GetByEmailAsync(request.Email);
            if (existingUser != null)
            {
                return new BaseResponse
                {
                    Success = false,
                    Message = "Email já cadastrado"
                };
            }

            // Criar novo usuário
            var user = new Usuario
            {
                Id = Guid.NewGuid().ToString(),
                Name = request.Name,
                Email = request.Email,
                Phone = request.Telefone,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                Role = "User", // Sempre criar como User
                CreatedAt = DateTime.UtcNow,
                IsActive = true,
                EmailConfirmed = false,
                FailedLoginAttempts = 0
            };

            await _usuarioRepository.CreateAsync(user);

            return new BaseResponse
            {
                Success = true,
                Message = "Usuário cadastrado com sucesso"
            };
        }
        catch (Exception ex)
        {
            return new BaseResponse
            {
                Success = false,
                Message = "Erro interno do servidor",
                Error = ex.Message
            };
        }
    }

    public async Task<Usuario?> GetUserByIdAsync(string userId)
    {
        return await _usuarioRepository.GetByIdAsync(userId);
    }

    public async Task<List<Usuario>> GetAllUsersAsync()
    {
        return await _usuarioRepository.GetAllAsync();
    }

    public async Task<bool> DeleteUserAsync(string userId)
    {
        try
        {
            var user = await _usuarioRepository.GetByIdAsync(userId);
            if (user == null)
            {
                return false;
            }

            await _usuarioRepository.DeleteAsync(userId);
            return true;
        }
        catch
        {
            return false;
        }
    }
}
