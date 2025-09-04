using System;
using System.Collections.Generic;

namespace netversion.Models;

public partial class Note
{
    public int Id { get; set; }

    public DateTime CreatedAt { get; set; }

    public int UserId { get; set; }

    public string? Title { get; set; }

    public string? Text { get; set; }

    public bool? Active { get; set; }

    public virtual Member User { get; set; } = null!;
}
