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
    public ActionResult AddToAccount(int productId)
    {
        int? userId = User.GetCurrentUserId();
        if (userId == null)
        {
            return BadRequest("User invalid, doesn't exist?");
        }
        var addItem = new ProductUser()
        {
            ProductId = productId,
            UserId = (int)userId
        };
        dataContext.Add(addItem);
        dataContext.SaveChanges();
        return Ok();
    }
    [HttpGet("library")]
    [Authorize(Roles = RoleNames.User)]
    public ActionResult GetLibrary()
    {
        int? userId = User.GetCurrentUserId();
        var products = dataContext.Set<ProductUser>().Where(x => x.UserId == userId);
        var test = products.Select(x => new ProductDto[]
        {
            
        });
        return Ok(products);

    }


    private static IQueryable<ProductDto> GetProductDtos(IQueryable<Product> products)
    {
        var now = DateTimeOffset.UtcNow;
        return products
            .Select(x => new
            {
                Product = x,
                CurrentSale = x.SaleEventProducts.FirstOrDefault(y => y.SaleEvent!.StartUtc <= now && now <= y.SaleEvent.EndUtc),
            })
            .Select(x => new ProductDto
            {
                Id = x.Product.Id,
                Name = x.Product.Name,
                Description = x.Product.Description,
                Price = x.Product.Price,
                SalePrice = x.CurrentSale == null ? null : x.CurrentSale.SaleEventPrice,
                SaleEndUtc = x.CurrentSale == null ? null : x.CurrentSale.SaleEvent!.EndUtc,
                PublisherName = x.Product.Publisher == null ? null : x.Product.Publisher.CompanyName,
                Tags = x.Product.Tags.Select(x => x.Tag.Name).ToArray(),
                Status = (int)x.Product.Status

            });
    }

}

