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
    public IEnumerable<ProductDto> GetAllProducts(string? query, string? sortOrder)
    {
        var products = dataContext.Set<Product>().Where(x => x.Status == Product.StatusType.Active);

        if (!String.IsNullOrEmpty(query))
            products = products.Where(x => x.Name!.Contains(query) || x.Publisher.CompanyName!.Contains(query));

        if (!String.IsNullOrEmpty(sortOrder))
            products = sortOrder switch
            {
                "most-popular" => products.OrderByDescending(x => x.UserInfos.Count()),
                "name" => products.OrderBy(x => x.Name),
                "highest-price" => products.OrderByDescending(x => x.Price),
                "lowest-price" => products.OrderBy(x => x.Price),
                "most-recent" => products.OrderByDescending(x => x.Id),
                _ => products.OrderByDescending(x => x.UserInfos.Count())
            };
        else
            products = products.OrderByDescending(x => x.UserInfos.Count());

        var retval = productService.GetProductDtos(products).ToList();

        if (User.IsInRole(RoleNames.User))
        {
            var userId = User.GetCurrentUserId();
            var productUser = dataContext.Set<ProductUser>().Where(x => x.UserId == userId);
            foreach (var product in retval)
            {
                product.IsInLibrary = productUser.Any(x => x.ProductId == product.Id);
            }
        }

        return retval;
    }

    [HttpGet("manage"), Authorize(Roles = RoleNames.Admin)]
    public IEnumerable<ProductDto> GetManageAllProducts(string? query)
    {
        var products = from p in dataContext.Set<Product>()
                       select p;

        if (!String.IsNullOrEmpty(query))
            products = products.Where(x => x.Name!.Contains(query) || x.Publisher.CompanyName!.Contains(query));
        
        products = products.OrderByDescending(x => x.Id);

        return productService.GetProductDtos(products);
    }

    [HttpGet, Route("{id}")]
    public ActionResult<ProductDto> GetProductById(int id)
    {
        int? userId = User.GetCurrentUserId();
        var products = dataContext.Set<Product>();
        if (User.IsInRole(RoleNames.Admin) || User.IsInRole(RoleNames.Publisher))
        {
            var result = productService.GetProductDtos(products).FirstOrDefault(x => x.Id == id);

            if (result == null)
                return NotFound();

            return Ok(result);
        }
        else
        {
            var result = productService.GetProductDtos(products).FirstOrDefault(x => x.Id == id && (x.Status == (int)Product.StatusType.Active));

            if (result == null)
                return NotFound();

            var productUsers = dataContext.Set<ProductUser>();
            result.IsInLibrary = productUsers.FirstOrDefault(x => x.UserId == userId && x.ProductId == id) != null;

            return Ok(result);
        }
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
            return BadRequest();

        if (productDto.icon.Length > 102400)
            return BadRequest("Icon file is too large. Max file size is 100KiB");

        using (var image = new MagickImage(productDto.icon.OpenReadStream()))
        {
            if (image.Width != image.Height)
                return BadRequest("Icon not 1:1 aspect ratio");
        }

        foreach (var picture in productDto.Pictures)
        {
            using (var image = new MagickImage(picture.OpenReadStream()))
            {
                var ratio = (double)image.Width / image.Height;

                if (picture.Length > 5242880)
                    return BadRequest("Picture " + picture.FileName + " too large. Max picture size is 5 MiB");

                if (ratio is < 1.7 or > 1.8)
                    return BadRequest("Picture " + picture.FileName + " not 16:9 aspect ratio");
            }
        }

        var newIconFileName = Guid.NewGuid() + ".png";
        var product = new Product
        {
            Name = productDto.Name,
            Description = productDto.Description,
            Blurb = productDto.Blurb,
            Price = productDto.Price,
            PublisherId = (int)publisherId,
            Status = Product.StatusType.Inactive,
            FileName = productDto.file.FileName,
            IconName = newIconFileName
        };

        dataContext.Add(product);
        dataContext.SaveChanges();
        productDto.Id = product.Id;

        var pictures = new List<Picture>();

        try
        {
            // Handle adding pictures
            foreach (var formFile in productDto.Pictures)
            {
                if (formFile.Length > 0)
                {
                    var myPath = Path.Combine(Directory.GetCurrentDirectory(), $"ProductFiles//{productDto.Id}//Pictures");
                    Directory.CreateDirectory(myPath);
                    var newPictureFileName = Guid.NewGuid() + ".jpg";
                    var pictureFilePath = Path.Combine(myPath, newPictureFileName);

                    pictures.Add(new Picture { Name = newPictureFileName, ProductId = productDto.Id });

                    using (var image = new MagickImage(formFile.OpenReadStream()))
                    {
                        image.Strip();
                        image.Write(pictureFilePath);
                    }
                }
            }

            dataContext.AddRange(pictures);
            dataContext.SaveChanges();

            var baseDirectory = $"ProductFiles//{productDto.Id}";
            Directory.CreateDirectory(Path.Combine(Directory.GetCurrentDirectory(), baseDirectory));
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), baseDirectory, productDto.file.FileName);

            //write file to file
            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                productDto.file.CopyTo(fileStream);
            }

            var iconPath = Path.Combine(Directory.GetCurrentDirectory(), baseDirectory, newIconFileName);

            //write icon to file
            using (var image = new MagickImage(productDto.icon.OpenReadStream()))
            {
                image.Strip();
                image.Resize(256, 256);
                image.Write(iconPath);
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
        var product = products.FirstOrDefault(x => x.Id == id);

        if (product == null)
            return NotFound();

        // Handle updating icon
        if (productDto.icon != null)
        {
            if (productDto.icon.Length > 102400)
                return BadRequest("Icon file is too large. Max file size is 100KiB");

            using (var image = new MagickImage(productDto.icon.OpenReadStream()))
            {
                if (image.Width != image.Height)
                    return BadRequest("Icon not 1:1 aspect ratio");
            }

            // Delete existing file
            var delPath = Path.Combine(Directory.GetCurrentDirectory(), $"ProductFiles//{id}", product.IconName);
            var delFile = new FileInfo(delPath);
            if (delFile.Exists)
                delFile.Delete();
            // Add new icon file
            Directory.CreateDirectory(Path.Combine(Directory.GetCurrentDirectory(), $"ProductFiles//{id}"));
            var newIconFileName = Guid.NewGuid().ToString() + ".png";
            var iconPath = Path.Combine(Directory.GetCurrentDirectory(), $"ProductFiles//{id}", newIconFileName);

            //write icon to file
            using (var image = new MagickImage(productDto.icon.OpenReadStream()))
            {
                image.Strip();
                image.Resize(256, 256);
                image.Write(iconPath);
            }
            product.IconName = newIconFileName;
        }

        //should be in a separate method
        if (productDto.Pictures != null)
        {
            foreach (var picture in productDto.Pictures)
            {
                using (var image = new MagickImage(picture.OpenReadStream()))
                {
                    var ratio = (double)image.Width / image.Height;

                    if (picture.Length > 5242880)
                        return BadRequest("Picture " + picture.FileName + " too large. Max picture size is 5 MiB");

                    if (ratio is < 1.7 or > 1.8)
                        return BadRequest("Picture " + picture.FileName + " not 16:9 aspect ratio");
                }
            }
        }

        // Handle updating pictures
        var pictureList = new List<Picture>();
        if (productDto.Pictures != null)
        {
            var path = Path.Combine(Directory.GetCurrentDirectory(), $"ProductFiles//{id}//Pictures");
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
            var removePictures = dataContext.Set<Picture>().Where(x => x.ProductId == product.Id);
            dataContext.RemoveRange(removePictures);
            foreach (var formFile in productDto.Pictures)
            {
                if (formFile.Length > 0)
                {
                    var myPath = Path.Combine(Directory.GetCurrentDirectory(), $"ProductFiles//{product.Id}//Pictures");
                    var newGuid = Guid.NewGuid();
                    var pictureFilePath = Path.Combine(myPath, newGuid.ToString());

                    Directory.CreateDirectory(myPath);
                    pictureList.Add(new Picture { Name = newGuid + ".jpg", ProductId = product.Id });

                    //write picture to file
                    using (var image = new MagickImage(formFile.OpenReadStream()))
                    {
                        image.Strip();
                        image.Write(pictureFilePath + ".jpg");
                    }
                }
            }
            dataContext.AddRange(pictureList);
        }

        product.Name = productDto.Name;
        product.Price = productDto.Price;
        product.Description = productDto.Description;
        product.Blurb = productDto.Blurb;
        dataContext.SaveChanges();

        return Ok(productDto);
    }

    [HttpDelete("{id}"), Authorize(Roles = RoleNames.Admin)]
    public ActionResult<ProductDto> DeleteProduct(int id)
    {
        var products = dataContext.Set<Product>();
        var current = products.FirstOrDefault(x => x.Id == id);

        if (current == null)
            return NotFound();

        // delete directory associated with product, leaves blank folder but deletes all containing files
        //https://stackoverflow.com/questions/1288718/how-to-delete-all-files-and-folders-in-a-directory
        try
        {
            string path = Path.Combine(Directory.GetCurrentDirectory(), $"ProductFiles//{id}");
            var di = new DirectoryInfo(path);

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
            return NotFound();

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
    public IEnumerable<ProductDto> GetPublisherProducts(string? query)
    {
        var publisherId = User.GetCurrentUserId();
        var products = dataContext.Set<Product>().Where(x => x.PublisherId == publisherId);

        if (!String.IsNullOrEmpty(query))
            products = products.Where(x => x.Name!.Contains(query));

        products = products.OrderByDescending(x => x.Id);
        return productService.GetProductDtos(products);
    }

    [HttpGet("library"), Authorize(Roles = RoleNames.User)]
    public ActionResult<ProductDto> GetLibrary(string? query)
    {
        var userId = User.GetCurrentUserId();

        if (userId == null)
            return BadRequest();

        var products = dataContext.Set<ProductUser>()
            .Where(x => x.UserId == userId)
            .Where(x => x.Product.Status != Product.StatusType.Inactive)
            .Select(x => x.Product);

        if (!String.IsNullOrEmpty(query))
            products = products.Where(x => x.Name!.Contains(query));

        return Ok(productService.GetProductDtos(products).OrderBy(x => x.Name));

    }

}