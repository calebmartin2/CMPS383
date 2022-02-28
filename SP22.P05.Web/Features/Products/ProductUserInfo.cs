using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SP22.P05.Web.Features.Products;

namespace SP22.P05.Web.Features.Authorization;

public class ProductUserInfo
{
    public virtual UserInfo? UserInfos { get; set; }
    public int UserId { get; set; }
    public virtual Product? Product { get; set; }
    public int ProductId { get; set; }

}

public class ProductUserConfiguration : IEntityTypeConfiguration<ProductUserInfo>
{
    public void Configure(EntityTypeBuilder<ProductUserInfo> builder)
    {
        builder.HasKey(x => new { x.UserId, x.ProductId });

        builder
            .HasOne(x => x.Product)
            .WithMany(x => x.UserInfos)
            .HasForeignKey(x => x.ProductId);

        builder
            .HasOne(x => x.UserInfos)
            .WithMany(x => x.Products)
            .HasForeignKey(x => x.UserId);
    }
}