using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SP22.P05.Web.Features.Products;

namespace SP22.P05.Web.Features.Authorization;

public class ProductOwnership
{
    public virtual User? User { get; set; }
    public int UserId { get; set; }
    public virtual Product? Product { get; set; }
    public int ProductId { get; set; }

}

public class ProductOwnershipConfiguration : IEntityTypeConfiguration<ProductOwnership>
{
    public void Configure(EntityTypeBuilder<ProductOwnership> builder)
    {
    }
}