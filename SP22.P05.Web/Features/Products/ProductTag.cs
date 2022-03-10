using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SP22.P05.Web.Features.Products;

namespace SP22.P05.Web.Features.Products
{
    public class ProductTag
    {
        public virtual Product? Product { get; set; }
        public int ProductId { get; set; }
        public virtual Tag? Tag { get; set; }
        public int TagId { get; set; }
    }
}

public class ProductTagConfiguration : IEntityTypeConfiguration<ProductTag>
{
    public void Configure(EntityTypeBuilder<ProductTag> builder)
    {
        builder.HasKey(x => new { x.ProductId, x.TagId});

        builder
            .HasOne(x => x.Product)
            .WithMany(x => x.Tags)
            .HasForeignKey(x => x.ProductId);

        builder
            .HasOne(x => x.Tag)
            .WithMany(x => x.Products)
            .HasForeignKey(x => x.TagId);
    }
}