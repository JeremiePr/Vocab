using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Vocab.Application.Contracts.Persistence;
using Vocab.Domain.Entities;

namespace Vocab.Persistence.Repositories
{
    public class CategoryRepository : ICategoryRepository
    {
        private readonly VocabContext _context;

        public CategoryRepository(VocabContext context)
        {
            _context = context;
        }

        public Task<List<Category>> GetAll()
        {
            return _context.Categories
                .Where(x => x.IsActive)
                .OrderBy(x => x.Title)
                .ToListAsync();
        }

        public Task<Category> GetOneById(int id)
        {
            return _context.Categories
                .FirstOrDefaultAsync(x => x.Id == id);
        }

        public Task<List<Category>> GetByWordId(int wordId)
        {
            return _context.Categories
                .Where(x => x.IsActive)
                .Where(x => x.WordCategories.Any(y => y.WordId == wordId))
                .OrderBy(x => x.Title)
                .ToListAsync();
        }

        public async Task<Category> Create(Category category)
        {
            _context.Categories.Add(category);
            await _context.SaveChangesAsync();
            return category;
        }

        public async Task<Category> Update(Category category)
        {
            _context.Categories.Attach(category);
            _context.Entry(category).Property(x => x.Title).IsModified = true;
            await _context.SaveChangesAsync();
            return category;
        }

        public async Task Delete(int categoryId)
        {
            foreach (var relation in _context.WordCategories.Where(x => x.CategoryId == categoryId))
            {
                _context.WordCategories.Remove(relation);
            }
            var category = new Category { Id = categoryId, IsActive = false };
            _context.Categories.Attach(category);
            _context.Entry(category).Property(x => x.IsActive).IsModified = true;
            await _context.SaveChangesAsync();
        }
    }
}
