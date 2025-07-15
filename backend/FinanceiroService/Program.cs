using Microsoft.EntityFrameworkCore;
using FinanceiroService.Data;
using FinanceiroService.Repositories;
using FinanceiroService.Services;

var builder = WebApplication.CreateBuilder(args);

// --- INÍCIO DA CONFIGURAÇÃO DOS SERVIÇOS ---

// 1. Configura o DbContext com a string de conexão do appsettings.json
builder.Services.AddDbContext<FinanceiroDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// 2. Registra nossas interfaces e classes para injeção de dependência
builder.Services.AddScoped<ITransacaoRepository, TransacaoRepository>();
// CORREÇÃO: Usando o nome da classe correto, "FinanceiroService"
builder.Services.AddScoped<IFinanceiroService, FinanceiroServiceImpl>();

// 3. Adiciona suporte para os Controllers da API
builder.Services.AddControllers();

// 4. ADIÇÃO: Configura o CORS para permitir acesso do frontend Angular
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularDev", policy =>
    {
        policy.WithOrigins("http://localhost:4200") // A porta padrão do Angular
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});


// Configuração padrão do Swagger para documentação da API
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// --- FIM DA CONFIGURAÇÃO DOS SERVIÇOS ---


var app = builder.Build();

// --- INÍCIO DA CONFIGURAÇÃO DO PIPELINE HTTP ---

// Configura o pipeline de requisições HTTP
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// 5. ADIÇÃO: Aplica a política de CORS que definimos
app.UseCors("AllowAngularDev");

app.UseAuthorization();

app.MapControllers();

app.Run();

// A chave '}' extra no final do seu arquivo foi removida.