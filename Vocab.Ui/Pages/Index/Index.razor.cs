using Microsoft.AspNetCore.Components;

namespace Vocab.Ui.Pages.Index
{
    [Route("/")]
    public partial class Index : ComponentBase
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