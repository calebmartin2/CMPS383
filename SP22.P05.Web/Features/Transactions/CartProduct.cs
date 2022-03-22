using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SP22.P05.Web.Features.Authorization;
using SP22.P05.Web.Features.Products;
using SP22.P05.Web.Features.Transactions;

namespace SP22.P05.Web.Features.Transactions
{
    public class CartProduct
    {
        public virtual Product? Product { get; set; }
        public int ProductId { get; set; }
        public virtual User? User { get; set; }
        public int UserId { get; set; }
    }
}

public class CartConfiguration : IEntityTypeConfiguration<CartProduct>
{
    public void Configure(EntityTypeBuilder<CartProduct> builder)
    {
        builder.HasKey(x => new { x.UserId, x.ProductId });
    }
}