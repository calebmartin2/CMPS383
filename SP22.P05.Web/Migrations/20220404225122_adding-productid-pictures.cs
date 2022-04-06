using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SP22.P03.Web.Migrations
{
    public partial class addingproductidpictures : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Picture_Product_ProductId",
                table: "Picture");

            migrationBuilder.AlterColumn<int>(
                name: "ProductId",
                table: "Picture",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Picture_Product_ProductId",
                table: "Picture",
                column: "ProductId",
                principalTable: "Product",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Picture_Product_ProductId",
                table: "Picture");

            migrationBuilder.AlterColumn<int>(
                name: "ProductId",
                table: "Picture",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_Picture_Product_ProductId",
                table: "Picture",
                column: "ProductId",
                principalTable: "Product",
                principalColumn: "Id");
        }
    }
}
