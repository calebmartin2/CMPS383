using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System.ComponentModel.DataAnnotations;

namespace SP22.P05.Web.Features.Authorization;

public class UserInfo
{
    public int Id { get; set; }
    public User? User { get; set; }
    public int UserId { get; set; }
    [MaxLength(120)]
    public string FirstName { get; set; } = string.Empty;
    [MaxLength(120)]
    public string LastName { get; set; } = string.Empty;
    public virtual ICollection<ProductUserInfo> Products { get; set; } = new List<ProductUserInfo>();

}

public class UserInfoConfiguration : IEntityTypeConfiguration<UserInfo>
{
    public void Configure(EntityTypeBuilder<UserInfo> builder)
    {

        builder
            .HasOne(x => x.User)
            .WithOne(x => x.UserInfo)
            .HasForeignKey<UserInfo>(x => x.UserId);

    }
}