using System.Collections.Generic;
using Vocab.Domain.Common;

namespace Vocab.Domain.Entities
{
    public class Word : BaseEntity
    {
        public int Id { get; set; }
        public string KeyWord { get; set; }
        public string ValueWord { get; set; }
        public bool IsPinned { get; set; }
        public ICollection<WordCategory> WordCategories { get; set; }
    }
}
