using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace KatCoffee.IdentityServer.Data;

public class ApplicationUser : IdentityUser
{
    public string FullName { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class IdentityAppDbContext : IdentityDbContext<ApplicationUser>
{
    public IdentityAppDbContext(DbContextOptions<IdentityAppDbContext> options) : base(options) { }
}