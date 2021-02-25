using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Vocab.Domain.Entities;
using Vocab.Domain.ViewModels;

namespace Vocab.Ui.Pages.Manage.Components
{
    public partial class WordAddBulkModal : ComponentBase
    {
        [Parameter] public List<CategoryVM> Categories { get; set; } = new List<CategoryVM>();
        [Parameter] public EventCallback<List<WordVM>> OnModalSaveClick { get; set; }
        [Inject] public IJSRuntime JSRuntime { get; set; }

        private bool _isComponentLoaded = false;
        private Word _editWord = new Word { KeyWord = "", ValueWord = "" };
        private string _editWordCategoryInput = "";
        private List<WordVM> _words = new List<WordVM>();

        protected override async Task OnAfterRenderAsync(bool firstRender)
        {
            if (!firstRender) return;
            _isComponentLoaded = true;
            StateHasChanged();
            await JSRuntime.InvokeVoidAsync("initializeModals", new List<string> { "#modal_word_bulk_add" });
        }

        public async Task Open()
        {
            _words = new List<WordVM>();
            _editWord = new Word { KeyWord = "", ValueWord = "" };
            _editWordCategoryInput = "";
            StateHasChanged();
            await JSRuntime.InvokeVoidAsync("openModal", "#modal_word_bulk_add");
        }

        private void OnResetClick()
        {
            _words = new List<WordVM>();
            _editWord = new Word { KeyWord = "", ValueWord = "" };
            _editWordCategoryInput = "";
        }

        private async Task OnAddClick()
        {
            var categories = new List<Category>();
            var isValid = !string.IsNullOrWhiteSpace(_editWord.KeyWord) && !string.IsNullOrWhiteSpace(_editWord.ValueWord);
            if (!isValid) return;
            foreach (var input in _editWordCategoryInput.Split(","))
            {
                var category = Categories.FirstOrDefault(x => x.Category.Title.ToLower().StartsWith(input.Trim().ToLower()));
                if (category == null)
                {
                    isValid = false;
                    break;
                }
                else
                {
                    categories.Add(category.Category);
                }
            }
            if (!isValid) return;
            var tempId = _words.Any() ? _words.Max(x => x.Word.Id) + 1 : 1;
            _words.Add(new WordVM { Word = new Word { Id = tempId,  KeyWord = _editWord.KeyWord, ValueWord = _editWord.ValueWord }, Categories = categories });
            _editWord = new Word { KeyWord = "", ValueWord = "" };
            _editWordCategoryInput = "";
            StateHasChanged();
            await JSRuntime.InvokeVoidAsync("focusElement", "#bulk_word_key");
        }

        private void OnDeleteClick(int tempWordId)
        {

            _words.RemoveAt(_words.FindIndex(x => x.Word.Id == tempWordId));
            StateHasChanged();
        }

        private async Task OnSaveClick()
        {
            await OnModalSaveClick.InvokeAsync(_words);
        }
    }
}
