using Microsoft.AspNetCore.Components;
using System.Threading.Tasks;
using Vocab.Ui.Pages.Manage.Components;

namespace Vocab.Ui.Pages.Manage
{
    [Route("/manage")]
    public partial class Manage : ComponentBase
    {
        private CategorySection _categorySection = null;
        private WordSection _wordSection = null;

        private Task RefreshCategorySection() => _categorySection.Refresh();

        private Task RefreshWordSection() => _wordSection.Refresh();
    }
}
