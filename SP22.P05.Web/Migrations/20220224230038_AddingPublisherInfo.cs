using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SP22.P03.Web.Migrations
{
    public partial class AddingPublisherInfo : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "PublisherId",
                table: "Product",
                type: "int",
                nullable: false,
                defaultValue: 1);

            migrationBuilder.CreateIndex(
                name: "IX_Product_PublisherId",
                table: "Product",
                column: "PublisherId");

        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {

            migrationBuilder.DropIndex(
                name: "IX_Product_PublisherId",
                table: "Product");

            migrationBuilder.DropColumn(
                name: "PublisherId",
                table: "Product");
        }
    }
}
