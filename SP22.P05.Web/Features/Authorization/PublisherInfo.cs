using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System.ComponentModel.DataAnnotations;

namespace SP22.P05.Web.Features.Authorization;

public class PublisherInfo
{
    public User User { get; set; } = null!;
    public int UserId { get; set; }
    [MaxLength(120)]
    [Required]
    public string CompanyName { get; set; } = string.Empty;
}
public class PublisherInfoConfiguration : IEntityTypeConfiguration<PublisherInfo>
{
    public void Configure(EntityTypeBuilder<PublisherInfo> builder)
    {

        builder.HasKey(x => x.UserId);

        builder
            .HasOne(x => x.User)
            .WithOne(x => x.PublisherInfo)
            .HasForeignKey<PublisherInfo>(x => x.UserId);

    }
}