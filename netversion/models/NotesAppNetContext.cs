using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace netversion.Models;

public partial class NotesAppNetContext : DbContext
{
  public NotesAppNetContext(DbContextOptions<NotesAppNetContext> options) : base(options) {}

  public virtual DbSet<Member> Members { get; set; }

  public virtual DbSet<Note> Notes { get; set; }

  protected override void OnModelCreating(ModelBuilder modelBuilder) {
    modelBuilder.Entity<Member>(entity => {
      entity.HasKey(e => e.Id).HasName("user_pkey");

      entity.ToTable("member");

      entity.Property(e => e.Id)
              .HasDefaultValueSql("nextval('user_id2_seq'::regclass)")
              .HasColumnName("id");
      entity.Property(e => e.CreatedAt)
              .HasDefaultValueSql("now()")
              .HasColumnType("timestamp without time zone")
              .HasColumnName("createdAt");
      entity.Property(e => e.Name)
              .HasMaxLength(255)
              .HasColumnName("name");
      entity.Property(e => e.Password)
              .HasMaxLength(255)
              .HasDefaultValueSql("'1234'::character varying")
              .HasColumnName("password");
    });

    modelBuilder.Entity<Note>(entity => {
      entity.HasKey(e => e.Id).HasName("notes_pkey");

      entity.ToTable("notes");

      entity.Property(e => e.Id)
              .UseIdentityAlwaysColumn()
              .HasColumnName("id");
      entity.Property(e => e.Active)
              .IsRequired()
              .HasDefaultValueSql("true")
              .HasColumnName("active");
      entity.Property(e => e.CreatedAt)
              .HasDefaultValueSql("now()")
              .HasColumnType("timestamp without time zone")
              .HasColumnName("createdAt");
      entity.Property(e => e.Text)
              .HasColumnType("character varying")
              .HasColumnName("text");
      entity.Property(e => e.Title)
              .HasColumnType("character varying")
              .HasColumnName("title");
      entity.Property(e => e.UserId).HasColumnName("user_id");

      entity.HasOne(d => d.User).WithMany(p => p.Notes)
              .HasForeignKey(d => d.UserId)
              .OnDelete(DeleteBehavior.ClientSetNull)
              .HasConstraintName("owner");
    });

    OnModelCreatingPartial(modelBuilder);
  }

  partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
