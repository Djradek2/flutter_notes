using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BCrypt.Net;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using netversion.Helpers;
using netversion.Models;
using System.Text.Json;

// ------------------- PROGRAM -------------------

var builder = WebApplication.CreateBuilder(args);
var config = builder.Configuration;

builder.Services.AddDbContext<NotesAppNetContext>(options => {
  options.UseNpgsql(config.GetConnectionString("NotesAppNetConnection"));
});

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
.AddJwtBearer(options => {
  options.TokenValidationParameters = new TokenValidationParameters {
    ValidateIssuer = false,
    ValidateAudience = false,
    ValidateLifetime = true,
    ValidateIssuerSigningKey = true,
    IssuerSigningKey =
    new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["JWT_SECRET"] ?? "super_secret"))
  };
});

builder.Services.AddAuthorization();

var app = builder.Build();
app.UseAuthentication();
app.UseAuthorization();

app.MapPost("/", async ([FromServices] NotesAppNetContext db) => {
  Console.WriteLine("yo");
  var test = await NoteHelper.GetUserNotes(db, 1);
  Console.WriteLine(test[0].Text);
  return Results.Ok("Hello World!");
});

// ------------------- LOGIN -------------------

app.MapPost("/login", async ([FromBody] LoginRequest req, [FromServices] NotesAppNetContext db) => {
  if (string.IsNullOrWhiteSpace(req.Username) || string.IsNullOrWhiteSpace(req.Password))
  {
    return Results.BadRequest(new { error = "Invalid input!" });
  }
  if (req.Username.Length > 1024 || req.Password.Length > 1024) {
    return Results.BadRequest(new { error = "Input too long!" });
  }
  var user = await db.Members.FirstOrDefaultAsync(m => m.Name == req.Username);
  if (user == null) {
    return Results.Unauthorized();
  }
  bool isMatch = BCrypt.Net.BCrypt.Verify(req.Password, user.Password);
  if (!isMatch) {
    return Results.Unauthorized();
  }
  var tokenHandler = new JwtSecurityTokenHandler();
  var key = Encoding.UTF8.GetBytes(config["JWT_SECRET"] ?? "super_secret");
  var tokenDescriptor = new SecurityTokenDescriptor {
    Subject = new ClaimsIdentity(new[] { new Claim("id", user.Id.ToString()) }),
    Expires = DateTime.UtcNow.AddHours(1),
    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
  };

  var token = tokenHandler.CreateToken(tokenDescriptor);
  var tokenString = tokenHandler.WriteToken(token);

  return Results.Ok(new { token = tokenString });
});

// ------------------- RELOAD BACKUP -------------------

app.MapGet("/reload_backup", [Authorize] async (ClaimsPrincipal user, [FromServices] NotesAppNetContext db) => {
  int userId = int.Parse(user.FindFirst("id")?.Value ?? "0");
  var result = await NoteHelper.GetUserNotes(db, userId);

  if (result.Any())
  return Results.Ok(new { data = result });
  else
  return Results.Ok(new { message = "No saved backup!" });
});

// ------------------- BACKUP NOTES -------------------

app.MapPost("/backup_notes", [Authorize] async (ClaimsPrincipal user, [FromBody] JsonDocument notes, [FromServices] NotesAppNetContext db) => {
  int userId = int.Parse(user.FindFirst("id")?.Value ?? "0");
  if (await NoteHelper.BackupToDB(db, userId, notes)) {
    return Results.Ok(new { message = "Success!" });
  } else {
    return Results.Ok(new { message = "Failed to save backup!" });
  }
});

app.Run(); //"http://localhost:5227"

// ------------------- REQUEST MODELS -------------------

public record LoginRequest(string Username, string Password);