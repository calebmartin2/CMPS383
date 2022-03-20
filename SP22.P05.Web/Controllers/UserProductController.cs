using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SP22.P05.Web.Data;
using SP22.P05.Web.Extensions;
using SP22.P05.Web.Features.Authorization;
using SP22.P05.Web.Features.Products;

namespace SP22.P05.Web.Controllers;


[Route("api/user-products")]
[ApiController]


public class UserProductController : Controller
{
    private readonly DataContext dataContext;


    public UserProductController(DataContext dataContext, UserManager<User> userManager)
    {
        this.dataContext = dataContext;
    }
    [HttpPost("add-to-account")]
    [Authorize(Roles = RoleNames.User)]
    public ActionResult AddToAccount(int[] productId)
    {
        int? userId = User.GetCurrentUserId();
        if (userId == null)
        {
            return BadRequest("User invalid, doesn't exist?");
        }
        ICollection<ProductUser> addItem = new List<ProductUser>(){};
        foreach (int id in productId)
        {
            addItem.Add(new ProductUser
            {
                UserId = (int)userId,
                ProductId = id
            });
        }
        try
        {
            dataContext.AddRange(addItem);
            dataContext.SaveChanges();
            return Ok();

        }
        catch
        {
            return BadRequest();
        }
    }
   

}

