using System.Collections.Generic;
using Vocab.Ui.Models.Enums;

namespace Vocab.Ui.Models
{
    public class GameSettings
    {
        public List<int> CategoryIds { get; set; }
        public WordDirections WordDirection { get; set; }
        public bool LoopRetry { get; set; }
        public bool OnlyPinned { get; set; }
    }
}
