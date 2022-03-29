namespace SP22.P05.Web.Features.Files
{
    public class FileModel
    {
        public string FileName { get; set; } = string.Empty;
        public IFormFile? FormFile { get; set; } = null;
    }
}
