using KatCoffee.Domain;
using Microsoft.EntityFrameworkCore;

namespace KatCoffee.Infrastructure;

public static class DbSeeder
{
    public static async Task SeedAsync(AppDbContext context)
    {
        // 1. Tự động Migration nếu DB chưa có
        await context.Database.MigrateAsync();

        // 2. Seed Categories & Dummy Products
        if (!await context.Categories.AnyAsync())
        {
            var catCoffee = new Category { Id = Guid.NewGuid(), Name = "Cà Phê", Slug = "coffee" };
            var catTea = new Category { Id = Guid.NewGuid(), Name = "Trà Trái Cây", Slug = "tea" };
            var catBakery = new Category { Id = Guid.NewGuid(), Name = "Bánh Ngọt", Slug = "bakery" };

            await context.Categories.AddRangeAsync(catCoffee, catTea, catBakery);

            var dummyProducts = new List<Product>
            {
                new Product { Id = Guid.NewGuid(), Name = "Espresso Đậm Vị", Price = 35000, CategoryId = catCoffee.Id, ImageUrl = "☕" },
                new Product { Id = Guid.NewGuid(), Name = "Bạc Xỉu Sài Gòn", Price = 42000, CategoryId = catCoffee.Id, ImageUrl = "🥤" },
                new Product { Id = Guid.NewGuid(), Name = "Trà Đào Cam Sả", Price = 45000, CategoryId = catTea.Id, ImageUrl = "🍹" },
                new Product { Id = Guid.NewGuid(), Name = "Trà Sữa Oolong", Price = 48000, CategoryId = catTea.Id, ImageUrl = "🧋" },
                new Product { Id = Guid.NewGuid(), Name = "Croissant Bơ Pháp", Price = 38000, CategoryId = catBakery.Id, ImageUrl = "🥐" },
                new Product { Id = Guid.NewGuid(), Name = "Bánh Tiramisu", Price = 52000, CategoryId = catBakery.Id, ImageUrl = "🍰" }
            };

            await context.Products.AddRangeAsync(dummyProducts);
            await context.SaveChangesAsync();
        }
    }
}