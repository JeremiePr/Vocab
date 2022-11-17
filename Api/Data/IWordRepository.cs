using Api.Models;

namespace Api.Data;
public interface IWordRepository
{
    Task<Word> Create(Word word);
    Task Delete(int id);
    Task<List<Word>> Get(string search);
    Task<Word?> GetOneById(int id);
    Task<Word> Update(Word word);
}