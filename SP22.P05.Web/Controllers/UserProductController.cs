using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SP22.P05.Web.Data;
using SP22.P05.Web.Extensions;
using SP22.P05.Web.Features.Authorization;
using SP22.P05.Web.Features.Products;
using SP22.P05.Web.Features.Transactions;

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

    [HttpPost("add-to-account"), Authorize(Roles = RoleNames.User)]
    public ActionResult AddToAccount(int[] productId)
    {
        var products = dataContext.Set<Product>();
        var totalAmount = products.Where(x => productId.Contains(x.Id)).Sum(x => x.Price);

        int? userId = User.GetCurrentUserId();
        if (userId == null)
        {
            return BadRequest("User invalid, doesn't exist?");
        }
        ICollection<ProductUser> addList = new List<ProductUser>() { };
        Order order = new Order()
        {
            UserId = (int)userId,
            Amount = totalAmount,
            Date = DateTimeOffset.Now,
        };
        foreach (int id in productId)
        {
            var product = products.FirstOrDefault(x => x.Id == id);
            if (product == null)
            {
                return BadRequest();
            }
            addList.Add(new ProductUser
            {
                UserId = (int)userId,
                ProductId = id,
                Order = order,
                Price = product.Price //doesn't account for sales, would be done here
            });
        }

        try
        {
            var cartItems = dataContext.Set<CartProduct>().Where(x => x.UserId == userId);
            dataContext.RemoveRange(cartItems);
            dataContext.AddRange(addList);
            dataContext.Add(order);
            dataContext.SaveChanges();
            return Ok();

        }
        catch
        {
            return BadRequest();
        }
    }

    [HttpPost("sync-cart"), Authorize(Roles = RoleNames.User)]
    public ActionResult<int[]> SyncCart(int[] cart)
    {
 
        int? userId = User.GetCurrentUserId();
        if (userId == null)
        {
            return BadRequest();
        }

        var products = dataContext.Set<Product>().Where(x => x.Status == Product.StatusType.Active); // filter products that exist
        var userCart = dataContext.Set<CartProduct>().Where(x => x.UserId == userId);
        var userLibrary = dataContext.Set<ProductUser>().Where(x => x.UserId == userId);
        var cartToAdd = new List<int>();

        //don't know a better way, just set everything to remove
        dataContext.RemoveRange(userCart);

        foreach (int id in cart)
        {
            if (!products.Any(x => x.Id == id) || userLibrary.Any(x => x.ProductId == id))
            {
                continue;
            }
            dataContext.Add(new CartProduct()
            {
                UserId = (int)userId,
                ProductId = id,
            });
        }

        dataContext.SaveChanges();

        foreach(var item in userCart)
        {
            cartToAdd.Add(item.ProductId);
        }

        return Ok(cartToAdd);

    }

    [HttpGet("get-cart"), Authorize(Roles = RoleNames.User)]
    public ActionResult<int[]> GetCart()
    {
        int? userId = User.GetCurrentUserId();
        if (userId == null)
        {
            return BadRequest();
        }
        var userCart = dataContext.Set<CartProduct>().Where(x => x.UserId == userId);
        var retVal = new List<int>();
        foreach (var item in userCart)
        {
            retVal.Add(item.ProductId);
        }
        return Ok(retVal);
    }

}

