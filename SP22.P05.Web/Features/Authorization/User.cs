using Microsoft.AspNetCore.Identity;

namespace SP22.P05.Web.Features.Authorization;

public class User : IdentityUser<int>
{
    public virtual ICollection<UserRole> Roles { get; set; } = new List<UserRole>();
}