using Vocab.Domain.Entities;

namespace Vocab.Domain.ViewModels
{
    public class CategoryVM
    {
        public Category Category { get; set; }
        public int WordCount { get; set; }
        public int WordPinnedCount { get; set; }
    }
}
