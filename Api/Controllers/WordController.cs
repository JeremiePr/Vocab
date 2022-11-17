using Api.Data;
using Api.Models;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WordController : ControllerBase
{
    private readonly IWordRepository _repository;

    public WordController(IWordRepository repository) => _repository = repository;

    [HttpGet]
    public async Task<ActionResult> Get(string? search)
    {
        return Ok(await _repository.Get(search ?? string.Empty));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult> GetOneById(int id)
    {
        return Ok(await _repository.GetOneById(id));
    }

    [HttpPost]
    public async Task<ActionResult> Create([FromBody] Word word)
    {
        return Ok(await _repository.Create(word));
    }

    [HttpPut]
    public async Task<ActionResult> Update([FromBody] Word word)
    {
        return Ok(await _repository.Update(word));
    }

    [HttpDelete]
    public async Task<ActionResult> Delete(int id)
    {
        await _repository.Delete(id);
        return NoContent();
    }
}
