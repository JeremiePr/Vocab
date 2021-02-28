namespace Vocab.Ui.Models
{
    public class GameItem
    {
        public int WordId { get; set; }
        public string Question { get; set; }
        public string Answer { get; set; }
        public bool IsPinned { get; set; }
    }
}
