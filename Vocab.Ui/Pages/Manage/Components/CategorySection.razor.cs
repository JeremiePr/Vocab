using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;
using System.Collections.Generic;
using System.Threading.Tasks;
using Vocab.Domain.Entities;
using Vocab.Domain.ViewModels;
using Vocab.Ui.Services;

namespace Vocab.Ui.Pages.Manage.Components
{
    public partial class CategorySection : ComponentBase
    {
        [Parameter] public EventCallback OnCategoryReloadRequest { get; set; }
        [Inject] public ICategoryService CategoryService { get; set; }
        [Inject] public IJSRuntime JSRuntime { get; set; }

        private bool _isComponentLoaded = false;
        private List<CategoryVM> _categories = new List<CategoryVM>();
        private string _inputCategoryTitle = "";
        private Category _categoryEdit = new Category();
        private CategoryEditModal _categoryEditModal = null;

        protected override async Task OnAfterRenderAsync(bool firstRender)
        {
            if (!firstRender) return;
            await LoadCategories();
            _isComponentLoaded = true;
            StateHasChanged();
            await ReloadJavascript();
        }

        public async Task Refresh()
        {
            await LoadCategories();
        }

        private async Task LoadCategories()
        {
            _categories = await CategoryService.Get();
        }

        private bool IsCategoryMatchingFilter(CategoryVM category)
        {
            return category.Category.Title.ToLower().StartsWith(_inputCategoryTitle.ToLower());
        }

        private async Task OnCategoryAdd()
        {
            _ = await CategoryService.Create(_categoryEdit);
            _categoryEdit = new Category();
            await LoadCategories();
            await OnCategoryReloadRequest.InvokeAsync();
            StateHasChanged();
            await ReloadJavascript();
        }

        private async Task OnCategoryEdit(Category category)
        {
            _ = await CategoryService.Update(category);
            await LoadCategories();
            await OnCategoryReloadRequest.InvokeAsync();
            StateHasChanged();
            await ReloadJavascript();
        }

        private async Task OnCategoryDelete(Category category)
        {
            await CategoryService.Delete(category.Id);
            await LoadCategories();
            await OnCategoryReloadRequest.InvokeAsync();
            StateHasChanged();
            await ReloadJavascript();
        }

        private async Task ReloadJavascript()
        {
            await JSRuntime.InvokeVoidAsync("initializeDropdowns", new List<string> { "#word_initial_category" });
        }
    }
}
