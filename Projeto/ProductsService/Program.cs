var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// --- Início das adições para Swagger ---
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
// --- Fim das adições para Swagger ---

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    // --- Início das adições para Swagger UI ---
    app.UseSwagger();
    app.UseSwaggerUI();
    // --- Fim das adições para Swagger UI ---
}

// Se você não usou --no-https, descomente a linha abaixo
// app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();