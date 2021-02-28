using System.Collections.Generic;
using System.Threading.Tasks;
using Vocab.Domain.Entities;
using Vocab.Domain.ViewModels;

namespace Vocab.Application.Contracts.Application
{
    public interface IWordService
    {
        Task<List<WordVM>> GetAll();
        Task<WordVM> GetOneById(int id);
        Task<WordVM> GetOneRandomly(List<int> categoryIds, bool onlyPinned);
        Task<List<WordVM>> Get(List<int> categoryIds, string inputKeyword, string inputTranslation, bool onlyPinned);
        Task<Word> Create(Word word);
        Task<Word> Update(Word word);
        Task UpdateCategories(int id, List<int> categoryIds);
        Task Delete(int wordId);
    }
}
