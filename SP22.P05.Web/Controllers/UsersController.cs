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

    [HttpPost, Authorize(Roles = RoleNames.Admin)]
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
    public async Task<ActionResult<UserDto>> CreatePublisher(CreatePublisherDto dto)
    {
        using var transaction = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled);

        var newPublisher = new User
        {
            UserName = dto.UserName,
            Email = dto.Email,
        };
        var createResult = await userManager.CreateAsync(newPublisher, dto.Password);
        if (!createResult.Succeeded)
        {
            return BadRequest("Cannot create user (possible bad password).");
        }

        try
        {
            var roleResult = await userManager.AddToRoleAsync(newPublisher, RoleNames.PendingPublisher);
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
            Email = newPublisher.Email
        });
    }

    [HttpDelete("delete-publisher/{id}"), Authorize(Roles = RoleNames.Admin)]
    public async Task<ActionResult> DeletePublisher(int id)
    {
        var publisher = userManager.Users.FirstOrDefault(x => x.Id == id);
        if (publisher == null)
        {
            return NotFound("Publisher does not exist");
        }

        var deleteResult = await userManager.DeleteAsync(publisher);
        if (!deleteResult.Succeeded)
        {
            return BadRequest("Cannot delete publisher.");
        }

        return Ok();
    }

    [HttpGet("get-all-publishers"), Authorize(Roles = RoleNames.Admin)]
    public async Task<ActionResult<List<PublisherDto>>> GetAllPublishers()
    {
        var pendingPublishers = await userManager.GetUsersInRoleAsync(RoleNames.PendingPublisher);
        var approvedPublishers = await userManager.GetUsersInRoleAsync(RoleNames.Publisher);
        var allPublishers = Enumerable.Concat(pendingPublishers, approvedPublishers);
        var publisherInfo = dataContext.Set<PublisherInfo>();
        var publisherDto = new List<PublisherDto>();
        // Probably a built in way, don't know how else to fix at the moment
        foreach (var publisher in allPublishers)
        {
            if (!publisherInfo.Any(x => x.UserId == publisher.Id))
            {
                return BadRequest("Publisher does not have info.");
            }
            publisherDto.Add(new PublisherDto
            {
                Id = publisher.Id,
                UserName = publisher.UserName,
                CompanyName = publisherInfo.First(x => x.UserId == publisher.Id).CompanyName,
                IsApproved = approvedPublishers.Contains(publisher),
                Email = publisher.Email
            });
        }
        return Ok(publisherDto);
    }

    [HttpGet("get-pending-publishers"), Authorize(Roles = RoleNames.Admin)]
    public async Task<ActionResult<List<PublisherDto>>> GetPendingPublishers()
    {
        var pendingPublishers = await userManager.GetUsersInRoleAsync(RoleNames.PendingPublisher);
        var publisherInfo = dataContext.Set<PublisherInfo>();
        var publisherDto = new List<PublisherDto>();
        // Probably a built in way, don't know how else to fix at the moment
        foreach (var publisher in pendingPublishers)
        {
            if (!publisherInfo.Any(x => x.UserId == publisher.Id))
            {
                return BadRequest("Publisher does not have info.");
            }
            publisherDto.Add(new PublisherDto
            {
                Id = publisher.Id,
                UserName = publisher.UserName,
                CompanyName = publisherInfo.First(x => x.UserId == publisher.Id).CompanyName,
                Email = publisher.Email
            });
        }
        return Ok(publisherDto);
    }

    [HttpGet("get-approved-publishers"), Authorize(Roles = RoleNames.Admin)]
    public async Task<ActionResult<List<PublisherDto>>> GetApprovedPubilshers()
    {
        var approvedPublishers = await userManager.GetUsersInRoleAsync(RoleNames.Publisher);
        var publisherInfo = dataContext.Set<PublisherInfo>();
        var publisherDto = new List<PublisherDto>();
        // Probably a built in way, don't know how else to fix at the moment
        foreach (var publisher in approvedPublishers)
        {
            if (!publisherInfo.Any(x => x.UserId == publisher.Id))
            {
                return BadRequest("Publisher does not have info.");
            }
            publisherDto.Add(new PublisherDto
            {
                Id = publisher.Id,
                UserName = publisher.UserName,
                CompanyName = publisherInfo.First(x => x.UserId == publisher.Id).CompanyName,
                IsApproved = true,
                Email = publisher.Email
            });
        }
        return Ok(publisherDto);
    }

    [HttpPost("verify-publisher"), Authorize(Roles = RoleNames.Admin)]
    public async Task<ActionResult<UserDto>> VerifyPublisher([FromForm] int id)
    {
        var currentUser = userManager.Users.FirstOrDefault(x => x.Id == id);
        if (currentUser == null)
        {
            return BadRequest("User does not exist.");
        }
        if (!await userManager.IsInRoleAsync(currentUser, RoleNames.PendingPublisher))
        {
            return BadRequest("User is not a pending publisher");
        }
        await userManager.RemoveFromRoleAsync(currentUser, RoleNames.PendingPublisher);
        await userManager.AddToRoleAsync(currentUser, RoleNames.Publisher);
        UserDto returnDto = new UserDto()
        {
            Id = currentUser.Id,
            UserName = currentUser.UserName,
            Roles = new string[] { RoleNames.Publisher },
        };
        return Ok(returnDto);
    }
}