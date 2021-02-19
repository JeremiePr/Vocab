using Vocab.Domain.Entities;

namespace Vocab.Ui.Models
{
    public class Game
    {
        public bool IsFilteredByCategory { get; set; }
        public Category Category { get; set; }
        public bool IsReverse { get; set; }
    }
}
