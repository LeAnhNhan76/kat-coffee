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
    public async Task<IActionResult> GetProducts([FromQuery] string? category)
    {
        var query = _context.Products.Include(p => p.Category).AsQueryable();

        if (!string.IsNullOrEmpty(category))
            query = query.Where(p => p.Category!.Slug == category);

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