import { MetadataRoute } from 'next';
import { INITIAL_ARTICLES } from '@/lib/article-data';
import { MOCK_TESTS } from '@/lib/mock-test-data';
import { examCategorySlugs } from '@/lib/navigation';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://sarkariexamhub.in';

  // Static high-priority pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/exams`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/materials`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/pdf-library`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/mock-tests`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/test-series`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/articles`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];

  // Dynamic exam category routes
  const categoryRoutes: MetadataRoute.Sitemap = examCategorySlugs.map((slug) => ({
    url: `${baseUrl}/categories/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  // Dynamic articles routes
  const articleRoutes: MetadataRoute.Sitemap = INITIAL_ARTICLES.filter(
    (a) => a.status === 'published'
  ).map((a) => ({
    url: `${baseUrl}/articles/${a.slug}`,
    lastModified: new Date(a.updated_at || a.created_at),
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  // Dynamic mock test routes
  const mockTestRoutes: MetadataRoute.Sitemap = MOCK_TESTS.map((t) => ({
    url: `${baseUrl}/mock-tests/take?testId=${t.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.75,
  }));

  return [...staticRoutes, ...categoryRoutes, ...articleRoutes, ...mockTestRoutes];
}
