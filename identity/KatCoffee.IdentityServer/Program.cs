using System.Text;
using KatCoffee.IdentityServer.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi;

var builder = WebApplication.CreateBuilder(args);

// 1. Cấu hình DbContext trỏ tới kat-coffee-db
builder.Services.AddDbContext<IdentityAppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// 2. Cấu hình ASP.NET Core Identity
builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
    .AddEntityFrameworkStores<IdentityAppDbContext>()
    .AddDefaultTokenProviders();

// 3. Cấu hình CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowClient", policy =>
        policy.WithOrigins("http://localhost:5173").AllowAnyHeader().AllowAnyMethod());
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// 4. Setup SwaggerGen với OpenAPI Spec và nút Authorize Bearer Token
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "KatCoffee Identity Server API",
        Version = "v1",
        Description = "Hệ thống Quản lý Người dùng & Cấp phát JWT Token cho KatCoffee"
    });

    // Tích hợp Authorization Bearer Token vào giao diện Swagger UI
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Nhập Token theo định dạng: Bearer {your_token}"
    });
});

var app = builder.Build();

// 5. Migration và Seed Data khởi tạo vào kat-coffee-db
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<IdentityAppDbContext>();
    await db.Database.MigrateAsync();

    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();

    if (!await roleManager.RoleExistsAsync("Admin")) await roleManager.CreateAsync(new IdentityRole("Admin"));
    if (!await roleManager.RoleExistsAsync("Staff")) await roleManager.CreateAsync(new IdentityRole("Staff"));

    if (await userManager.FindByEmailAsync("admin@katcoffee.com") == null)
    {
        var admin = new ApplicationUser
        {
            UserName = "admin@katcoffee.com",
            Email = "admin@katcoffee.com",
            FullName = "Kat Admin",
            EmailConfirmed = true
        };
        await userManager.CreateAsync(admin, "KatCoffee@123");
        await userManager.AddToRoleAsync(admin, "Admin");
    }
}

// 6. Kích hoạt Middleware Swagger & Swagger UI
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "KatCoffee Identity Server v1");
        c.RoutePrefix = "swagger"; // Đường dẫn truy cập: https://localhost:7001/swagger
    });
}

app.UseCors("AllowClient");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.Run();