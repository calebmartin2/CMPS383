using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using SP22.P05.Web.Features.Authorization;
using SP22.P05.Web.Features.Products;
using SP22.P05.Web.Features.Sales;

namespace SP22.P05.Web.Data;

public static class MigrateAndSeed
{
    public static async Task Initialize(IServiceProvider services)
    {
        var context = services.GetRequiredService<DataContext>();
        context.Database.Migrate();

        await AddRoles(services);
        await AddUsers(services);
        await AddPublisherInfoAsync(context, services);
        await AddProductsAsync(context, services);
        AddSaleEvent(context);
    }

    private static async Task AddPublisherInfoAsync(DataContext context, IServiceProvider services)
    {
        var userManager = services.GetRequiredService<UserManager<User>>();
        var tempPublisher = await userManager.FindByNameAsync("alice");
        var publishers = context.Set<PublisherInfo>();
        if (publishers.Any())
        {
            return;
        }
        var publisherInfo = new PublisherInfo
        {
            UserId = tempPublisher.Id,
            CompanyName = "Sony"
        };
        context.Add(publisherInfo);
        context.SaveChanges();
    }

    private static async Task AddUsers(IServiceProvider services)
    {
        const string defaultPassword = "Password123!";

        var userManager = services.GetRequiredService<UserManager<User>>();
        if (userManager.Users.Any())
        {
            return;
        }

        var adminUser = new User
        {
            UserName = "galkadi"
        };
        await userManager.CreateAsync(adminUser, defaultPassword);
        await userManager.AddToRoleAsync(adminUser, RoleNames.Admin);

        var bobUser = new User
        {
            UserName = "bob"
        };
        await userManager.CreateAsync(bobUser, defaultPassword);
        await userManager.AddToRoleAsync(bobUser, RoleNames.User);

        var aliceUser = new User
        {
            UserName = "alice"
        };
        await userManager.CreateAsync(aliceUser, defaultPassword);
        await userManager.SetEmailAsync(aliceUser, "alice@example.com");
        await userManager.AddToRoleAsync(aliceUser, RoleNames.Publisher);
    }

    private static async Task AddRoles(IServiceProvider services)
    {
        var roleManager = services.GetRequiredService<RoleManager<Role>>();

        if (!await roleManager.RoleExistsAsync(RoleNames.Admin))
        {
            await roleManager.CreateAsync(new Role
            {
                Name = RoleNames.Admin
            });
        }

        if (!await roleManager.RoleExistsAsync(RoleNames.User))
        {
            await roleManager.CreateAsync(new Role
            {
                Name = RoleNames.User
            });
        }

        if (!await roleManager.RoleExistsAsync(RoleNames.Publisher))
        {
            await roleManager.CreateAsync(new Role
            {
                Name = RoleNames.Publisher
            });
        }

        if (!await roleManager.RoleExistsAsync(RoleNames.PendingPublisher))
        {
            await roleManager.CreateAsync(new Role
            {
                Name = RoleNames.PendingPublisher
            });
        }
    }

    private static void AddSaleEvent(DataContext context)
    {
        var saleEvents = context.Set<SaleEvent>();
        if (saleEvents.Any())
        {
            return;
        }
        var products = context.Set<Product>();
        var product = products.First();
        var saleEvent = new SaleEvent
        {
            Name = "Spring Sale",
            StartUtc = DateTimeOffset.UtcNow,
            EndUtc = DateTimeOffset.UtcNow.AddDays(1),
            Products =
            {
                new SaleEventProduct
                {
                    Product = product,
                    SaleEventPrice = 0,
                }
            }
        };
        saleEvents.Add(saleEvent);
        context.SaveChanges();
    }

    private static async Task AddProductsAsync(DataContext context, IServiceProvider services)
    {
        var userManager = services.GetRequiredService<UserManager<User>>();
        var tempPublisher = await userManager.FindByNameAsync("alice");
        var products = context.Set<Product>();
        if (products.Any())
        {
            return;
        }

        products.Add(new Product
        {
            Name = "Half Life 2",
            Description = "A game",
            Price = 12.99m,
            PublisherId = tempPublisher.Id
        });
        products.Add(new Product
        {
            Name = "Visual Studio 2022: Professional",
            Description = "A program",
            Price = 199m,
            PublisherId = tempPublisher.Id
        });
        products.Add(new Product
        {
            Name = "Photoshop",
            Description = "Fancy mspaint",
            Price = 10m,
            PublisherId = tempPublisher.Id
        });
        context.SaveChanges();
    }
}