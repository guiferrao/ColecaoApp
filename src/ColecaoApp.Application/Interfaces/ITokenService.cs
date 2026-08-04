using ColecaoApp.Domain.Entities;

namespace ColecaoApp.Application.Interfaces;

public interface ITokenService
{
    string GerarToken(Usuario usuario);
}