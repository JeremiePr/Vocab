using Microsoft.AspNetCore.Components;
using System.Collections.Generic;
using Vocab.Ui.Models;
using Vocab.Ui.Models.Enums;

namespace Vocab.Ui.Pages.Play
{
    [Route("/play")]
    [Route("/play/{DefaultFlag}")]
    public partial class Play
    {
        [Parameter] public string DefaultFlag { get; set; }

        private bool _isPageLoaded = false;
        private bool _hasGameStarted = false;
        private GameSettings _settings = new GameSettings { CategoryIds = new List<int>(), WordDirection = WordDirections.Forward };

        protected override void OnAfterRender(bool firstRender)
        {
            if (!firstRender) return;
            if (DefaultFlag == "Default")
            {
                _settings = new GameSettings { CategoryIds = new List<int>(), LoopRetry = false, WordDirection = WordDirections.All };
                _hasGameStarted = true;
            }
            _isPageLoaded = true;
            StateHasChanged();
        }

        private void OnCategoryPickSubmit(GameSettings settings)
        {
            this._settings = settings;
            _hasGameStarted = true;
        }

        private void OnGameEnded()
        {
            _hasGameStarted = false;
        }
    }
}
