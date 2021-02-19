using System.Collections.Generic;
using System.Threading.Tasks;
using Vocab.Domain.Entities;

namespace Vocab.Ui.Services
{
    public interface ICategoryService
    {
        Task<Category> Create(Category category);
        Task Delete(int id);
        Task<List<Category>> Get(int? parentId, string inputTitle);
        Task<List<Category>> GetAll();
        Task<Category> GetOneById(int id);
        Task<Category> Update(Category category);
    }
}