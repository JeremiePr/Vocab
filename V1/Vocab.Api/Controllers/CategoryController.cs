﻿using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Vocab.Application.Contracts.Application;
using Vocab.Domain.Entities;
using Vocab.Domain.ViewModels;

namespace Vocab.Api.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryService _service;

        public CategoryController(ICategoryService service)
        {
            _service = service;
        }

        [HttpGet("")]
        public async Task<ActionResult<List<CategoryVM>>> Get()
        {
            try
            {
                var categories = await _service.GetAllWithWordCount();
                return new ActionResult<List<CategoryVM>>(categories);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Category>> GetOneById(int id)
        {
            try
            {
                var category = await _service.GetOneById(id);
                return new ActionResult<Category>(category);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpPost("")]
        public async Task<ActionResult<Category>> Create([FromBody]Category category)
        {
            try
            {
                category = await _service.Create(category);
                return new ActionResult<Category>(category);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpPut("")]
        public async Task<ActionResult<Category>> Update([FromBody]Category category)
        {
            try
            {
                category = await _service.Update(category);
                return new ActionResult<Category>(category);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<Category>> Delete(int id)
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