using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SP22.P03.Web.Migrations
{
    public partial class changingisactivetostatus : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "Product");

            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "Product",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Status",
                table: "Product");

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "Product",
                type: "bit",
                nullable: false,
                defaultValue: true);
        }
    }
}
