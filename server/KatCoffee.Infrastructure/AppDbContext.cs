using KatCoffee.Domain;
using Microsoft.EntityFrameworkCore;

namespace KatCoffee.Infrastructure;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Product> Products => Set<Product>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.Entity<Product>().Property(p => p.Price).HasColumnType("decimal(18,2)");
    }
}