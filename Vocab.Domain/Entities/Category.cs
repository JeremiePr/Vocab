using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Vocab.Domain.Common;

namespace Vocab.Domain.Entities
{
    public class Category : BaseEntity
    {
        public int Id { get; set; }

        [Required, StringLength(50), MinLength(1)]
        public string Title { get; set; }

        public ICollection<WordCategory> WordCategories { get; set; }
    }
}
