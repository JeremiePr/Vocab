namespace Vocab.Ui.Common
{
    public class AppEnvironment : IAppEnvironment
    {
        public string ApiUrl { get; }

        public AppEnvironment(string apiUrl)
        {
            ApiUrl = apiUrl;
        }
    }
}
