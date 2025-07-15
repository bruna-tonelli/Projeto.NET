using Microsoft.EntityFrameworkCore;
using UsuarioService.Data;
using UsuarioService.Models;

namespace UsuarioService.Repositories;

public interface IUsuarioRepository
{
    Task<Usuario?> GetByEmailAsync(string email);
    Task<Usuario?> GetByIdAsync(string id);
    Task<Usuario> CreateAsync(Usuario usuario);
    Task<Usuario> UpdateAsync(Usuario usuario);
    Task<bool> ExistsAsync(string email);
    Task<List<Usuario>> GetAllAsync();
    Task<bool> DeleteAsync(string id);
}

public class UsuarioRepository : IUsuarioRepository
{
    private readonly AppDbContext _context;

    public UsuarioRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Usuario?> GetByEmailAsync(string email)
    {
        return await _context.Usuarios
            .FirstOrDefaultAsync(u => u.Email == email && u.IsActive);
    }

    public async Task<Usuario?> GetByIdAsync(string id)
    {
        return await _context.Usuarios
            .FirstOrDefaultAsync(u => u.Id == id && u.IsActive);
    }

    public async Task<Usuario> CreateAsync(Usuario usuario)
    {
        _context.Usuarios.Add(usuario);
        await _context.SaveChangesAsync();
        return usuario;
    }

    public async Task<Usuario> UpdateAsync(Usuario usuario)
    {
        usuario.UpdatedAt = DateTime.UtcNow;
        _context.Usuarios.Update(usuario);
        await _context.SaveChangesAsync();
        return usuario;
    }

    public async Task<bool> ExistsAsync(string email)
    {
        return await _context.Usuarios
            .AnyAsync(u => u.Email == email);
    }

    public async Task<List<Usuario>> GetAllAsync()
    {
        return await _context.Usuarios
            .Where(u => u.IsActive)
            .ToListAsync();
    }

    public async Task<bool> DeleteAsync(string id)
    {
        try
        {
            var usuario = await _context.Usuarios.FindAsync(id);
            if (usuario == null)
            {
                return false;
            }

            // Exclusão lógica - marcar como inativo ao invés de remover fisicamente
            usuario.IsActive = false;
            usuario.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return true;
        }
        catch
        {
            return false;
        }
    }
}
