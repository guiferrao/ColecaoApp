using System.Security.Claims;
using ColecaoApp.Application.DTOs.Camisas;
using ColecaoApp.Application.Interfaces;
using ColecaoApp.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ColecaoApp.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class CamisaController : ControllerBase
{
    private readonly ICamisaRepository _camisaRepository;

    public CamisaController(ICamisaRepository camisaRepository)
    {
        _camisaRepository = camisaRepository;
    }

    private int ObterUsuarioIdDoToken()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return int.Parse(claim!);
    }

    [HttpGet]
    public async Task<IActionResult> ListarMinhasCamisas()
    {
        var usuarioId = ObterUsuarioIdDoToken();
        var camisas = await _camisaRepository.ObterPorUsuarioIdAsync(usuarioId);

        var response = camisas.Select(c => new CamisaResponseDto(
            c.Id,
            c.NomeTime,
            c.Marca,
            c.Temporada,
            c.Tamanho,
            c.Tipo,
            c.Versao,
            c.Numero,
            c.NomeJogador,
            c.IsAutografada,
            c.FotoUrl,
            c.UsuarioId
        ));

        return Ok(response);
    }

    [HttpPost]
    public async Task<IActionResult> Criar([FromBody] CriarCamisaDto dto)
    {
        var usuarioId = ObterUsuarioIdDoToken();

        var camisa = new Camisa
        {
            NomeTime = dto.NomeTime,
            Marca = dto.Marca,
            Temporada = dto.Temporada,
            Tamanho = dto.Tamanho,
            Tipo = dto.Tipo,
            Versao = dto.Versao,
            Numero = dto.Numero,
            NomeJogador = dto.NomeJogador,
            IsAutografada = dto.IsAutografada,
            FotoUrl = dto.FotoUrl,
            UsuarioId = usuarioId
        };

        await _camisaRepository.AdicionarAsync(camisa);

        return CreatedAtAction(nameof(ListarMinhasCamisas), new { id = camisa.Id }, camisa.Id);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Atualizar(int id, [FromBody] CriarCamisaDto dto)
    {
        var usuarioId = ObterUsuarioIdDoToken();
        var camisaExistente = await _camisaRepository.ObterPorIdAsync(id);

        if (camisaExistente == null || camisaExistente.UsuarioId != usuarioId)
            return NotFound("Camisa não encontrada.");

        camisaExistente.NomeTime = dto.NomeTime;
        camisaExistente.Marca = dto.Marca;
        camisaExistente.Temporada = dto.Temporada;
        camisaExistente.Tamanho = dto.Tamanho;
        camisaExistente.Tipo = dto.Tipo;
        camisaExistente.Versao = dto.Versao;
        camisaExistente.Numero = dto.Numero;
        camisaExistente.NomeJogador = dto.NomeJogador;
        camisaExistente.IsAutografada = dto.IsAutografada;
        camisaExistente.FotoUrl = dto.FotoUrl;

        await _camisaRepository.AtualizarAsync(camisaExistente);

        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Deletar(int id)
    {
        var usuarioId = ObterUsuarioIdDoToken();
        var camisaExistente = await _camisaRepository.ObterPorIdAsync(id);

        if (camisaExistente == null || camisaExistente.UsuarioId != usuarioId)
            return NotFound("Camisa não encontrada.");

        await _camisaRepository.DeletarAsync(id);

        return NoContent();
    }
}