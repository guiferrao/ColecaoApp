using ColecaoApp.Domain.Entities;

namespace ColecaoApp.Application.Interfaces;

public interface ICamisaRepository
{
    Task<Camisa?> ObterPorIdAsync(int id);
    Task<List<Camisa>> ObterPorUsuarioIdAsync(int usuarioId);
    Task AdicionarAsync(Camisa camisa);
    Task AtualizarAsync(Camisa camisa);
    Task DeletarAsync(int id);
}