export const dynamic = "force-static";

export default async function sitemap() {
  const baseUrl = "https://anti-agency.in";

  // Core public static pages
  const staticRoutes = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/services/website-design/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services/branding/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services/social-media/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services/video-production/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services/ai-content/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  // Fetch only published blog posts from Supabase
  let blogRoutes = [];
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (url && key) {
      const res = await fetch(
        `${url}/rest/v1/blog_posts?published=eq.true&select=slug,updated_at,created_at`,
        {
          headers: {
            apikey: key,
            Authorization: `Bearer ${key}`,
          },
          cache: "force-cache",
        }
      );
      if (res.ok) {
        const posts = await res.json();
        if (Array.isArray(posts)) {
          blogRoutes = posts.map((post) => ({
            url: `${baseUrl}/blog/${post.slug}/`,
            lastModified: new Date(post.updated_at || post.created_at || Date.now()),
            changeFrequency: "weekly",
            priority: 0.7,
          }));
        }
      }
    }
  } catch (err) {
    console.error("Error generating sitemap blog routes:", err);
  }

  return [...staticRoutes, ...blogRoutes];
}
