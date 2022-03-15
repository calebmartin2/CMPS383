using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SP22.P05.Web.Data;
using SP22.P05.Web.Extensions;
using SP22.P05.Web.Features.Authorization;
using SP22.P05.Web.Features.Products;

namespace SP22.P05.Web.Controllers
{
    [Route("api/publisher")]
    [Authorize(Roles = RoleNames.Publisher)]
    [ApiController]
    public class PublisherController : Controller { 
        private readonly DataContext dataContext;
        private readonly UserManager<User> userManager;


        public PublisherController(UserManager<User> userManager, DataContext dataContext)
        {
            this.userManager = userManager;

            this.dataContext = dataContext;
        }


        [HttpGet("products")]
        public ProductDto[] GetPublisherProducts()
        {
            var products = dataContext.Set<Product>();
            var publisherId = User.GetCurrentUserId();

            return GetProductDtos(products.Where(x => x.PublisherId == publisherId)).ToArray();
        }

        // Not the best idea, copy and pasted from ProductsController.
        private static IQueryable<ProductDto> GetProductDtos(IQueryable<Product> products)
        {
            var now = DateTimeOffset.UtcNow;
            return products
                .Select(x => new
                {
                    Product = x,
                    CurrentSale = x.SaleEventProducts.FirstOrDefault(y => y.SaleEvent!.StartUtc <= now && now <= y.SaleEvent.EndUtc)
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
                    Status = (int)x.Product.Status

                });
        }
    }
}
