using System;
using System.Collections.Generic;

namespace netversion.Models;

public partial class Member
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public string Password { get; set; } = null!;

    public virtual ICollection<Note> Notes { get; } = new List<Note>();
}
