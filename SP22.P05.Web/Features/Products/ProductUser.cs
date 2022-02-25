using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SP22.P05.Web.Features.Products;

namespace SP22.P05.Web.Features.Authorization;

public class ProductUser
{
    public int Id { get; set; }
    public virtual User? User { get; set; }
    public int UserId { get; set; }
    public virtual Product? Product { get; set; }
    public int ProductId { get; set; }

}

public class ProductUserConfiguration : IEntityTypeConfiguration<ProductUser>
{
    public void Configure(EntityTypeBuilder<ProductUser> builder)
    {
        builder.HasKey(x => new { x.UserId, x.ProductId });

        builder
            .HasOne(x => x.Product)
            .WithMany(x => x.Users)
            .HasForeignKey(x => x.ProductId);

        builder
            .HasOne(x => x.User)
            .WithMany(x => x.Products)
            .HasForeignKey(x => x.UserId);
    }
}