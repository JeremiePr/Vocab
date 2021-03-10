using System.Collections.Generic;
using Vocab.Domain.Common;

namespace Vocab.Domain.Entities
{
    public class Category : BaseEntity
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public bool IsDefault { get; set; }
        public ICollection<WordCategory> WordCategories { get; set; }
    }
}
