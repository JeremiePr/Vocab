using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;
using Vocab.Domain.Common;
using Vocab.Domain.Entities;

namespace Vocab.Persistence
{
    public class VocabContext : DbContext
    {
        public VocabContext(DbContextOptions<VocabContext> options): base(options)
        {
        }

        public DbSet<Category> Categories { get; set; }
        public DbSet<Word> Words { get; set; }
        public DbSet<WordCategory> WordCategories { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<Category>(entity =>
            {
                entity.ToTable("Category");

                entity.HasKey(e => e.Id);

                entity.Property(e => e.CreateDate)
                    .HasColumnName("CreateDate");

                entity.Property(e => e.Id)
                    .HasColumnName("Id");

                entity.Property(e => e.IsActive)
                    .HasColumnName("IsActive");

                entity.Property(e => e.Title)
                    .HasColumnName("Title")
                    .HasMaxLength(50);

                entity.Property(e => e.UpdateDate)
                    .HasColumnName("UpdateDate");
            });

            builder.Entity<Word>(entity =>
            {
                entity.ToTable("Word");

                entity.HasKey(e => e.Id);

                entity.Property(e => e.CreateDate)
                    .HasColumnName("CreateDate");

                entity.Property(e => e.Id)
                    .HasColumnName("Id");

                entity.Property(e => e.IsActive)
                    .HasColumnName("IsActive");

                entity.Property(e => e.KeyWord)
                   .HasColumnName("KeyWord")
                   .HasMaxLength(10);

                entity.Property(e => e.UpdateDate)
                    .HasColumnName("UpdateDate");

                entity.Property(e => e.ValueWord)
                   .HasColumnName("ValueWord")
                   .HasMaxLength(10);
            });

            builder.Entity<WordCategory>(entity =>
            {
                entity.ToTable("WordCategory");

                entity.HasKey(e => e.Id);

                entity.Property(e => e.WordId)
                    .HasColumnName("WordId");

                entity.Property(e => e.CategoryId)
                    .HasColumnName("CategoryId");

                entity.HasOne(e => e.Word)
                    .WithMany(e => e.WordCategories)
                    .HasForeignKey(e => e.WordId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.Category)
                    .WithMany(e => e.WordCategories)
                    .HasForeignKey(e => e.CategoryId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            base.OnModelCreating(builder);
        }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = new CancellationToken())
        {
            var auditDate = DateTime.Now;
            foreach (var entry in ChangeTracker.Entries<BaseEntity>())
            {
                switch (entry.State)
                {
                    case EntityState.Added:
                        entry.Entity.CreateDate = auditDate;
                        entry.Entity.UpdateDate = auditDate;
                        entry.Entity.IsActive = true;
                        break;
                    case EntityState.Modified:
                        entry.Entity.UpdateDate = auditDate;
                        break;
                }
            }
            return base.SaveChangesAsync(cancellationToken);
        }
    }
}
