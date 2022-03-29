using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SP22.P05.Web.Data;
using SP22.P05.Web.Extensions;
using SP22.P05.Web.Features.Authorization;
using SP22.P05.Web.Features.Files;
using SP22.P05.Web.Features.Products;
using SP22.P05.Web.Features.Transactions;

namespace SP22.P05.Web.Controllers;

[Route("api/products")]
[ApiController]
public class ProductsController : ControllerBase
{
    private readonly DataContext dataContext;

    public ProductsController(DataContext dataContext)
    {
        this.dataContext = dataContext;
    }

    [HttpGet]
    public ProductDto[] GetAllProducts()
    {
        var products = dataContext.Set<Product>().Where(x => x.Status == Product.StatusType.Active);
        return GetProductDtos(products).ToArray();
    }

    [HttpGet("manage")]
    [Authorize(Roles = RoleNames.Admin)]
    public ProductDto[] GetManageAllProducts()
    {
        var products = dataContext.Set<Product>();
        return GetProductDtos(products).ToArray();
    }

    [HttpGet]
    [Route("{id}")]
    public ActionResult<ProductDto> GetProductById(int id)
    {
        int? userId = User.GetCurrentUserId();
        var products = dataContext.Set<Product>();
        var result = GetProductDtos(products).FirstOrDefault(x => x.Id == id && (x.Status == (int)Product.StatusType.Active));
        if (result == null)
        {
            return NotFound();
        }
        var productUsers = dataContext.Set<ProductUser>();
        result.IsInLibrary = productUsers.FirstOrDefault(x => x.UserId == userId && x.ProductId == id) != null;
        return Ok(result);
    }

    [HttpPost("select")]
    public ProductDto[] GetAllProducts(int[] id)
    {
        var products = dataContext.Set<Product>().Where(x => id.Contains(x.Id));
        return GetProductDtos(products).ToArray();
    }

    [HttpGet]
    [Route("sales")]
    public ProductDto[] GetProductsOnSale()
    {
        var products = dataContext.Set<Product>();
        return GetProductDtos(products).Where(x => x.SalePrice != null).ToArray();
    }

    [HttpPost]
    [Authorize(Roles = RoleNames.Publisher)]

