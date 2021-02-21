using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Vocab.Domain.Common;

namespace Vocab.Domain.Entities
{
    public class Word : BaseEntity
    {
        public int Id { get; set; }

        [Required, StringLength(50), MinLength(1)]
        public string KeyWord { get; set; }

        [Required, StringLength(200), MinLength(1)]
        public string ValueWord { get; set; }

        public ICollection<WordCategory> WordCategories { get; set; }
    }
}
