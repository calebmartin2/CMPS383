using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SP22.P03.Web.Migrations
{
    public partial class AdddingPublisherProducts : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "PublisherId",
                table: "Product",
                type: "int",
                defaultValue: 1);

            migrationBuilder.CreateIndex(
                name: "IX_Product_PublisherId",
                table: "Product",
                column: "PublisherId");

            migrationBuilder.AddForeignKey(
                name: "FK_Product_AspNetUsers_PublisherId",
                table: "Product",
                column: "PublisherId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.NoAction);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Product_AspNetUsers_PublisherId",
                table: "Product");

            migrationBuilder.DropIndex(
                name: "IX_Product_PublisherId",
                table: "Product");

            migrationBuilder.DropColumn(
                name: "PublisherId",
                table: "Product");
        }
    }
}
