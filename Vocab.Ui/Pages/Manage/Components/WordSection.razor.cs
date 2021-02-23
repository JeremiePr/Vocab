using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Vocab.Domain.Entities;
using Vocab.Domain.ViewModels;
using Vocab.Ui.Services;

namespace Vocab.Ui.Pages.Manage.Components
{
    public partial class WordSection : ComponentBase
    {
        [Parameter] public EventCallback OnCategoryReloadRequest { get; set; }
        [Inject] public IWordService WordService { get; set; }
        [Inject] public ICategoryService CategoryService { get; set; }
        [Inject] public IJSRuntime JSRuntime { get; set; }

        private bool _isComponentLoaded = false;
        private List<WordVM> _words = new List<WordVM>();
        private List<CategoryVM> _categories = new List<CategoryVM>();
        private string _inputWordKey = "";
        private string _inputWordValue = "";
        private int _inputWordCategory = 0;
        private Word _wordEdit = new Word();
        private int _wordEditInitialCategory = 0;
        private WordEditModal _wordEditModal = null;

        protected override async Task OnAfterRenderAsync(bool firstRender)
        {
            if (!firstRender) return;
            await LoadCategories();
            await LoadWords();
            _isComponentLoaded = true;
            StateHasChanged();
            await ReloadJavascript();
        }

        public async Task Refresh()
        {
            await LoadCategories();
            await LoadWords();
        }

        private async Task LoadCategories()
        {
            _categories = await CategoryService.Get();
        }

        private async Task LoadWords()
        {
            _words = await WordService.Get(new List<int>(), "", "");
        }

        private bool IsWordMatchingFilter(WordVM word)
        {
            return
                word.Word.KeyWord.ToLower().StartsWith(_inputWordKey.ToLower()) &&
                word.Word.ValueWord.ToLower().Contains(_inputWordValue.ToLower()) &&
                (_inputWordCategory == 0 || word.Categories.Any(x => x.Id == _inputWordCategory));
        }

        private async Task OnWordAdd()
        {
            var word = await WordService.Create(_wordEdit);
            await WordService.UpdateCategories(new WordCategoryVM { WordId = word.Id, CategoryIds = new List<int> { _wordEditInitialCategory } });
            _wordEdit = new Word();
            _wordEditInitialCategory = 0;
            await LoadWords();
            await OnCategoryReloadRequest.InvokeAsync();
            StateHasChanged();
        }

        private async Task OnWordEdit(WordVM word)
        {
            _ = await WordService.Update(word.Word);
            await WordService.UpdateCategories(new WordCategoryVM { WordId = word.Word.Id, CategoryIds = word.Categories.Select(x => x.Id).ToList() });
            await LoadWords();
            await OnCategoryReloadRequest.InvokeAsync();
            StateHasChanged();
        }

        private async Task OnWordDelete(WordVM word)
        {
            await WordService.Delete(word.Word.Id);
            await LoadWords();
            await OnCategoryReloadRequest.InvokeAsync();
            StateHasChanged();
        }

        private async Task ReloadJavascript()
        {
            await JSRuntime.InvokeVoidAsync("initializeDropdowns", new List<string> { "#word_initial_category" });
        }

        private static string GetWordCategoriesToString(WordVM word) => string.Join(", ", word.Categories.Select(x => x.Title));
    }
}
