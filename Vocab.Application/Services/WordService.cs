using System.Collections.Generic;
using System.Threading.Tasks;
using Vocab.Application.Contracts.Application;
using Vocab.Application.Contracts.Persistence;
using Vocab.Domain.Entities;
using Vocab.Domain.ViewModels;

namespace Vocab.Application.Services
{
    public class WordService : IWordService
    {
        private readonly IWordRepository _wordRepository;
        private readonly ICategoryRepository _categoryRepository;

        public WordService(IWordRepository wordRepository, ICategoryRepository categoryRepository)
        {
            _wordRepository = wordRepository;
            _categoryRepository = categoryRepository;
        }

        public async Task<List<WordVM>> GetAll()
        {
            var vms = new List<WordVM>();
            foreach (var word in await _wordRepository.GetAll())
            {
                var categories = await _categoryRepository.GetByWordId(word.Id);
                vms.Add(new WordVM { Word = word, Categories = categories });
            }
            return vms;
        }

        public async Task<WordVM> GetOneById(int id)
        {
            var word = await _wordRepository.GetOneById(id);
            var categories = await _categoryRepository.GetByWordId(word?.Id ?? 0);
            return new WordVM { Word = word, Categories = categories };
        }

        public async Task<WordVM> GetOneRandomly(List<int> categoryIds)
        {
            var word = await _wordRepository.GetOneRandomly(categoryIds);
            var categories = await _categoryRepository.GetByWordId(word?.Id ?? 0);
            return new WordVM { Word = word, Categories = categories };
        }

        public async Task<List<WordVM>> Get(List<int> categoryIds, string inputKeyword, string inputTranslation)
        {
            var vms = new List<WordVM>();
            foreach (var word in await _wordRepository.Get(categoryIds, inputKeyword, inputTranslation))
            {
                var categories = await _categoryRepository.GetByWordId(word.Id);
                vms.Add(new WordVM { Word = word, Categories = categories });
            }
            return vms;
        }

        public Task<Word> Create(Word word)
        {
            return _wordRepository.Create(word);
        }

        public Task<Word> Update(Word word)
        {
            return _wordRepository.Update(word);
        }

        public Task UpdateCategories(int id, List<int> categoryIds)
        {
            return _wordRepository.UpdateCategories(id, categoryIds);
        }

        public Task Delete(int wordId)
        {
            return _wordRepository.Delete(wordId);
        }
    }
}
