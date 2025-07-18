using Microsoft.EntityFrameworkCore;
using MovimentacaoService.Data;



var builder = WebApplication.CreateBuilder(args);


// Adiciona o DbContext com a connection string do appsettings.json
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Adicionar HttpClient
builder.Services.AddHttpClient();

// Registrar apenas o service (sem repository)
builder.Services.AddScoped<MovimentacaoService.Services.MovimentacaoService>();

builder.Services.AddCors(options => {
    options.AddDefaultPolicy(policy => {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Migração automática do banco de dados
using (var scope = app.Services.CreateScope()) {
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    try {
        context.Database.Migrate();
        Console.WriteLine("Migração do banco executada com sucesso");
    } catch (Exception ex) {
        Console.WriteLine($"Erro na migração: {ex.Message}");
    }
}

// Configuração do pipeline HTTP
if (app.Environment.IsDevelopment()) {
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();
app.UseAuthorization();
app.MapControllers();

app.Run();