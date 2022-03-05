namespace SP22.P05.Web.Features.Authorization;

public static class RoleNames
{
    public const string Admin = nameof(Admin);
    public const string User = nameof(User);
    public const string Publisher = nameof(Publisher);
    public const string PendingPublisher = nameof(PendingPublisher);
    public const string AdminOrPublisher = nameof(Admin) + "," + nameof(Publisher);
}