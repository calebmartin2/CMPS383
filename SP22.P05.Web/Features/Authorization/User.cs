using Microsoft.AspNetCore.Identity;
using SP22.P05.Web.Features.Products;

namespace SP22.P05.Web.Features.Authorization;

public class User : IdentityUser<int>
{
    public virtual ICollection<UserRole> Roles { get; set; } = new List<UserRole>();
    public virtual PublisherInfo? PublisherInfo { get; set; }
    public virtual UserInfo? UserInfo { get; set; }
    public virtual ICollection<ProductUser> Products { get; set; } = new List<ProductUser>();

}
