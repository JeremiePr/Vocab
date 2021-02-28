using System.Collections.Generic;
using System.Threading.Tasks;
using Vocab.Domain.Entities;

namespace Vocab.Application.Contracts.Persistence
{
    public interface IWordRepository
    {
        Task<List<Word>> GetAll();
        Task<Word> GetOneById(int id);
        Task<Word> GetOneRandomly(List<int> categoryIds, bool onlyPinned);
        Task<List<Word>> Get(List<int> categoryIds, string inputKeyword, string inputTranslation, bool onlyPinned);
        Task<int> GetCount(List<int> categoryIds, bool onlyPinned);
        Task<Word> Create(Word word);
        Task<Word> Update(Word word);
        Task UpdateCategories(int id, List<int> categoryIds);
        Task Delete(int wordId);
    }
}
