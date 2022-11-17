using Api.Data;
using Api.Data.Context;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("VocabConnectionString");

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<VocabContext>(options => options.UseSqlite(connectionString));
builder.Services.AddTransient<IWordRepository, WordRepository>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();

    var dbOriginalUri = new SqliteConnectionStringBuilder(connectionString).DataSource;
    var dbDirectory = Path.GetDirectoryName(dbOriginalUri);
    var dbName = builder.Configuration.GetValue<string>("DatabaseName");
    var dbExtension = Path.GetExtension(dbOriginalUri);

    if (dbDirectory is null || dbName is null || dbExtension is null)
        throw new Exception("Invalid database configuration");

    File.Copy(Path.Combine(dbDirectory, $"{dbName}{dbExtension}"), Path.Combine(dbDirectory, $"{dbName}_dev{dbExtension}"), true);
}

app.UseAuthorization();

app.UseCors(builder =>
{
    builder
        .SetIsOriginAllowed(_ => true)
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials();
});

app.MapControllers();

app.Run();