using System;
using System.Collections.Generic;
using System.Text;

namespace Vocab.Domain.ViewModels
{
    public class WordCategoryVM
    {
        public int WordId { get; set; }
        public List<int> CategoryIds { get; set; }
    }
}
