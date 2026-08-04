using ColecaoApp.Domain.Entities;

namespace ColecaoApp.Application.Interfaces;

public interface IUsuarioRepository
{
    Task<Usuario?> ObterPorEmailAsync(string email);
    Task<Usuario?> ObterPorIdAsync(int id);
    Task<bool> ExisteComEmailAsync(string email);
    Task AdicionarAsync(Usuario usuario);
}