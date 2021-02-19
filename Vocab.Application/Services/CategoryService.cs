using System.Collections.Generic;
using System.Threading.Tasks;
using Vocab.Application.Contracts.Application;
using Vocab.Application.Contracts.Persistence;
using Vocab.Domain.Entities;

namespace Vocab.Application.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly ICategoryRepository _categoryRepository;

        public CategoryService(ICategoryRepository categoryRepository)
        {
            _categoryRepository = categoryRepository;
        }

        public Task<List<Category>> GetAll()
        {
            return _categoryRepository.GetAll();
        }

        public Task<Category> GetOneById(int id)
        {
            return _categoryRepository.GetOneById(id);
        }

        public Task<List<Category>> Get(int? parentId, string inputTitle)
        {
            return _categoryRepository.Get(parentId, inputTitle);
        }

        public Task<Category> Create(Category category)
        {
            return _categoryRepository.Create(category);
        }

        public Task<Category> Update(Category category)
        {
            return _categoryRepository.Update(category);
        }

        public Task Delete(int categoryId)
        {
            return _categoryRepository.Delete(categoryId);
        }
    }
}
