﻿using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Vocab.Application.Contracts.Persistence;
using Vocab.Persistence.Repositories;

namespace Vocab.Persistence
{
    public static class PersistenceServiceRegistration
    {
        public static IServiceCollection AddPersistenceServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<VocabContext>(options => options.UseSqlServer(configuration.GetConnectionString("VocabConnectionString")));

            services.AddTransient<ICategoryRepository, CategoryRepository>();
            services.AddTransient<IWordRepository, WordRepository>();

            return services;
        }
    }
}