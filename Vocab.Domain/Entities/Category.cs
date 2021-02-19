using System.Collections.Generic;
using Vocab.Domain.Common;

namespace Vocab.Domain.Entities
{
    public class Category : BaseEntity
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public int? ParentId { get; set; }
        public Category Parent { get; set; }
        public ICollection<Category> Children { get; set; }
        public ICollection<WordCategory> WordCategories { get; set; }
    }
}
