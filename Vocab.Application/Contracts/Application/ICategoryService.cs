using System.Collections.Generic;
using System.Threading.Tasks;
using Vocab.Domain.Entities;

namespace Vocab.Application.Contracts.Application
{
    public interface ICategoryService
    {
        Task<List<Category>> GetAll();
        Task<Category> GetOneById(int id);
        Task<List<Category>> Get(int? parentId, string inputTitle);
        Task<Category> Create(Category category);
        Task<Category> Update(Category category);
        Task Delete(int categoryId);
    }
}
