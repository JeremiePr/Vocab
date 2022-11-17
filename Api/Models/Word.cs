namespace Api.Models;

public class Word
{
    public int Id { get; set; }
    public string Key { get; set; }
    public string Value { get; set; }
    public string Notes { get; set; }
    public int Importancy { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreateDate { get; set; }
    public DateTime UpdateDate { get; set; }

    public Word()
    {
        Key = string.Empty;
        Value = string.Empty;
        Notes = string.Empty;
    }
}
