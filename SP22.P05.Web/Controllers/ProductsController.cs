using ImageMagick;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SP22.P05.Web.Data;
using SP22.P05.Web.Extensions;
using SP22.P05.Web.Features.Authorization;
using SP22.P05.Web.Features.Products;
using SP22.P05.Web.Features.Transactions;
using SP22.P05.Web.Services;

namespace SP22.P05.Web.Controllers;

[Route("api/products")]
[ApiController]
public class ProductsController : ControllerBase
{
    private readonly DataContext dataContext;
    private readonly IProductService productService;

    public ProductsController(DataContext dataContext,
                              IProductService productService)
    {
        this.dataContext = dataContext;
        this.productService = productService;
    }

    [HttpGet]
    public IEnumerable<ProductDto> GetAllProducts(string? query)
    {
        var products = dataContext.Set<Product>().Where(x => x.Status == Product.StatusType.Active);
        if (!String.IsNullOrEmpty(query)) {
            products = products.Where(x => x.Name!.Contains(query));
        }
        var retval = productService.GetProductDtos(products);
        // Get the users library, only if they are a user
        return retval;
    }

    [HttpGet("manage"), Authorize(Roles = RoleNames.Admin)]
    public IEnumerable<ProductDto> GetManageAllProducts()
    {
        var products = dataContext.Set<Product>();
        return productService.GetProductDtos(products);
    }

    [HttpGet, Route("{id}")]
    public ActionResult<ProductDto> GetProductById(int id)
    {
        int? userId = User.GetCurrentUserId();
        var products = dataContext.Set<Product>();
        var result = productService.GetProductDtos(products).FirstOrDefault(x => x.Id == id && (x.Status == (int)Product.StatusType.Active));
        if (result == null)
        {
            return NotFound();
        }
        var productUsers = dataContext.Set<ProductUser>();
        result.IsInLibrary = productUsers.FirstOrDefault(x => x.UserId == userId && x.ProductId == id) != null;
        return Ok(result);
    }

    [HttpPost("select")]
    public IEnumerable<ProductDto> GetAllProducts(int[] id)
    {
        var products = dataContext.Set<Product>().Where(x => id.Contains(x.Id));
        return productService.GetProductDtos(products);
    }

    [HttpGet, Route("sales")]
    public IEnumerable<ProductDto> GetProductsOnSale()
    {
        var products = dataContext.Set<Product>();
        return productService.GetProductDtos(products).Where(x => x.SalePrice != null);
    }

    [HttpPost, Authorize(Roles = RoleNames.Publisher)]
    public ActionResult<ProductDto> CreateProduct([FromForm] CreateProductDto productDto)
    {
        var publisherId = User.GetCurrentUserId();
        var publisherName = User.GetCurrentUserName();
        if (publisherId == null || productDto.file == null || productDto.icon == null || productDto.Pictures == null)
        {
            return BadRequest();
        }
        using (var image = new MagickImage(productDto.icon.OpenReadStream()))
        {
            if (image.Width != image.Height)
            {
                return BadRequest("Image not 1:1 aspect ratio");
            }
        }
        if (productDto.icon.Length > 102400)
        {
            return BadRequest("Icon file is too large. Max file size is 100KiB");
        }

        var newIconGuid = Guid.NewGuid().ToString() + Path.GetExtension(productDto.icon.FileName);
        var product = new Product
        {
            Name = productDto.Name,
            Description = productDto.Description,
            Blurb = productDto.Blurb,
            Price = productDto.Price,
            PublisherId = (int)publisherId,
            Status = Product.StatusType.Active,
            FileName = productDto.file.FileName,
            IconName = newIconGuid
        };

        dataContext.Add(product);
        dataContext.SaveChanges();
        productDto.Id = product.Id;
        List<Picture> pictureList = new List<Picture>();
        try
        {
            // Handle adding pictures
            foreach (var formFile in productDto.Pictures)
            {
                if (formFile.Length > 0)
                {
                    string myPath = Path.Combine(Directory.GetCurrentDirectory(), $"ProductFiles//{productDto.Id}//Pictures");
                    Directory.CreateDirectory(myPath);
                    var tempGuid = Guid.NewGuid().ToString();
                    pictureList.Add(new Picture { Name = tempGuid + Path.GetExtension(formFile.FileName), ProductId = productDto.Id });
                    var pictureFilePath = Path.Combine(myPath, tempGuid + Path.GetExtension(formFile.FileName));

                    using (var stream = System.IO.File.Create(pictureFilePath))
                    {
                        formFile.CopyTo(stream);
                    }
                }
            }
            dataContext.AddRange(pictureList);
            dataContext.SaveChanges();

            Directory.CreateDirectory(Path.Combine(Directory.GetCurrentDirectory(), $"ProductFiles//{productDto.Id}"));
            string filePath = Path.Combine(Directory.GetCurrentDirectory(), $"ProductFiles//{productDto.Id}", productDto.file.FileName);
            string iconPath = Path.Combine(Directory.GetCurrentDirectory(), $"ProductFiles//{productDto.Id}", newIconGuid);
            using (Stream stream = new FileStream(filePath, FileMode.Create))
            {
                productDto.file.CopyTo(stream);
            }
            using (Stream stream = new FileStream(iconPath, FileMode.Create))
            {
                productDto.icon.CopyTo(stream);
            }
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }

        return CreatedAtAction(nameof(GetProductById), new { id = product.Id }, productDto);
    }

