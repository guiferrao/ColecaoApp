using FluentValidation;
using ColecaoApp.Application.DTOs;
using ColecaoApp.Application.DTOs.Camisas;

namespace ColecaoApp.Application.Validators;

public class CriarCamisaDtoValidator : AbstractValidator<CriarCamisaDto>
{
    public CriarCamisaDtoValidator()
    {
        RuleFor(x => x.NomeTime)
            .NotEmpty().WithMessage("O nome do time/seleção é obrigatório.")
            .MaximumLength(100).WithMessage("O nome do time não pode exceder 100 caracteres");

        RuleFor(x => x.Marca)
            .NotEmpty().WithMessage("A marca é obrigatória")
            .MaximumLength(50).WithMessage("O fabricante não pode exceder 50 caracteres");

        RuleFor(x => x.Temporada)
            .NotEmpty().WithMessage("A temporada é obrigatória")
            .Matches(@"^(\d{2}/\d{2}|\d{4}/\d{4}|\d{4})$")
            .WithMessage("A temporada deve estar no formato '26/27', '2026/2027' ou '2026'");

        RuleFor(x => x.Tamanho)
            .NotEmpty().WithMessage("O tamanho da camisa é obrigatório");

        RuleFor(x => x.Tipo)
            .NotEmpty().WithMessage("O tipo da camisa é inválido");

        RuleFor(x => x.Versao)
            .NotEmpty().WithMessage("A versão da camisaa informada é inválida");

        When(x => x.Numero.HasValue, () =>
        {
            RuleFor(x => x.Numero)
                .InclusiveBetween(1, 99)
                .WithMessage("O número da camisa deve estar entre 1 e 99");
        });

        When(x => !string.IsNullOrWhiteSpace(x.NomeJogador), () =>
        {
            RuleFor(x => x.NomeJogador)
                .MaximumLength(100)
                .WithMessage("O nome do jogador não pode exceder 100 caracteres.");
        });

        When(x => !string.IsNullOrWhiteSpace(x.FotoUrl), () =>
        {
            RuleFor(x => x.FotoUrl)
                .Must(uri => Uri.TryCreate(uri, UriKind.Absolute, out _))
                .WithMessage("A URL da foto deve ser um endereço de URL válido.");
        });
    }
}