using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Vocab.Application.Contracts.Application;
using Vocab.Domain.Entities;
using Vocab.Domain.ViewModels;

namespace Vocab.Api.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class WordController : ControllerBase
    {
        private readonly IWordService _service;

        public WordController(IWordService service)
        {
            _service = service;
        }

        [HttpGet("All")]
        public async Task<ActionResult<List<WordVM>>> GetAll()
        {
            try
            {
                var word = await _service.GetAll();
                return new ActionResult<List<WordVM>>(word);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<WordVM>> GetOneById(int id)
        {
            try
            {
                var word = await _service.GetOneById(id);
                return new ActionResult<WordVM>(word);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpGet("Random")]
        public async Task<ActionResult<WordVM>> GetOneRandomly(string categoryIds, bool? onlyPinned)
        {
            try
            {
                categoryIds ??= string.Empty;
                var list = categoryIds.Split(",").Where(x => int.TryParse(x, out _)).Select(x => int.Parse(x)).ToList();
                var word = await _service.GetOneRandomly(list, onlyPinned ?? false);
                return new ActionResult<WordVM>(word);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpGet("")]
        public async Task<ActionResult<List<WordVM>>> Get(string categoryIds, string inputKeyword, string inputTranslation, bool? onlyPinned)
        {
            try
            {
                categoryIds ??= string.Empty;
                inputKeyword ??= string.Empty;
                inputTranslation ??= string.Empty;
                var list = categoryIds.Split(",").Where(x => int.TryParse(x, out _)).Select(x => int.Parse(x)).ToList();
                var words = await _service.Get(list, inputKeyword, inputTranslation, onlyPinned ?? false);
                return new ActionResult<List<WordVM>>(words);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpPost("")]
        public async Task<ActionResult<Word>> Create([FromBody]Word word)
        {
            try
            {
                word = await _service.Create(word);
                return new ActionResult<Word>(word);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpPut("")]
        public async Task<ActionResult<Word>> Update([FromBody]Word word)
        {
            try
            {
                word = await _service.Update(word);
                return new ActionResult<Word>(word);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpPut("Categories")]
        public async Task<ActionResult> UpdateCategories([FromBody]WordCategoryVM vm)
        {
            try
            {
                await _service.UpdateCategories(vm.WordId, vm.CategoryIds);
                return new EmptyResult();
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<Word>> Delete(int id)
        {
            try
            {
                await _service.Delete(id);
                return new EmptyResult();
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }
    }
}
