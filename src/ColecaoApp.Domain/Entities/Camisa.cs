using ColecaoApp.Domain.Enums;

namespace ColecaoApp.Domain.Entities;

public class Camisa
{
    public int Id { get; set; }
    public string NomeTime { get; set; } = string.Empty;
    public string Marca { get; set; } = string.Empty;
    public string Temporada { get; set; } = string.Empty;
    public Tamanho Tamanho { get; set; }
    public TipoCamisa Tipo { get; set; }
    public VersaoCamisa Versao { get; set; }
    public int? Numero { get; set;}
    public string? NomeJogador { get; set; }
    public bool IsAutografada { get; set; }
    public string? FotoUrl { get; set; }
    public Usuario Usuario { get; set;} = null!;
    public int UsuarioId { get; set; }
}