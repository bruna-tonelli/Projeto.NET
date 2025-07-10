FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copiar arquivos de projeto
COPY ["UsuarioService/UsuarioService/UsuarioService.csproj", "UsuarioService/UsuarioService/"]
COPY ["Shared/Shared.csproj", "Shared/"]

# Restaurar dependências
RUN dotnet restore "UsuarioService/UsuarioService/UsuarioService.csproj"

# Copiar código fonte
COPY ["UsuarioService/", "UsuarioService/"]
COPY ["Shared/", "Shared/"]

# Construir aplicação
WORKDIR "/src/UsuarioService/UsuarioService"
RUN dotnet build "UsuarioService.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "UsuarioService.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "UsuarioService.dll"]
