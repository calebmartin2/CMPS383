using System.Transactions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SP22.P05.Web.Data;
using SP22.P05.Web.Extensions;
using SP22.P05.Web.Features.Authorization;

namespace SP22.P05.Web.Controllers;

[ApiController]
[Route("api/users")]
public class UsersController : ControllerBase
{
    private readonly UserManager<User> userManager;
    private readonly DataContext dataContext;

    public UsersController(UserManager<User> userManager, DataContext dataContext)
    {
        this.userManager = userManager;
        this.dataContext = dataContext;
    }

    [HttpPost]
    [Authorize(Roles = RoleNames.Admin)]
    public async Task<ActionResult<UserDto>> Create(CreateUserDto dto)
    {
        using var transaction = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled);

        var newUser = new User
        {
            UserName = dto.UserName,
        };
        var createResult = await userManager.CreateAsync(newUser, dto.Password);
        if (!createResult.Succeeded)
        {
            return BadRequest("Cannot create user (possible bad password).");
        }

        try
        {
            var roleResult = await userManager.AddToRolesAsync(newUser, dto.Roles);
            if (!roleResult.Succeeded)
            {
                return BadRequest("Cannot add user to role");
            }
        }
        catch (InvalidOperationException e) when(e.Message.StartsWith("Role") && e.Message.EndsWith("does not exist."))
        {
            return BadRequest("Role does not exist");
        }

        transaction.Complete();

        return Ok(new UserDto
        {
            Id = newUser.Id,
            Roles = dto.Roles,
            UserName = newUser.UserName,
        });
    }
    [HttpPost("sign-up")]
    public async Task<ActionResult<UserDto>> SignUp(SignUpDto dto)
    {
        using var transaction = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled);

        if (User.GetCurrentUserName() != null)
        {
            return BadRequest("User already logged in.");
        }

        var newUser = new User
        {
            UserName = dto.UserName,
        };
        var createResult = await userManager.CreateAsync(newUser, dto.Password);
        if (!createResult.Succeeded)
        {
            return BadRequest("Cannot create user (possible bad password).");
        }

        try
        {
            var roleResult = await userManager.AddToRoleAsync(newUser, RoleNames.User);
            if (!roleResult.Succeeded)
            {
                return BadRequest("Cannot add user to role");
            }
        }
        catch (InvalidOperationException e) when (e.Message.StartsWith("Role") && e.Message.EndsWith("does not exist."))
        {
            return BadRequest("Role does not exist");
        }

        transaction.Complete();
        return Ok(new UserDto
        {
            Id = newUser.Id,
            Roles = new string[1] { RoleNames.User },
            UserName = newUser.UserName,
        });
    }
    [HttpPost("create-publisher")]
    [Authorize(Roles = RoleNames.Admin)]
    public async Task<ActionResult<UserDto>> CreatePublisher(CreatePublisherDto dto)
    {
        using var transaction = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled);

        var newPublisher = new User
        {
            UserName = dto.UserName,
        };
        var createResult = await userManager.CreateAsync(newPublisher, dto.Password);
        if (!createResult.Succeeded)
        {
            return BadRequest("Cannot create user (possible bad password).");
        }

        try
        {
            var roleResult = await userManager.AddToRoleAsync(newPublisher, RoleNames.Publisher);
            if (!roleResult.Succeeded)
            {
                return BadRequest("Cannot add user to role");
            }
        }
        catch (InvalidOperationException e) when (e.Message.StartsWith("Role") && e.Message.EndsWith("does not exist."))
        {
            return BadRequest("Role does not exist");
        }

        var publisherInfo = new PublisherInfo
        {
            UserId = newPublisher.Id,
            CompanyName = dto.CompanyName,
        };
        dataContext.Add(publisherInfo);
        dataContext.SaveChanges();

        transaction.Complete();
        return Ok(new PublisherDto
        {
            Id = newPublisher.Id,
            UserName = newPublisher.UserName,
            CompanyName = dto.CompanyName,
        });
    }
}