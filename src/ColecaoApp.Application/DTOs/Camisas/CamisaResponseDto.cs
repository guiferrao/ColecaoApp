using ColecaoApp.Domain.Enums;

namespace ColecaoApp.Application.DTOs.Camisas;

public record CamisaResponseDto(
    int Id,
    string NomeTime,
    string Marca,
    string Temporada,
    Tamanho Tamanho,
    TipoCamisa Tipo,
    VersaoCamisa Versao,
    int? Numero,
    string? NomeJogador,
    bool IsAutograda,
    string? FotoUrl,
    int UsuarioId,
    string Categoria,
    bool IsSelecao
);
