using Microsoft.AspNetCore.Components;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using Vocab.Domain.Entities;
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

        public Task<List<Category>> GetAll()
        {
            return _http.GetJsonAsync<List<Category>>($"{_apiUrl}/All");
        }

        public Task<Category> GetOneById(int id)
        {
            return _http.GetJsonAsync<Category>($"{_apiUrl}/{id}");
        }

        public Task<List<Category>> Get(int? parentId, string inputTitle)
        {
            return _http.GetJsonAsync<List<Category>>($"{_apiUrl}?parentId={parentId}&inputTitle={inputTitle}");
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
