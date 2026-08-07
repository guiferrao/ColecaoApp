using System.Xml;
using BCrypt.Net;
using ColecaoApp.Application.DTOs.Auth;
using ColecaoApp.Application.Interfaces;
using ColecaoApp.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace ColecaoApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IUsuarioRepository _usuarioRepository;
    private readonly ITokenService _tokenService;

    public AuthController(IUsuarioRepository usuarioRepository, ITokenService tokenService)
    {
        _usuarioRepository = usuarioRepository;
        _tokenService = tokenService;
    }

    [HttpPost("registrar")]
    public async Task<IActionResult> Registrar([FromBody] RegistrarUsuarioDto dto)
    {
        if (await _usuarioRepository.ExisteComEmailAsync(dto.Email))
            return BadRequest("E-mail ja cadastrado");

        var usuario = new Usuario
        {
            Nome = dto.Nome,
            Email = dto.Email,
            SenhaHash = BCrypt.Net.BCrypt.HashPassword(dto.Senha)
        };

        await _usuarioRepository.AdicionarAsync(usuario);

        return Ok("Usuario cadastrado com sucesso");
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        var usuario = await _usuarioRepository.ObterPorEmailAsync(dto.Email);

        if (usuario == null || !BCrypt.Net.BCrypt.Verify(dto.Senha, usuario.SenhaHash))
            return Unauthorized("email ou senha invalidos");

        var token = _tokenService.GerarToken(usuario);

        return Ok(new TokenResponseDto(token, DateTime.UtcNow.AddHours(8)));
    }
}