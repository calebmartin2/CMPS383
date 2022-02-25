using System.ComponentModel.DataAnnotations;

namespace SP22.P05.Web.Features.Authorization;

public class CreatePublisherDto
{
    [Required]
    public string UserName { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;

    [Required]
    public string CompanyName { get; set; } = string.Empty;
}