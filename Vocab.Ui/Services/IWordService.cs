using System.Collections.Generic;
using System.Threading.Tasks;
using Vocab.Domain.Entities;
using Vocab.Domain.ViewModels;

namespace Vocab.Ui.Services
{
    public interface IWordService
    {
        Task<Word> Create(Word word);
        Task Delete(int id);
        Task<List<WordVM>> Get(List<int> categoryIds, string inputKeyword, string inputTranslation);
        Task<List<Word>> GetAll();
        Task<Word> GetOneById(int id);
        Task<Word> GetOneRandomly(List<int> categoryIds);
        Task<Word> Update(Word word);
        Task UpdateCategories(WordCategoryVM wordCategoryVM);
    }
}