using System.Collections.Generic;
using System.Threading.Tasks;
using Vocab.Domain.Entities;
using Vocab.Domain.ViewModels;

namespace Vocab.Application.Contracts.Application
{
    public interface ICategoryService
    {
        Task<List<CategoryVM>> GetAllWithWordCount();
        Task<Category> GetOneById(int id);
        Task<Category> Create(Category category);
        Task<Category> Update(Category category);
        Task Delete(int categoryId);
    }
}