    public ActionResult<ProductDto> CreateProduct([FromForm] CreateProductDto productDto, IFormFile file)
    {
        

        var publisherId = User.GetCurrentUserId();
        var publisherName = User.GetCurrentUserName();
        if (publisherId == null)
        {
            return BadRequest();
        }

        var product = new Product
        {
            Name = productDto.Name,
            Description = productDto.Description,
            Blurb = productDto.Blurb,
            Price = productDto.Price,
            PublisherId = (int)publisherId,
            Status = Product.StatusType.Active,
            FileName = file.FileName,
        };

        dataContext.Add(product);
        dataContext.SaveChanges();
        productDto.Id = product.Id;
        try
        {

            string path = Path.Combine(Directory.GetCurrentDirectory(), $"ProductFiles//{productDto.Id}", file.FileName);
            Directory.CreateDirectory(Path.Combine(Directory.GetCurrentDirectory(), $"ProductFiles//{productDto.Id}"));
            using (Stream stream = new FileStream(path, FileMode.Create))
            {
                file.CopyTo(stream);
            }
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }

        return CreatedAtAction(nameof(GetProductById), new { id = product.Id }, productDto);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = RoleNames.AdminOrPublisher)]
    public ActionResult<ProductDto> UpdateProduct(int id, ProductDto productDto)
    {
        var products = dataContext.Set<Product>();
        var current = products.FirstOrDefault(x => x.Id == id);
        if (current == null)
        {
            return NotFound();
        }

        current.Name = productDto.Name;
        current.Price = productDto.Price;
        current.Description = productDto.Description;
        current.Blurb = productDto.Blurb;
        dataContext.SaveChanges();

        return Ok(productDto);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = RoleNames.Admin)]
    public ActionResult<ProductDto> DeleteProduct(int id)
    {
        var products = dataContext.Set<Product>();
        var current = products.FirstOrDefault(x => x.Id == id);
        if (current == null)
        {
            return NotFound();
        }

        // delete directory associated with product, leaves blank folder but deletes all containing files
        //https://stackoverflow.com/questions/1288718/how-to-delete-all-files-and-folders-in-a-directory
        try
        {
            string path = Path.Combine(Directory.GetCurrentDirectory(), $"ProductFiles//{id}");
            DirectoryInfo di = new DirectoryInfo(path);

            foreach (FileInfo file in di.GetFiles())
            {
                file.Delete();
            }
            foreach (DirectoryInfo dir in di.GetDirectories())
            {
                dir.Delete(true);
            }
        }
        catch (Exception)
        {

        }
        

        products.Remove(current);
        dataContext.SaveChanges();

        return Ok();
    }


    [HttpPut("change-status/{id}/{status}")]
    [Authorize(Roles = RoleNames.Admin)]
    public ActionResult ChangeStatus(int id, int status)
    {
        var product = dataContext.Set<Product>().FirstOrDefault(x => x.Id == id);

        if (product == null)
        {
            return NotFound();
        }
        product.Status = (Product.StatusType)status;
        // if status not active, delete cart items
        if (status != (int)Product.StatusType.Active)
        {
            var allCart = dataContext.Set<CartProduct>().Where(x => x.ProductId == id);
            dataContext.RemoveRange(allCart);
        }
        dataContext.SaveChanges();
        // TODO: better return
        return Ok();
    }

    [HttpGet("get-tags")]
    public ActionResult<TagDto[]> GetTags()
    {
        var tags = dataContext.Set<Tag>();
        var returnDto = tags.Select(x => new
        {
            Tag = x,
        }).Select(x => new TagDto
        {
            Id = x.Tag.Id,
            Name = x.Tag.Name,

        });
        return Ok(returnDto.ToArray());
    }

    [HttpPost("add-tag")]
    [Authorize(Roles = RoleNames.Admin)]
    public ActionResult<TagDto> AddTag(TagDto tag)
    {
        var newTag = new Tag()
        {
            Name = tag.Name,
        };

        dataContext.Add(newTag);
        dataContext.SaveChanges();
        tag.Id = newTag.Id;
        return Ok(tag);
    }

    [HttpPost("add-product-to-tag")]
    [Authorize(Roles = RoleNames.AdminOrPublisher)]
    public ActionResult AddProductToTag(int productId, int tagId)
    {
        var products = dataContext.Set<Product>();
        var tags = dataContext.Set<Tag>();
        var currentTag = tags.FirstOrDefault(x => x.Id == tagId);
        var currentProduct = products.FirstOrDefault(x => x.Id == productId);

        if (currentProduct == null)
        {
            return BadRequest("Product does not exist");
        }
        if (currentTag == null)
        {
            return BadRequest("Tag does not exist");
        }
        var newProductTag = new ProductTag()
        {
            ProductId = productId,
            TagId = tagId

        };
        dataContext.Add(newProductTag);
        dataContext.SaveChanges();
        //TODO: Change return to the product
        return Ok();
    }

    [HttpGet("/api/publisher/products")]
    [Authorize(Roles = RoleNames.Publisher)]
    public ProductDto[] GetPublisherProducts()
    {
        var products = dataContext.Set<Product>();
        var publisherId = User.GetCurrentUserId();

        return GetProductDtos(products.Where(x => x.PublisherId == publisherId)).ToArray();
    }

    [HttpGet("library")]
    [Authorize(Roles = RoleNames.User)]
    public ActionResult<ProductDto> GetLibrary()
    {
        int? userId = User.GetCurrentUserId();
        if (userId == null)
        {
            return BadRequest();
        }
        var products = dataContext.Set<ProductUser>().Where(x => x.UserId == userId).Select(x => x.Product);
        if (products == null)
        {
            return NotFound();
        }
        return Ok(GetProductDtos(products));

    }

    //https://sankhadip.medium.com/how-to-upload-files-in-net-core-web-api-and-react-36a8fbf5c9e8
    [HttpPost("uploadfile")]
    public ActionResult UploadFile(IFormFile file, [FromForm] int productId)
    {
        // delete directory associated with product, leaves blank folder but deletes all containing files
        //https://stackoverflow.com/questions/1288718/how-to-delete-all-files-and-folders-in-a-directory
        try
        {
            string path = Path.Combine(Directory.GetCurrentDirectory(), $"ProductFiles//{productId}");
            DirectoryInfo di = new DirectoryInfo(path);

            foreach (FileInfo delFile in di.GetFiles())
            {
                delFile.Delete();
            }
            foreach (DirectoryInfo dir in di.GetDirectories())
            {
                dir.Delete(true);
            }
        }
        catch (Exception)
        {

        }


        try
        {
            string path = Path.Combine(Directory.GetCurrentDirectory(), $"ProductFiles//{productId}", file.FileName);
            Directory.CreateDirectory(Path.Combine(Directory.GetCurrentDirectory(), $"ProductFiles//{productId}"));
            using (Stream stream = new FileStream(path, FileMode.Create))
            {
                file.CopyTo(stream);
            }
            return Ok();
        } catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
    [HttpGet("download/{productId}/{fileName}")]
    public FileResult DownloadFile(int productId, string fileName)
    {
        //var fileName = dataContext.Set<Product>().First(x => x.Id == productId).FileName;
        //Build the File Path.
        string path = Path.Combine(Directory.GetCurrentDirectory(), $"ProductFiles//{productId}//", fileName);

        //Read the File data into Byte Array.
        byte[] bytes = System.IO.File.ReadAllBytes(path);

        //Send the File to Download.
        return File(bytes, "application/octet-stream", fileName);
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
                Blurb = x.Product.Blurb,
                Price = x.Product.Price,
                SalePrice = x.CurrentSale == null ? null : x.CurrentSale.SaleEventPrice,
                SaleEndUtc = x.CurrentSale == null ? null : x.CurrentSale.SaleEvent!.EndUtc,
                PublisherName = x.Product.Publisher == null ? null : x.Product.Publisher.CompanyName,
                Tags = x.Product.Tags.Select(x => x.Tag.Name).ToArray(),
                Status = (int)x.Product.Status,
                FileName = x.Product.FileName,

            });
    }


}