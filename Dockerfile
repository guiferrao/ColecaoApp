# Estágio de Build
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copia os arquivos de projeto para restaurar dependências com cache otimizado
COPY ["src/ColecaoApp.Api/ColecaoApp.Api.csproj", "src/ColecaoApp.Api/"]
COPY ["src/ColecaoApp.Application/ColecaoApp.Application.csproj", "src/ColecaoApp.Application/"]
COPY ["src/ColecaoApp.Domain/ColecaoApp.Domain.csproj", "src/ColecaoApp.Domain/"]
COPY ["src/ColecaoApp.Infrastructure/ColecaoApp.Infrastructure.csproj", "src/ColecaoApp.Infrastructure/"]

RUN dotnet restore "src/ColecaoApp.Api/ColecaoApp.Api.csproj"

# Copia todo o código-fonte e realiza a compilação
COPY . .
WORKDIR "/src/src/ColecaoApp.Api"
RUN dotnet build "ColecaoApp.Api.csproj" -c Release -o /app/build

# Estágio de Publicação
FROM build AS publish
RUN dotnet publish "ColecaoApp.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Estágio de Execução (Runtime)
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
EXPOSE 8080
EXPOSE 8081
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "ColecaoApp.Api.dll"]