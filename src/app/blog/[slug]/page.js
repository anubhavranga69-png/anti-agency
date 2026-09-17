import BlogPostClient from "@/components/BlogPostClient";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;

  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (url && key) {
      const res = await fetch(
        `${url}/rest/v1/blog_posts?slug=eq.${slug}&select=title,excerpt,featured_image,published,author,category,published_at`,
        {
          headers: {
            apikey: key,
            Authorization: `Bearer ${key}`,
          },
          cache: "no-store",
        }
      );

      if (res.ok) {
        const posts = await res.json();
        const post = posts?.[0];

        // If post exists and is published, provide full SEO metadata
        if (post && post.published) {
          const title = `${post.title} | Anti-Agency Journal`;
          const description =
            post.excerpt ||
            `Read ${post.title} on the Anti-Agency Journal — perspectives on brand engineering and digital dominance.`;
          const canonicalUrl = `https://anti-agency.in/blog/${slug}/`;
          const ogImages = post.featured_image
            ? [
                {
                  url: post.featured_image,
                  alt: post.title,
                },
              ]
            : [
                {
                  url: "https://anti-agency.in/logo.svg",
                  alt: "Anti-Agency",
                },
              ];

          return {
            title,
            description,
            alternates: {
              canonical: canonicalUrl,
            },
            openGraph: {
              title: post.title,
              description,
              url: canonicalUrl,
              siteName: "Anti-Agency",
              type: "article",
              publishedTime: post.published_at || undefined,
              authors: post.author ? [post.author] : undefined,
              section: post.category || "Insights",
              images: ogImages,
            },
            twitter: {
              card: "summary_large_image",
              title: post.title,
              description,
              images: post.featured_image ? [post.featured_image] : ["https://anti-agency.in/logo.svg"],
            },
            robots: {
              index: true,
              follow: true,
            },
          };
        }
      }
    }
  } catch (err) {
    console.error("Error generating metadata for blog article:", err);
  }

  // Fallback / Draft post metadata — noindex drafts
  return {
    title: "Article | Anti-Agency Journal",
    description: "Read perspectives on brand building, digital domination, and modern design.",
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  return <BlogPostClient slug={slug} />;
}
