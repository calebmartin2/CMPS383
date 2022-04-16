using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SP22.P05.Web.Features.Products;
using SP22.P05.Web.Features.Transactions;

namespace SP22.P05.Web.Features.Authorization;

public class ProductUser
{
    public virtual User User { get; set; } = null!;
    public int UserId { get; set; }
    public virtual Product Product { get; set; } = null!;
    public int ProductId { get; set; }
    public virtual Order? Order { get; set; }
    public decimal Price { get; set; }

}

public class ProductUserConfiguration : IEntityTypeConfiguration<ProductUser>
{
    public void Configure(EntityTypeBuilder<ProductUser> builder)
    {
        builder.HasKey(x => new { x.UserId, x.ProductId });

        builder
            .HasOne(x => x.Product)
            .WithMany(x => x.UserInfos)
            .HasForeignKey(x => x.ProductId);

        builder
            .HasOne(x => x.User)
            .WithMany(x => x.Products)
            .HasForeignKey(x => x.UserId);
    }
}