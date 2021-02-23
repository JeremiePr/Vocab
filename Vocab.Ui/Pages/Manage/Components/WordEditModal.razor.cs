using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Vocab.Domain.Entities;
using Vocab.Domain.ViewModels;

namespace Vocab.Ui.Pages.Manage.Components
{
    public partial class WordEditModal : ComponentBase
    {
        [Parameter] public List<CategoryVM> Categories { get; set; } = new List<CategoryVM>();
        [Parameter] public EventCallback<WordVM> OnWordEditSave { get; set; }
        [Parameter] public EventCallback<WordVM> OnWordEditDelete { get; set; }
        [Inject] public IJSRuntime JSRuntime { get; set; }

        public int WordCategoryId
        {
            get => _wordCategoryId;
            set
            {
                _wordCategoryId = value;
                _ = OnCategoryClick();
            }
        }

        private int _wordCategoryId = 0;
        private bool _isComponentLoaded = false;
        private WordVM _word = new WordVM { Word = new Word(), Categories = new List<Category>() };

        protected override async Task OnAfterRenderAsync(bool firstRender)
        {
            if (!firstRender) return;
            _isComponentLoaded = true;
            StateHasChanged();
            await JSRuntime.InvokeVoidAsync("initializeModals", new List<string> { "#modal_word_edit" });
            await JSRuntime.InvokeVoidAsync("initializeDropdowns", new List<string> { "#word_category" });
        }

        public async Task Open(WordVM word)
        {
            this._word = new WordVM
            {
                Word = new Word
                {
                    Id = word.Word.Id,
                    IsActive = word.Word.IsActive,
                    KeyWord = word.Word.KeyWord,
                    ValueWord = word.Word.ValueWord
                },
                Categories = word.Categories.Select(x => new Category { Id = x.Id, IsActive = x.IsActive, Title = x.Title }).ToList()
            };
            _wordCategoryId = 0;
            StateHasChanged();
            await JSRuntime.InvokeVoidAsync("openModal", "#modal_word_edit");
            await JSRuntime.InvokeVoidAsync("initializeDropdowns", new List<string> { "#word_category" });
        }

        private async Task OnCategoryClick()
        {
            if (_wordCategoryId == 0 || _word.Categories.Any(x => x.Id == _wordCategoryId)) return;
            var category = Categories.FirstOrDefault(x => x.Category.Id == _wordCategoryId)?.Category;
            if (category == null) return;
            _word.Categories.Add(category);
            _wordCategoryId = 0;
            StateHasChanged();
            await JSRuntime.InvokeVoidAsync("initializeDropdowns", new List<string> { "#word_category" });
        }

        private void OnCategoryRemoveClick(Category category)
        {
            _word.Categories = _word.Categories.Where(x => x.Id != category.Id).ToList();
            StateHasChanged();
        }

        private async Task OnSaveClick()
        {
            await OnWordEditSave.InvokeAsync(_word);
        }

        private async Task OnDeleteClick()
        {
            await OnWordEditDelete.InvokeAsync(_word);
        }
    }
}
