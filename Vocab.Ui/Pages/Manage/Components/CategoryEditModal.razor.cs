using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;
using System.Collections.Generic;
using System.Threading.Tasks;
using Vocab.Domain.Entities;

namespace Vocab.Ui.Pages.Manage.Components
{
    public partial class CategoryEditModal : ComponentBase
    {
        [Parameter] public EventCallback<Category> OnCategoryEditSave { get; set; }
        [Parameter] public EventCallback<Category> OnCategoryEditDelete { get; set; }
        [Inject] public IJSRuntime JSRuntime { get; set; }

        private bool _isComponentLoaded = false;
        private Category _category = new Category();

        protected override async Task OnAfterRenderAsync(bool firstRender)
        {
            if (!firstRender) return;
            _isComponentLoaded = true;
            StateHasChanged();
            await JSRuntime.InvokeVoidAsync("initializeModals", new List<string> { "#modal_category_edit" });
        }

        public async Task Open(Category category)
        {
            _category = new Category
            {
                Id = category.Id,
                IsActive = category.IsActive,
                Title = category.Title
            };
            await JSRuntime.InvokeVoidAsync("openModal", "#modal_category_edit");
        }

        private async Task OnSaveClick()
        {
            await OnCategoryEditSave.InvokeAsync(_category);
        }

        private async Task OnDeleteClick()
        {
            await OnCategoryEditDelete.InvokeAsync(_category);
        }
    }
}
