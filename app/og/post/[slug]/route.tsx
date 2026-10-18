import { clip, fetchPostForOg, loadOgAssets, ogSafeImage } from "@/lib/og/shared";
import { renderPageCard } from "@/lib/og/page-card";

export const runtime = "edge";

export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  const [assets, post] = await Promise.all([loadOgAssets(), fetchPostForOg(params.slug)]);

  if (!post) {
    return renderPageCard(assets, {
      eyebrow: "Blog",
      title: "Real estate insights for Accra.",
    });
  }

  const image = ogSafeImage(post.cover_image_url);
  return renderPageCard(assets, {
    eyebrow: post.category || "From the blog",
    title: clip(post.title, 80),
    subtitle: image ? undefined : clip(post.excerpt, 110) || undefined,
    image,
  });
}
