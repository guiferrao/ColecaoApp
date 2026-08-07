using ColecaoApp.Domain.Enums;

namespace ColecaoApp.Application.DTOs.Camisas;

public record CriarCamisaDto(
    string NomeTime,
    string Marca,
    string Temporada,
    Tamanho Tamanho,
    TipoCamisa Tipo,
    VersaoCamisa Versao,
    int? Numero,
    string? NomeJogador,
    bool IsAutografada,
    string? FotoUrl
);