    [HttpPut("{id}"), Authorize(Roles = RoleNames.AdminOrPublisher)]
    public ActionResult<ProductDto> UpdateProduct(int id, [FromForm] CreateProductDto productDto)
    {
        var products = dataContext.Set<Product>();
        var current = products.FirstOrDefault(x => x.Id == id);
        if (current == null)
        {
            return NotFound();
        }

        // Handle updating icon
        if (productDto.icon != null)
        {
            if (productDto.icon.Length > 102400)
            {
                return BadRequest("Icon file is too large. Max file size is 100KiB");
            }
            var newIconGuid = Guid.NewGuid().ToString() + Path.GetExtension(productDto.icon.FileName);

            // Delete existing file
            if (current.IconName != null)
            {
                string delPath = Path.Combine(Directory.GetCurrentDirectory(), $"ProductFiles//{id}", current.IconName);
                FileInfo delFile = new FileInfo(delPath);
                if (delFile.Exists)
                {
                    delFile.Delete();
                }
            }
            // Add new icon file
            Directory.CreateDirectory(Path.Combine(Directory.GetCurrentDirectory(), $"ProductFiles//{id}"));
            string iconPath = Path.Combine(Directory.GetCurrentDirectory(), $"ProductFiles//{id}", newIconGuid);
            using (Stream stream = new FileStream(iconPath, FileMode.Create))
            {
                productDto.icon.CopyTo(stream);
            }
            current.IconName = newIconGuid;
        }

        // Handle updating pictures
        List<Picture> pictureList = new List<Picture>();
        if (productDto.Pictures != null)
        {
            string path = Path.Combine(Directory.GetCurrentDirectory(), $"ProductFiles//{id}//Pictures");
            DirectoryInfo di = new DirectoryInfo(path);
            if (di.Exists)
            {
                foreach (FileInfo file in di.GetFiles())
                {
                    file.Delete();
                }
                foreach (DirectoryInfo dir in di.GetDirectories())
                {
                    dir.Delete(true);
                }
            }
            var removePictures = dataContext.Set<Picture>().Where(x => x.ProductId == current.Id);
            dataContext.RemoveRange(removePictures);
            foreach (var formFile in productDto.Pictures)
            {
                if (formFile.Length > 0)
                {
                    string myPath = Path.Combine(Directory.GetCurrentDirectory(), $"ProductFiles//{current.Id}//Pictures");
                    Directory.CreateDirectory(myPath);
                    var newGuid = Guid.NewGuid();
                    pictureList.Add(new Picture { Name = newGuid + Path.GetExtension(formFile.FileName), ProductId = current.Id });
                    var pictureFilePath = Path.Combine(myPath, newGuid + Path.GetExtension(formFile.FileName));
                    using (var stream = System.IO.File.Create(pictureFilePath))
                    {
                        formFile.CopyTo(stream);
                    }
                }
            }
            dataContext.AddRange(pictureList);
        }

        current.Name = productDto.Name;
        current.Price = productDto.Price;
        current.Description = productDto.Description;
        current.Blurb = productDto.Blurb;
        dataContext.SaveChanges();

        return Ok(productDto);
    }

    [HttpDelete("{id}"), Authorize(Roles = RoleNames.Admin)]
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


    [HttpPut("change-status/{id}/{status}"), Authorize(Roles = RoleNames.Admin)]
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



    [HttpGet("/api/publisher/products"), Authorize(Roles = RoleNames.Publisher)]
    public IEnumerable<ProductDto> GetPublisherProducts()
    {
        var products = dataContext.Set<Product>();
        var publisherId = User.GetCurrentUserId();

        return productService.GetProductDtos(products.Where(x => x.PublisherId == publisherId));
    }

    [HttpGet("library"), Authorize(Roles = RoleNames.User)]
    public ActionResult<ProductDto> GetLibrary(string? query)
    {
        int? userId = User.GetCurrentUserId();
        if (userId == null)
        {
            return BadRequest();
        }
        var products = dataContext.Set<ProductUser>()
            .Where(x => x.UserId == userId)
            .Where(x => !(x.Product.Status == Product.StatusType.Inactive))
            .Select(x => x.Product);
        if (products == null)
        {
            return NotFound();
        }
        if (!String.IsNullOrEmpty(query))
        {
            products = products.Where(x => x.Name!.Contains(query));
        }
        return Ok(productService.GetProductDtos(products));

    }

}