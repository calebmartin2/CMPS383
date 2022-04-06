﻿using ImageMagick;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SP22.P05.Web.Data;
using SP22.P05.Web.Extensions;
using SP22.P05.Web.Features.Authorization;
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
    public ProductDto[] GetAllProducts(string? query)
    {
        var products = dataContext.Set<Product>().Where(x => x.Status == Product.StatusType.Active);
        if (!String.IsNullOrEmpty(query)) {
            products = products.Where(x => x.Name!.Contains(query));
        }
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

    [HttpPost("uploadPic/{id}")]
    //https://docs.microsoft.com/en-us/aspnet/core/mvc/models/file-uploads?view=aspnetcore-6.0
    public async Task<ActionResult> UploadPicturesAsync(List<IFormFile> pictures, int id)
    {

        foreach (var formFile in pictures)
        {
            if (formFile.Length > 0)
            {
                string myPath = Path.Combine(Directory.GetCurrentDirectory(), $"ProductFiles//{id}//Pictures");
                Directory.CreateDirectory(myPath);

                var filePath = Path.Combine(myPath, Guid.NewGuid().ToString() + Path.GetExtension(formFile.FileName));

                using (var stream = System.IO.File.Create(filePath))
                {
                    await formFile.CopyToAsync(stream);
                }
            }
        }

        return Ok();
    }

    [HttpPost]
    [Authorize(Roles = RoleNames.Publisher)]
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

    [HttpPut("{id}")]
    [Authorize(Roles = RoleNames.AdminOrPublisher)]
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
    public ActionResult<ProductDto> GetLibrary(string? query)
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
        if (!String.IsNullOrEmpty(query))
        {
            products = products.Where(x => x.Name!.Contains(query));
        }
        return Ok(GetProductDtos(products));

    }

    [HttpPost("updatefile")]
    public ActionResult UpdateFile(IFormFile file, [FromForm] int productId)
    {
        var product = dataContext.Set<Product>().First(x => x.Id == productId);
        if (product == null)
        {
            return BadRequest();
        }

        // delete product file
        //https://stackoverflow.com/questions/1288718/how-to-delete-all-files-and-folders-in-a-directory
        string delPath = Path.Combine(Directory.GetCurrentDirectory(), $"ProductFiles//{productId}//{product.FileName}");
        FileInfo delFile = new FileInfo(delPath);
        if (delFile.Exists)
        {
            delFile.Delete();
        }

        // attempt to add the new file
        //https://sankhadip.medium.com/how-to-upload-files-in-net-core-web-api-and-react-36a8fbf5c9e8
        try
        {
            string path = Path.Combine(Directory.GetCurrentDirectory(), $"ProductFiles//{productId}", file.FileName);
            Directory.CreateDirectory(Path.Combine(Directory.GetCurrentDirectory(), $"ProductFiles//{productId}"));
            using (Stream stream = new FileStream(path, FileMode.Create))
            {
                file.CopyTo(stream);
            }
            product.FileName = file.FileName;
            dataContext.SaveChanges();
            return Ok();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }



    }
    [HttpGet("download/{productId}/{fileName}")]
    public FileResult DownloadFile(int productId, string fileName)
    {
        // UNSAFE CODE: user can pass something like ../../ and access files they should not have access to.
        string path = Path.Combine(Directory.GetCurrentDirectory(), $"ProductFiles//{productId}//", fileName);
        byte[] bytes = System.IO.File.ReadAllBytes(path);
        return File(bytes, "application/octet-stream", fileName);
    }

    [HttpGet("icon/{productId}/")]
    public IActionResult DownloadIcon(int productId)
    {
        try
        {
            var iconName = dataContext.Set<Product>().First(x => x.Id == productId).IconName;
            string path = Path.Combine(Directory.GetCurrentDirectory(), $"ProductFiles//{productId}//", iconName);
            byte[] bytes = System.IO.File.ReadAllBytes(path);
            return File(bytes, "image/*", iconName);
        }
        catch (Exception)
        {
            return NotFound();
        }

    }

    [HttpGet("picture/{productId}/{fileName}")]
    public FileResult DownloadPicture(int productId, string fileName)
    {
        // UNSAFE CODE: user can pass something like ../../ and access files they should not have access to.
        string path = Path.Combine(Directory.GetCurrentDirectory(), $"ProductFiles//{productId}//Pictures", fileName);
        byte[] bytes = System.IO.File.ReadAllBytes(path);
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
                IconName = x.Product.IconName,
                Pictures = x.Product.Pictures.Select(x => "/api/products/picture/" + x.ProductId + "/" + x.Name).ToArray(),

            });
    }


}