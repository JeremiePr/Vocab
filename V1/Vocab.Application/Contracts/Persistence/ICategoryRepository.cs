using System.Collections.Generic;
using System.Threading.Tasks;
using Vocab.Domain.Entities;

namespace Vocab.Application.Contracts.Persistence
{
    public interface ICategoryRepository
    {
        Task<List<Category>> GetAll();
        Task<Category> GetOneById(int id);
        Task<List<Category>> GetByWordId(int wordId);
        Task<Category> Create(Category category);
        Task<Category> Update(Category category);
        Task Delete(int categoryId);
    }
}
