using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Vocab.Ui.Models;
using Vocab.Ui.Models.Enums;
using Vocab.Ui.Services;

namespace Vocab.Ui.Pages.Play.Components
{
    public partial class GameConfiguration : ComponentBase
    {
        [Parameter] public EventCallback<GameSettings> OnCategoryPickSubmit { get; set; }

        private bool _isComponentLoaded = false;
        private List<CategoryItem> _categoryItems = new List<CategoryItem>();
        private string _inputTitle = "";
        private bool _loopRetry;
        private int _direction = (int)WordDirections.Forward;

        private readonly ICategoryService _categoryService;
        private readonly IJSRuntime _jsRuntime;

        public GameConfiguration(ICategoryService categoryService, IJSRuntime jsRuntime)
        {
            _categoryService = categoryService;
            _jsRuntime = jsRuntime;
        }

        protected override async Task OnAfterRenderAsync(bool firstRender)
        {
            if (!firstRender) return;
            var categories = await _categoryService.Get();
            _categoryItems = categories.Select(x => new CategoryItem { CategoryVM = x, IsPicked = false }).ToList();
            _isComponentLoaded = true;
            StateHasChanged();
            await _jsRuntime.InvokeVoidAsync("initializeModals", new List<string> { "#modal_play_validation" });
            await _jsRuntime.InvokeVoidAsync("initializeDropdowns", new List<string> { "#dropdown_direction" });
        }

        private bool CanPlay() => _categoryItems
            .Where(x => x.IsPicked)
            .Sum(x => x.CategoryVM.WordCount) > 0;

        private void SelectOrDeselectAllCategories(bool isPicked)
        {
            foreach (var item in _categoryItems)
            {
                item.IsPicked = isPicked;
            }
        }

        private async Task OpenPlayValidationModal()
        {
            await _jsRuntime.InvokeVoidAsync("openModal", "#modal_play_validation");
            StateHasChanged();
        }

        private bool IsCategoryItemMatchingFilter(CategoryItem item)
        {
            return item.CategoryVM.Category.Title.ToLower().StartsWith(_inputTitle.ToLower());
        }

        private async Task OnPlayClick()
        {
            var categoryIds = _categoryItems.Where(x => x.IsPicked).Select(x => x.CategoryVM.Category.Id).ToList();
            await OnCategoryPickSubmit.InvokeAsync(new GameSettings
            {
                CategoryIds = categoryIds,
                WordDirection = (WordDirections)_direction,
                LoopRetry = _loopRetry
            });
        }
    }
}
