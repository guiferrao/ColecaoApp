using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ColecaoApp.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddCategoriaEIsSelecao : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Categoria",
                table: "Camisas",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "IsSelecao",
                table: "Camisas",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Categoria",
                table: "Camisas");

            migrationBuilder.DropColumn(
                name: "IsSelecao",
                table: "Camisas");
        }
    }
}
