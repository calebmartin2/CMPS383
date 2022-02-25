using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SP22.P03.Web.Migrations
{
    public partial class FixFKIssues : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Product_PublisherInfo_PublisherId",
                table: "Product");

            migrationBuilder.DropForeignKey(
                name: "FK_ProductUserInfo_UserInfo_UserId",
                table: "ProductUserInfo");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UserInfo",
                table: "UserInfo");

            migrationBuilder.DropIndex(
                name: "IX_UserInfo_UserId",
                table: "UserInfo");

            migrationBuilder.DropPrimaryKey(
                name: "PK_PublisherInfo",
                table: "PublisherInfo");

            migrationBuilder.DropIndex(
                name: "IX_PublisherInfo_UserId",
                table: "PublisherInfo");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "UserInfo");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "PublisherInfo");

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserInfo",
                table: "UserInfo",
                column: "UserId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_PublisherInfo",
                table: "PublisherInfo",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Product_PublisherInfo_PublisherId",
                table: "Product",
                column: "PublisherId",
                principalTable: "PublisherInfo",
                principalColumn: "UserId",
                onDelete: ReferentialAction.NoAction);

            migrationBuilder.AddForeignKey(
                name: "FK_ProductUserInfo_UserInfo_UserId",
                table: "ProductUserInfo",
                column: "UserId",
                principalTable: "UserInfo",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Product_PublisherInfo_PublisherId",
                table: "Product");

            migrationBuilder.DropForeignKey(
                name: "FK_ProductUserInfo_UserInfo_UserId",
                table: "ProductUserInfo");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UserInfo",
                table: "UserInfo");

            migrationBuilder.DropPrimaryKey(
                name: "PK_PublisherInfo",
                table: "PublisherInfo");

            migrationBuilder.AddColumn<int>(
                name: "Id",
                table: "UserInfo",
                type: "int",
                nullable: false,
                defaultValue: 0)
                .Annotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AddColumn<int>(
                name: "Id",
                table: "PublisherInfo",
                type: "int",
                nullable: false,
                defaultValue: 0)
                .Annotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserInfo",
                table: "UserInfo",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_PublisherInfo",
                table: "PublisherInfo",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_UserInfo_UserId",
                table: "UserInfo",
                column: "UserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PublisherInfo_UserId",
                table: "PublisherInfo",
                column: "UserId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Product_PublisherInfo_PublisherId",
                table: "Product",
                column: "PublisherId",
                principalTable: "PublisherInfo",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ProductUserInfo_UserInfo_UserId",
                table: "ProductUserInfo",
                column: "UserId",
                principalTable: "UserInfo",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
