using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Vocab.Domain.Entities;
using Vocab.Domain.ViewModels;
using Vocab.Ui.Pages.Manage.Components;
using Vocab.Ui.Services;

namespace Vocab.Ui.Pages.Manage
{
    [Route("/manage")]
    public partial class Manage : ComponentBase
    {
        [Inject] public IWordService WordService { get; set; }
        [Inject] public ICategoryService CategoryService { get; set; }
        [Inject] public IJSRuntime JSRuntime { get; set; }

        private bool _isPageLoaded = false;
        private List<CategoryVM> _categories = new List<CategoryVM>();
        private string _inputCategoryTitle = "";
        private Category _categoryEdit = new Category();
        private List<WordVM> _words = new List<WordVM>();
        private string _inputWordKey = "";
        private string _inputWordValue = "";
        private int _inputWordCategory = 0;
        private Word _wordEdit = new Word();
        private int _wordEditInitialCategory = 0;
        private CategoryEditModal _categoryEditModal;
        private WordEditModal _wordEditModal;

        protected override async Task OnAfterRenderAsync(bool firstRender)
        {
            if (!firstRender) return;
            _words = await WordService.Get(new List<int>(), "", "");
            _categories = await CategoryService.Get();
            _isPageLoaded = true;
            StateHasChanged();
            await JSRuntime.InvokeVoidAsync("initializeModals", new List<string>());
            await JSRuntime.InvokeVoidAsync("initializeDropdowns", new List<string> { "#word_initial_category" });
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
            _words = await WordService.Get(new List<int>(), "", "");
            _categories = await CategoryService.Get();
            StateHasChanged();
            await JSRuntime.InvokeVoidAsync("initializeDropdowns", new List<string> { "#word_initial_category" });
        }

        private async Task OnWordEdit(WordVM word)
        {
            _ = await WordService.Update(word.Word);
            await WordService.UpdateCategories(new WordCategoryVM { WordId = word.Word.Id, CategoryIds = word.Categories.Select(x => x.Id).ToList() });
            _words = await WordService.Get(new List<int>(), "", "");
            _categories = await CategoryService.Get();
            StateHasChanged();
        }

        private async Task OnWordDelete(WordVM word)
        {
            await WordService.Delete(word.Word.Id);
            _words = await WordService.Get(new List<int>(), "", "");
            _categories = await CategoryService.Get();
            StateHasChanged();
        }

        private bool IsCategoryMatchingFilter(CategoryVM category)
        {
            return category.Category.Title.ToLower().StartsWith(_inputCategoryTitle.ToLower());
        }

        private async Task OnCategoryAdd()
        {
            _ = await CategoryService.Create(_categoryEdit);
            _categoryEdit = new Category();
            _categories = await CategoryService.Get();
            StateHasChanged();
            await JSRuntime.InvokeVoidAsync("initializeDropdowns", new List<string> { "#word_initial_category" });
        }

        private async Task OnCategoryEdit(Category category)
        {
            _ = await CategoryService.Update(category);
            _categories = await CategoryService.Get();
            StateHasChanged();
            await JSRuntime.InvokeVoidAsync("initializeDropdowns", new List<string> { "#word_initial_category" });
        }

        private async Task OnCategoryDelete(Category category)
        {
            await CategoryService.Delete(category.Id);
            _categories = await CategoryService.Get();
            StateHasChanged();
            await JSRuntime.InvokeVoidAsync("initializeDropdowns", new List<string> { "#word_initial_category" });
        }

        private static string GetWordCategoriesToString(WordVM word) => string.Join(", ", word.Categories.Select(x => x.Title));
    }
}
