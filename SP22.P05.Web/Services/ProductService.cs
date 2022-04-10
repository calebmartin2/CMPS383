using SP22.P05.Web.Features.Products;

namespace SP22.P05.Web.Services
{
    public interface IProductService
    {
        IQueryable<ProductDto> GetProductDtos(IQueryable<Product> products);
    }

    public class ProductService : IProductService
    {

        public IQueryable<ProductDto> GetProductDtos(IQueryable<Product> products)
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
                    Blurb = x.Product.Blurb,
                    Price = x.Product.Price,
                    SalePrice = x.CurrentSale == null ? null : x.CurrentSale.SaleEventPrice,
                    SaleEndUtc = x.CurrentSale == null ? null : x.CurrentSale.SaleEvent!.EndUtc,
                    PublisherName = x.Product.Publisher == null ? null : x.Product.Publisher.CompanyName,
                    //Tags = x.Product.Tags.Select(x => x.Tag.Name).ToArray(),
                    Status = (int)x.Product.Status,
                    FileName = x.Product.FileName,
                    IconName = x.Product.IconName,
                    Pictures = x.Product.Pictures.Select(x => "/api/file/picture/" + x.ProductId + "/" + x.Name).ToArray(),

                });
        }
    }
}
