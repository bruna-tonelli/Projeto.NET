using Microsoft.EntityFrameworkCore;
using ProdutoService.Data;

var builder = WebApplication.CreateBuilder(args);

// Adiciona o DbContext com a connection string do appsettings.json
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Adiciona controllers
builder.Services.AddControllers();

// Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddScoped<ProdutoService.Services.ProdutoService>();

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

// Migração automática do banco de dados
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    try
    {
        // Verifica se pode conectar ao banco
        await context.Database.CanConnectAsync();
        Console.WriteLine("Conexão com banco estabelecida com sucesso");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Erro na conexão com banco: {ex.Message}");
        throw;
    }
}

// Configuração do pipeline HTTP
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(); // Adicione esta linha antes de app.UseAuthorization();

app.UseAuthorization();

app.MapControllers();

app.Run();
