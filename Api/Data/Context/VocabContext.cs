using Microsoft.EntityFrameworkCore;
using Vocab.Api.Models;

namespace Vocab.Api.Data.Context
{
    public class VocabContext : DbContext
    {
        public VocabContext(DbContextOptions<VocabContext> options): base(options) { }

        public DbSet<Word> Words { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<Word>(entity =>
            {
                entity.ToTable("Word");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasColumnName("Id");
                entity.Property(e => e.Key).HasColumnName("KeyWord");
                entity.Property(e => e.Value).HasColumnName("ValueWord");
                entity.Property(e => e.Notes).HasColumnName("Notes");
                entity.Property(e => e.Importancy).HasColumnName("Importancy");
                entity.Property(e => e.IsActive).HasColumnName("IsActive");
                entity.Property(e => e.CreateDate).HasColumnName("CreateDate");
                entity.Property(e => e.UpdateDate).HasColumnName("UpdateDate");
            });

            base.OnModelCreating(builder);
        }
    }
}
