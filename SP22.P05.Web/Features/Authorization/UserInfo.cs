using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System.ComponentModel.DataAnnotations;

namespace SP22.P05.Web.Features.Authorization;

public class UserInfo
{
    public User User { get; set; } = null!;
    public int UserId { get; set; }
    [MaxLength(120)]
    public string FirstName { get; set; } = string.Empty;
    [MaxLength(120)]
    public string LastName { get; set; } = string.Empty;

}

public class UserInfoConfiguration : IEntityTypeConfiguration<UserInfo>
{
    public void Configure(EntityTypeBuilder<UserInfo> builder)
    {
        builder.HasKey(x => x.UserId);
        builder
            .HasOne(x => x.User)
            .WithOne(x => x.UserInfo)
            .HasForeignKey<UserInfo>(x => x.UserId);

    }
}