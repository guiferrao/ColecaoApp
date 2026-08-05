using ColecaoApp.Application.Interfaces;
using ColecaoApp.Domain.Entities;
using ColecaoApp.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace ColecaoApp.Infrastructure.Repositories;

public class CamisaRepository : ICamisaRepository
{
    private readonly AppDbContext _context;

    public CamisaRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Camisa?> ObterPorIdAsync(int id)
    {
        return await _context.Camisas
            .FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task<List<Camisa>> ObterPorUsuarioIdAsync(int usuarioId)
    {
        return await _context.Camisas
            .Where(c => c.UsuarioId == usuarioId)
            .ToListAsync();
    }

    public async Task AdicionarAsync(Camisa camisa)
    {
        await _context.Camisas.AddAsync(camisa);
        await _context.SaveChangesAsync();
    }

    public async Task AtualizarAsync(Camisa camisa)
    {
        _context.Camisas.Update(camisa);
        await _context.SaveChangesAsync();
    }

    public async Task DeletarAsync(int id)
    {
        var camisa = await ObterPorIdAsync(id);
        if (camisa != null)
        {
            _context.Camisas.Remove(camisa);
            await _context.SaveChangesAsync();
        }
    }
}