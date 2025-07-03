var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// --- In�cio das adi��es para Swagger ---
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
// --- Fim das adi��es para Swagger ---

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    // --- In�cio das adi��es para Swagger UI ---
    app.UseSwagger();
    app.UseSwaggerUI();
    // --- Fim das adi��es para Swagger UI ---
}

// Se voc� n�o usou --no-https, descomente a linha abaixo
// app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();