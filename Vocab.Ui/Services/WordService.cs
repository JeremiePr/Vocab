using Microsoft.AspNetCore.Components;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using Vocab.Domain.Entities;
using Vocab.Domain.ViewModels;
using Vocab.Ui.Common;

namespace Vocab.Ui.Services
{
    public class WordService : IWordService
    {
        private const string ApiControllerRoute = "Word";

        private readonly HttpClient _http;
        private readonly string _apiUrl;

        public WordService(HttpClient http, IAppEnvironment appEnvironment)
        {
            _http = http;
            _apiUrl = appEnvironment.ApiUrl + ApiControllerRoute;
        }

        public Task<List<Word>> GetAll()
        {
            return _http.GetJsonAsync<List<Word>>($"{_apiUrl}/All");
        }

        public Task<Word> GetOneById(int id)
        {
            return _http.GetJsonAsync<Word>($"{_apiUrl}/{id}");
        }

        public Task<Word> GetOneRandomly(List<int> categoryIds)
        {
            return _http.GetJsonAsync<Word>(
                $"{_apiUrl}/Random?categoryIds={string.Join(",", categoryIds)}");
        }

        public Task<List<Word>> Get(List<int> categoryIds, string inputKeyword, string inputTranslation)
        {
            return _http.GetJsonAsync<List<Word>>(
                $"{_apiUrl}?categoryIds={string.Join(",", categoryIds)}&inputKeyword={inputKeyword}&inputTranslation={inputTranslation}");
        }

        public Task<Word> Create(Word word)
        {
            return _http.PostJsonAsync<Word>(_apiUrl, word);
        }

        public Task<Word> Update(Word word)
        {
            return _http.PutJsonAsync<Word>(_apiUrl, word);
        }

        public Task UpdateCategories(WordCategoryVM wordCategoryVM)
        {
            return _http.PutJsonAsync($"{_apiUrl}/Categories", wordCategoryVM);
        }

        public Task Delete(int id)
        {
            return _http.DeleteAsync($"{_apiUrl}/{id}");
        }
    }
}
