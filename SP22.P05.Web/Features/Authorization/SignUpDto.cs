using System.ComponentModel.DataAnnotations;

namespace SP22.P05.Web.Features.Authorization
{
    public class SignUpDto
    {

        [Required]
        public string UserName { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;
    }
}
