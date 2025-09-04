using Microsoft.EntityFrameworkCore;
using netversion.Models;
using System.Text.Json;

namespace netversion.Helpers {
  public static class NoteHelper {
    public static async Task<List<Note>> GetUserNotes(NotesAppNetContext db, int userId) {
      try {
        var results = await db.Notes
        .Where(notes => notes.UserId == userId && notes.Active == true)
        .Select(notes => new Note {
            Id = notes.Id,
            UserId = notes.UserId,
            Title = notes.Title,
            Text = notes.Text,
            Active = notes.Active
        })
        .ToListAsync();
        
        return results;
      } catch (Exception ex) {
        Console.Error.WriteLine($"DB select failed: {ex.Message}");
        return new List<Note>();
      }
    }

    // Wipes all notes of user -> inserts new backup -> returns success bool
    public static async Task<bool> BackupToDB(NotesAppNetContext db, int userId, JsonDocument jsonData) {
      using var transaction = await db.Database.BeginTransactionAsync();

      try {
        await db.Notes
        .Where(notes => notes.UserId == userId && notes.Active == true)
        .ExecuteUpdateAsync(setters => setters.SetProperty(notes => notes.Active, false));
      } catch (Exception ex) {
        Console.Error.WriteLine($"Failed to mark old backup as inactive: {ex.Message}");
        return false;
      }

      bool notesParsable = jsonData.RootElement.TryGetProperty("notes", out JsonElement notesElement);
      
      foreach (var note in notesElement.EnumerateArray()) {
        try {
          db.Notes.Add(new Note {
            UserId = userId,
            Title = note.GetProperty("title").GetString(),
            Text = note.GetProperty("text").GetString(),
            Active = true
          });
        } catch (Exception ex) {
          Console.Error.WriteLine($"DB insertion failed: {ex.Message}");
          await transaction.RollbackAsync();
          return false;
        }
      }

      try {
        await db.SaveChangesAsync();

        await db.Notes
        .Where(notes => notes.UserId == userId && notes.Active == false)
        .ExecuteDeleteAsync();

        await transaction.CommitAsync();
      } catch (Exception ex) {
        Console.Error.WriteLine($"Failed to remove old backup for user_id {userId}: {ex.Message}");
        return false;
      }
      return true;
    }
  }
}