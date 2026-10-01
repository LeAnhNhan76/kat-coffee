using KatCoffee.Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace KatCoffee.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly AppDbContext _context;

    public ProductsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetProducts(
        [FromQuery] string? category,
        [FromQuery] string? search,
        [FromQuery] decimal? minPrice,
        [FromQuery] decimal? maxPrice,
        [FromQuery] bool availableOnly = false)
    {
        var query = _context.Products.Include(p => p.Category).AsQueryable();

        if (!string.IsNullOrEmpty(category))
            query = query.Where(p => p.Category!.Slug == category);

        if (!string.IsNullOrWhiteSpace(search))
        {
            var searchTerm = search.Trim();
            query = query.Where(p => p.Name.Contains(searchTerm));
        }

        if (minPrice.HasValue)
            query = query.Where(p => p.Price >= minPrice.Value);

        if (maxPrice.HasValue)
            query = query.Where(p => p.Price <= maxPrice.Value);

        if (availableOnly)
            query = query.Where(p => p.IsAvailable);

        return Ok(await query.ToListAsync());
    }

    // Endpoint này bắt buộc phải Đăng nhập và có Role Admin
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateProduct([FromBody] CreateProductDto dto)
    {
        // Logic tạo sản phẩm
        return Ok(new { message = "Thêm sản phẩm thành công!" });
    }
}

public record CreateProductDto(string Name, decimal Price, Guid CategoryId);