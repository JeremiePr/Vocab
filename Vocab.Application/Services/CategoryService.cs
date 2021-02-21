using System.Collections.Generic;
using System.Threading.Tasks;
using Vocab.Application.Contracts.Application;
using Vocab.Application.Contracts.Persistence;
using Vocab.Domain.Entities;
using Vocab.Domain.ViewModels;

namespace Vocab.Application.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly ICategoryRepository _categoryRepository;
        private readonly IWordRepository _wordRepository;

        public CategoryService(ICategoryRepository categoryRepository, IWordRepository wordRepository)
        {
            _categoryRepository = categoryRepository;
            _wordRepository = wordRepository;
        }

        public async Task<List<CategoryVM>> GetAllWithWordCount()
        {
            var categories = await _categoryRepository.GetAll();
            var items = new List<CategoryVM>();
            foreach (var category in categories)
            {
                var wordCount = await _wordRepository.GetCount(new List<int> { category.Id });
                items.Add(new CategoryVM { Category = category, WordCount = wordCount });
            }
            return items;
        }

        public Task<Category> GetOneById(int id)
        {
            return _categoryRepository.GetOneById(id);
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
