using Microsoft.EntityFrameworkCore; // Adicione esta diretiva de namespace para resolver o erro CS1061  
using Microsoft.EntityFrameworkCore.SqlServer;
using ProductsService.Data; // Certifique-se de que esta diretiva de namespace está presente  
using ProductsService.Data;
using ProductsService.Repositories;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.  

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi  
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddOpenApi();

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(connectionString)); // Certifique-se de que o pacote Microsoft.EntityFrameworkCore.SqlServer está instalado  

builder.Services.AddScoped<IProdutoRepository, ProdutoRepository>();
var app = builder.Build();

// Configure the HTTP request pipeline.  
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
