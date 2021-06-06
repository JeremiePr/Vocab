using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Vocab.Api.Data.Context;
using Vocab.Api.Models;

namespace Vocab.Api.Data
{
    public class WordRepository : IWordRepository
    {
        private readonly VocabContext _context;

        public WordRepository(VocabContext context)
        {
            _context = context;
        }

        public Task<List<Word>> Get(string search)
        {
            return _context.Words
                .Where(e => e.IsActive)
                .Where(e =>
                    string.IsNullOrWhiteSpace(search) ||
                    e.Key.Contains(search) ||
                    e.Value.Contains(search))
                .OrderByDescending(e => e.Importancy)
                .ThenBy(e => e.Key)
                .ToListAsync();
        }

        public Task<Word> GetOneById(int id)
        {
            return _context.Words
                .FirstOrDefaultAsync(e => e.Id == id);
        }

        public async Task<Word> Create(Word word)
        {
            var dateRef = DateTime.Now;
            word.IsActive = true;
            word.CreateDate = dateRef;
            word.UpdateDate = dateRef;
            _context.Words.Add(word);
            await _context.SaveChangesAsync();
            return word;
        }

        public async Task<Word> Update(Word word)
        {
            word.UpdateDate = DateTime.Now;
            _context.Words.Attach(word);
            _context.Entry(word).Property(x => x.Key).IsModified = true;
            _context.Entry(word).Property(x => x.Value).IsModified = true;
            _context.Entry(word).Property(x => x.Importancy).IsModified = true;
            _context.Entry(word).Property(x => x.Notes).IsModified = true;
            await _context.SaveChangesAsync();
            return word;
        }

        public async Task Delete(int id)
        {
            var word = new Word { Id = id, IsActive = false, UpdateDate = DateTime.Now };
            _context.Words.Attach(word);
            _context.Entry(word).Property(x => x.IsActive).IsModified = true;
            await _context.SaveChangesAsync();
        }
    }
}
