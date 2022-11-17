using Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Api.Data.Context;

public class VocabContext : DbContext
{
    public VocabContext(DbContextOptions<VocabContext> options) : base(options) { }

    public DbSet<Word> Words { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        builder.Entity<Word>(entity =>
        {
            entity.ToTable("Word");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Key).HasColumnName("key_word");
            entity.Property(e => e.Value).HasColumnName("value_word");
            entity.Property(e => e.Notes).HasColumnName("notes");
            entity.Property(e => e.Importancy).HasColumnName("importancy");
            entity.Property(e => e.IsActive).HasColumnName("is_active");
            entity.Property(e => e.CreateDate).HasColumnName("create_date");
            entity.Property(e => e.UpdateDate).HasColumnName("update_date");
        });

        base.OnModelCreating(builder);
    }
}
