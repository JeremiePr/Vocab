namespace Vocab.Domain.Entities
{
    public class WordCategory
    {
        public int Id { get; set; }
        public int WordId { get; set; }
        public int CategoryId { get; set; }
        public Word Word { get; set; }
        public Category Category { get; set; }
    }
}
