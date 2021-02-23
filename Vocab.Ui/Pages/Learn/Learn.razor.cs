using Microsoft.AspNetCore.Components;

namespace Vocab.Ui.Pages.Learn
{
    [Route("/learn")]
    public partial class Learn : ComponentBase
    {
        private bool _isPageLoaded = false;

        protected override void OnAfterRender(bool firstRender)
        {
            if (!firstRender) return;
            _isPageLoaded = true;
            StateHasChanged();
        }
    }
}
