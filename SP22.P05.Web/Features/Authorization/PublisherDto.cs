namespace SP22.P05.Web.Features.Authorization
{
    public class PublisherDto
    {
        public int Id { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string CompanyName { get; set; } = string.Empty;
        public bool IsApproved { get; set; }
        public string Email { get; set; } = string.Empty;
    }
}
