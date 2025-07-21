using InventarioService.Data;
using InventarioService.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Configurar DbContext
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// ADICIONAR: HttpClient para comunicação entre serviços
builder.Services.AddHttpClient<InventarioServiceImpl>();

// Registrar serviços - CORRIGIDO: removido namespace duplicado
builder.Services.AddScoped<IInventarioService, InventarioServiceImpl>();

// Configurar Controllers
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configurar CORS
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Configurar pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();
app.UseAuthorization();
app.MapControllers();

// Migração automática
using (var scope = app.Services.CreateScope())
{
    try
    {
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        await context.Database.CanConnectAsync();
        Console.WriteLine("✅ Conexão com banco estabelecida com sucesso");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"❌ Erro na conexão: {ex.Message}");
    }
}

app.Run();
