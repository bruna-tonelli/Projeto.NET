using Microsoft.EntityFrameworkCore;
using FinanceiroService.Data;
using FinanceiroService.Repositories;
using FinanceiroService.Services;

var builder = WebApplication.CreateBuilder(args);

// --- IN�CIO DA CONFIGURA��O DOS SERVI�OS ---

// 1. Configura o DbContext com a string de conex�o do appsettings.json
builder.Services.AddDbContext<FinanceiroDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// 2. Registra nossas interfaces e classes para inje��o de depend�ncia
builder.Services.AddScoped<ITransacaoRepository, TransacaoRepository>();
// CORRE��O: Usando o nome da classe correto, "FinanceiroService"
builder.Services.AddScoped<IFinanceiroService, FinanceiroServiceImpl>();

// 3. Adiciona suporte para os Controllers da API
builder.Services.AddControllers();

// 4. ADI��O: Configura o CORS para permitir acesso do frontend Angular
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularDev", policy =>
    {
        policy.WithOrigins("http://localhost:4200") // A porta padr�o do Angular
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});


// Configura��o padr�o do Swagger para documenta��o da API
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// --- FIM DA CONFIGURA��O DOS SERVI�OS ---


var app = builder.Build();

// --- IN�CIO DA CONFIGURA��O DO PIPELINE HTTP ---

// Configura o pipeline de requisi��es HTTP
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// 5. ADI��O: Aplica a pol�tica de CORS que definimos
app.UseCors("AllowAngularDev");

app.UseAuthorization();

app.MapControllers();

app.Run();

// A chave '}' extra no final do seu arquivo foi removida.