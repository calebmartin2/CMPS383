using System.ComponentModel.DataAnnotations;

namespace SP22.P05.Web.Features.Products;

public class CreateProductDto
{
    public int Id { get; set; }

    [Required, MaxLength(120)]
    public string Name { get; set; } = string.Empty;

    [Required]
    public string Description { get; set; } = string.Empty;

    [Required]
    public string Blurb { get; set; } = string.Empty;

    [Range(0.01, double.MaxValue)]
    public decimal Price { get; set; }
    public IFormFile? file { get; set; }
    public IFormFile? icon { get; set; }
    public List<IFormFile>? Pictures { get; set; }

}