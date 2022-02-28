using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SP22.P03.Web.Migrations
{
    public partial class FixingProductUserInfo : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserInfo_Product_ProductId",
                table: "UserInfo");

            migrationBuilder.DropIndex(
                name: "IX_UserInfo_ProductId",
                table: "UserInfo");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ProductUserInfo",
                table: "ProductUserInfo");

            migrationBuilder.DropIndex(
                name: "IX_ProductUserInfo_UserId",
                table: "ProductUserInfo");

            migrationBuilder.DropColumn(
                name: "ProductId",
                table: "UserInfo");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "ProductUserInfo");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ProductUserInfo",
                table: "ProductUserInfo",
                columns: new[] { "UserId", "ProductId" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_ProductUserInfo",
                table: "ProductUserInfo");

            migrationBuilder.AddColumn<int>(
                name: "ProductId",
                table: "UserInfo",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Id",
                table: "ProductUserInfo",
                type: "int",
                nullable: false,
                defaultValue: 0)
                .Annotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ProductUserInfo",
                table: "ProductUserInfo",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_UserInfo_ProductId",
                table: "UserInfo",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductUserInfo_UserId",
                table: "ProductUserInfo",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_UserInfo_Product_ProductId",
                table: "UserInfo",
                column: "ProductId",
                principalTable: "Product",
                principalColumn: "Id");
        }
    }
}
