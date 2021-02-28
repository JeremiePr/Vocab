using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Vocab.Application.Contracts.Persistence;
using Vocab.Domain.Entities;

namespace Vocab.Persistence.Repositories
{
    public class WordRepository : IWordRepository
    {
        private readonly VocabContext _context;

        public WordRepository(VocabContext context)
        {
            _context = context;
        }

        public Task<List<Word>> GetAll()
        {
            return _context.Words
                .Where(x => x.IsActive)
                .OrderBy(x => x.KeyWord)
                .ToListAsync();
        }

        public Task<Word> GetOneById(int id)
        {
            return _context.Words
                .FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<Word> GetOneRandomly(List<int> categoryIds, bool onlyPinned)
        {
            var random = new Random();
            return await _context.Words
                .Where(x => x.IsActive)
                .Where(x => !onlyPinned || x.IsPinned)
                .Where(x => !categoryIds.Any() || x.WordCategories.Any(y => categoryIds.Contains(y.CategoryId)))
                .OrderBy(x => random.Next())
                .Take(1)
                .FirstOrDefaultAsync();
        }

        public Task<List<Word>> Get(List<int> categoryIds, string inputKeyWord, string inputValueWord, bool onlyPinned)
        {
            return _context.Words
                .Where(x => x.IsActive)
                .Where(x => !onlyPinned || x.IsPinned)
                .Where(x => !categoryIds.Any() || x.WordCategories.Any(y => categoryIds.Contains(y.CategoryId)))
                .Where(x => x.KeyWord.StartsWith(inputKeyWord))
                .Where(x => x.ValueWord.Contains(inputValueWord))
                .OrderBy(x => x.KeyWord)
                .ToListAsync();
        }

        public Task<int> GetCount(List<int> categoryIds, bool onlyPinned)
        {
            return _context.Words
                .Where(x => x.IsActive)
                .Where(x => !onlyPinned || x.IsPinned)
                .Where(x => !categoryIds.Any() || x.WordCategories.Any(y => categoryIds.Contains(y.CategoryId)))
                .CountAsync();
        }

        public async Task<Word> Create(Word word)
        {
            _context.Words.Add(word);
            await _context.SaveChangesAsync();
            return word;
        }

        public async Task<Word> Update(Word word)
        {
            _context.Words.Attach(word);
            _context.Entry(word).Property(x => x.KeyWord).IsModified = true;
            _context.Entry(word).Property(x => x.ValueWord).IsModified = true;
            _context.Entry(word).Property(x => x.IsPinned).IsModified = true;
            await _context.SaveChangesAsync();
            return word;
        }

        public async Task UpdateCategories(int id, List<int> categoryIds)
        {
            foreach (var relation in _context.WordCategories.Where(x => x.WordId == id))
            {
                _context.WordCategories.Remove(relation);
            }
            foreach (var categoryId in categoryIds)
            {
                _context.WordCategories.Add(new WordCategory { WordId = id, CategoryId = categoryId });
            }
            await _context.SaveChangesAsync();
        }

        public async Task Delete(int wordId)
        {
            foreach (var relation in _context.WordCategories.Where(x => x.WordId == wordId))
            {
                _context.WordCategories.Remove(relation);
            }
            var word = new Word { Id = wordId, IsActive = false, IsPinned = false };
            _context.Words.Attach(word);
            _context.Entry(word).Property(x => x.IsActive).IsModified = true;
            _context.Entry(word).Property(x => x.IsPinned).IsModified = true;
            await _context.SaveChangesAsync();
        }
    }
}
