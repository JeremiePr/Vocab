using System;

namespace Vocab.Domain.Common
{
    public class BaseEntity
    {
        public bool IsActive { get; set; }
        public DateTime CreateDate { get; set; }
        public DateTime UpdateDate { get; set; }
    }
}
