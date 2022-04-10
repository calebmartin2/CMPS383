using Microsoft.AspNetCore.Mvc;
using SP22.P05.Web.Data;
using SP22.P05.Web.Features.Products;

namespace SP22.P05.Web.Controllers;
[Route("api/file")]
[ApiController]
public class FileController : Controller
{
    private readonly DataContext dataContext;

    public FileController(DataContext dataContext)
    {
        this.dataContext = dataContext;

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
        int CacheAgeSeconds = 60 * 60 * 24; // 1 day
        Response.Headers["Cache-Control"] = $"public,max-age={CacheAgeSeconds}";

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
        int CacheAgeSeconds = 60 * 60 * 24; // 1 day
        Response.Headers["Cache-Control"] = $"public,max-age={CacheAgeSeconds}";
        // UNSAFE CODE: user can pass something like ../../ and access files they should not have access to.
        string path = Path.Combine(Directory.GetCurrentDirectory(), $"ProductFiles//{productId}//Pictures", fileName);
        byte[] bytes = System.IO.File.ReadAllBytes(path);
        return File(bytes, "application/octet-stream", fileName);
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
}

