using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Shared.DTOs;
using UsuarioService.Services;

namespace UsuarioService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(new BaseResponse
            {
                Success = false,
                Message = "Dados inválidos",
                Error = string.Join(", ", ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)))
            });
        }

        var response = await _authService.LoginAsync(request);
        
        if (response.Success)
        {
            return Ok(response);
        }

        return BadRequest(response);
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(new BaseResponse
            {
                Success = false,
                Message = "Dados inválidos",
                Error = string.Join(", ", ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)))
            });
        }

        var response = await _authService.RegisterAsync(request);
        
        if (response.Success)
        {
            return Ok(response);
        }

        return BadRequest(response);
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> GetCurrentUser()
    {
        var userId = User.FindFirst("userId")?.Value;
        
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized(new BaseResponse
            {
                Success = false,
                Message = "Token inválido"
            });
        }

        var user = await _authService.GetUserByIdAsync(userId);
        
        if (user == null)
        {
            return NotFound(new BaseResponse
            {
                Success = false,
                Message = "Usuário não encontrado"
            });
        }

        return Ok(new BaseResponse
        {
            Success = true,
            Message = "Usuário encontrado",
            Data = new
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                Role = user.Role
            }
        });
    }
}
