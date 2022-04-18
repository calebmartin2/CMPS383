using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SP22.P05.Web.Features.Authorization;
using SP22.P05.Web.Features.Sales;

namespace SP22.P05.Web.Features.Products;

public class Product
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Blurb { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public enum StatusType
    {
        Active,
        Hidden,
        Inactive
    }
    public StatusType Status { get; set; }
    public virtual ICollection<SaleEventProduct> SaleEventProducts { get; set; } = new List<SaleEventProduct>();
    public virtual ICollection<ProductUser> UserInfos { get; set; } = new List<ProductUser>();
    public virtual PublisherInfo Publisher { get; set; } = null!;
    public int PublisherId { get; set; }
    public string FileName { get; set; } = string.Empty;
    public string IconName { get; set; } = string.Empty;
    public virtual ICollection<Picture> Pictures { get; set; } = new List<Picture>();

}

public class ProductConfiguration : IEntityTypeConfiguration<Product>
{
    public void Configure(EntityTypeBuilder<Product> builder)
    {
        builder.Property(x => x.Name)
            .IsRequired()
            .HasMaxLength(120);

        builder.Property(x => x.Description)
            .IsRequired();

        builder.Property(x => x.Blurb)
            .IsRequired();

        builder.Property(x => x.PublisherId)
            .HasDefaultValue(1);

    }
}