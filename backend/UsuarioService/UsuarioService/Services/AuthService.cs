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
    Task<Usuario?> GetUserByIdAsync(string id);
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
            
            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
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
            if (await _usuarioRepository.ExistsAsync(request.Email))
            {
                return new BaseResponse
                {
                    Success = false,
                    Message = "E-mail já está em uso"
                };
            }

            var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

            var usuario = new Usuario
            {
                Name = request.Name,
                Email = request.Email,
                PasswordHash = passwordHash,
                Role = request.Role ?? "User"
            };

            await _usuarioRepository.CreateAsync(usuario);

            return new BaseResponse
            {
                Success = true,
                Message = "Usuário criado com sucesso"
            };
        }
        catch (Exception ex)
        {
            return new BaseResponse
            {
                Success = false,
                Message = "Erro ao criar usuário",
                Error = ex.Message
            };
        }
    }

    public async Task<Usuario?> GetUserByIdAsync(string id)
    {
        return await _usuarioRepository.GetByIdAsync(id);
    }
}
