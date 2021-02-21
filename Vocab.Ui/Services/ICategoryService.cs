using System.Collections.Generic;
using System.Threading.Tasks;
using Vocab.Domain.Entities;
using Vocab.Domain.ViewModels;

namespace Vocab.Ui.Services
{
    public interface ICategoryService
    {
        Task<Category> Create(Category category);
        Task Delete(int id);
        Task<List<CategoryVM>> Get();
        Task<Category> GetOneById(int id);
        Task<Category> Update(Category category);
    }
}