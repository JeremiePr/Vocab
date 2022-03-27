using System.Collections.Generic;
using System.Threading.Tasks;
using Vocab.Api.Models;

namespace Vocab.Api.Data
{
    public interface IWordRepository
    {
        Task<Word> Create(Word word);
        Task Delete(int id);
        Task<List<Word>> Get(string search);
        Task<Word> GetOneById(int id);
        Task<Word> Update(Word word);
    }
}