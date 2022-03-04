using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SP22.P05.Web.Features.Products;
using System.ComponentModel.DataAnnotations;

namespace SP22.P05.Web.Features.Products
{
    public class Tag
    {
        public int Id { get; set; }

        [Required, MaxLength(120)]
        public string Name { get; set; } = string.Empty;
        public virtual ICollection<ProductTag> Products { get; set; } = new List<ProductTag>();
    }
}
public class TagConfiguration : IEntityTypeConfiguration<Tag>
{
    public void Configure(EntityTypeBuilder<Tag> builder)
    {

    }
}