using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SP22.P05.Web.Data;
using SP22.P05.Web.Features.Authorization;
using SP22.P05.Web.Features.Products;

namespace SP22.P05.Web.Controllers;

[Route("api/tags")]
[ApiController]
public class TagsController : Controller
{
    private readonly DataContext dataContext;

    public TagsController(DataContext dataContext)
    {
        this.dataContext = dataContext;
    }

    [HttpGet]
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

    [HttpPost, Authorize(Roles = RoleNames.Admin)]
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

    [HttpPost("add-product-to-tag"), Authorize(Roles = RoleNames.AdminOrPublisher)]
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

}
