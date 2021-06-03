using Microsoft.AspNetCore.Components;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using Vocab.Domain.Entities;
using Vocab.Domain.ViewModels;
using Vocab.Ui.Common;

namespace Vocab.Ui.Services
{
    public class CategoryService : ICategoryService
    {
        private const string ApiControllerRoute = "Category";

        private readonly HttpClient _http;
        private readonly string _apiUrl;

        public CategoryService(HttpClient http, IAppEnvironment appEnvironment)
        {
            _http = http;
            _apiUrl = appEnvironment.ApiUrl + ApiControllerRoute;
        }

        public Task<List<CategoryVM>> Get()
        {
            return _http.GetJsonAsync<List<CategoryVM>>($"{_apiUrl}");
        }

        public Task<Category> GetOneById(int id)
        {
            return _http.GetJsonAsync<Category>($"{_apiUrl}/{id}");
        }

        public Task<Category> Create(Category category)
        {
            return _http.PostJsonAsync<Category>(_apiUrl, category);
        }

        public Task<Category> Update(Category category)
        {
            return _http.PutJsonAsync<Category>(_apiUrl, category);
        }

        public Task Delete(int id)
        {
            return _http.DeleteAsync($"{_apiUrl}/{id}");
        }
    }
}
