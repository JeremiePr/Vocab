using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Vocab.Domain.Entities;
using Vocab.Domain.ViewModels;
using Vocab.Ui.Models;
using Vocab.Ui.Models.Enums;
using Vocab.Ui.Services;

namespace Vocab.Ui.Pages.Play.Components
{
    public partial class GamePlay : ComponentBase
    {
        [Parameter] public GameSettings Settings { get; set; }
        [Parameter] public bool AllCategories { get; set; }
        [Parameter] public EventCallback OnGameEnded { get; set; }
        [Inject] public IWordService WordService { get; set; }

        private bool _isComponentLoaded = false;
        private List<GameItem> _items = new List<GameItem>();
        private int _index = 0;
        private bool _isWordHidden = true;

        protected override async Task OnAfterRenderAsync(bool firstRender)
        {
            if (!firstRender) return;
            await LoadWords();
            _isComponentLoaded = true;
            StateHasChanged();
        }

        private async Task LoadWords()
        {
            _index = 0;
            _isWordHidden = true;

            var words = await WordService.Get(Settings.CategoryIds, string.Empty, string.Empty, onlyPinned: Settings.OnlyPinned);

            if (!words.Any())
                await OnListEnding();

            var collection = Settings.WordDirection switch
            {
                WordDirections.Forward => words.Select(x => new GameItem { WordId = x.Word.Id, Question = x.Word.KeyWord, Answer = x.Word.ValueWord, IsPinned = x.Word.IsPinned }),
                WordDirections.Backward => words.Select(x => new GameItem { WordId = x.Word.Id, Question = x.Word.ValueWord, Answer = x.Word.KeyWord, IsPinned = x.Word.IsPinned }),
                WordDirections.All => words.Select(x => new GameItem { WordId = x.Word.Id, Question = x.Word.KeyWord, Answer = x.Word.ValueWord, IsPinned = x.Word.IsPinned })
                    .Concat(words.Select(x => new GameItem { WordId = x.Word.Id, Question = x.Word.ValueWord, Answer = x.Word.KeyWord, IsPinned = x.Word.IsPinned })),
                _ => throw new Exception($"Expected a valid value from type '{nameof(WordDirections)}'")
            };

            var random = new Random();

            _items = collection.OrderBy(x => random.Next()).ToList();
        }

        private async Task OnNextClick()
        {
            _index++;
            _isWordHidden = true;
            if (_index == _items.Count)
            {
                await OnListEnding();
            }
        }

        private async Task OnListEnding()
        {
            if (Settings.LoopRetry)
            {
                _index = 0;
                var random = new Random();
                _items = _items.OrderBy(x => random.Next()).ToList();
            }
            else
            {
                await OnGameEnded.InvokeAsync();
            }
        }

        private async Task OnPinClick(int wordId)
        {
            var word = (await WordService.GetOneById(wordId)).Word;
            word.IsPinned = !word.IsPinned;
            _ = await WordService.Update(word);
            _items[_index].IsPinned = word.IsPinned;
            StateHasChanged();
        }
    }
}
