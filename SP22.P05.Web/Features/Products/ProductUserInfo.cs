using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SP22.P05.Web.Features.Products;

namespace SP22.P05.Web.Features.Authorization;

public class ProductUserInfo
{
    public int Id { get; set; }
    public virtual UserInfo? User { get; set; }
    public int UserId { get; set; }
    public virtual Product? Product { get; set; }
    public int ProductId { get; set; }

}

public class ProductUserConfiguration : IEntityTypeConfiguration<ProductUserInfo>
{
    public void Configure(EntityTypeBuilder<ProductUserInfo> builder)
    {
        //builder.HasKey(x => new { x.Id, x.ProductId });

        //builder
        //    .HasOne(x => x.Product)
        //    .WithMany(x => x.Users)
        //    .HasForeignKey(x => x.ProductId);

        //builder
        //    .HasOne(x => x.User)
        //    .WithMany(x => x.Products)
        //    .HasForeignKey(x => x.UserId);
    }
}