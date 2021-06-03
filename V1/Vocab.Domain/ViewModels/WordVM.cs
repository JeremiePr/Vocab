using System.Collections.Generic;
using Vocab.Domain.Entities;

namespace Vocab.Domain.ViewModels
{
    public class WordVM
    {
        public Word Word { get; set; }
        public List<Category> Categories { get; set; }
    }
}
