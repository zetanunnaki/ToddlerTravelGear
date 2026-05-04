import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

export interface ContentMeta {
  slug: string;
  title: string;
  seoTitle?: string;
  description: string;
  category: string;
  type: "roundup" | "review" | "guide";
  publishedAt: string;
  updatedAt: string;
  author: string;
  featuredImage?: string;
  productIds?: string[];
  tags?: string[];
  readingTime: string;
}

export interface ContentItem {
  meta: ContentMeta;
  content: string;
}

const contentDir = path.join(process.cwd(), "src/content");

function getContentFromDir(dir: string, type: ContentMeta["type"]): ContentItem[] {
  const fullPath = path.join(contentDir, dir);
  if (!fs.existsSync(fullPath)) return [];

  return fs
    .readdirSync(fullPath)
    .filter((f) => f.endsWith(".mdx"))
    .map((filename) => {
      const filePath = path.join(fullPath, filename);
      const raw = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(raw);
      const slug = filename.replace(/\.mdx$/, "");
      const rt = readingTime(content);

      return {
        meta: {
          slug,
          title: data.title ?? "",
          seoTitle: data.seoTitle,
          description: data.description ?? "",
          category: data.category ?? "",
          type,
          publishedAt: data.publishedAt ?? "",
          updatedAt: data.updatedAt ?? "",
          author: data.author ?? "ToddlerTravelGear Team",
          featuredImage: data.featuredImage,
          productIds: data.productIds ?? [],
          tags: data.tags ?? [],
          readingTime: rt.text,
        },
        content,
      };
    })
    .sort(
      (a, b) =>
        new Date(b.meta.publishedAt).getTime() -
        new Date(a.meta.publishedAt).getTime()
    );
}

export function getAllRoundups(): ContentItem[] {
  return getContentFromDir("best", "roundup");
}

export function getAllReviews(): ContentItem[] {
  return getContentFromDir("reviews", "review");
}

export function getAllGuides(): ContentItem[] {
  return getContentFromDir("guides", "guide");
}

export function getAllContent(): ContentItem[] {
  return [...getAllRoundups(), ...getAllReviews(), ...getAllGuides()];
}

export function getContentBySlug(
  dir: string,
  slug: string,
  type: ContentMeta["type"]
): ContentItem | null {
  const filePath = path.join(contentDir, dir, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const rt = readingTime(content);

  return {
    meta: {
      slug,
      title: data.title ?? "",
      seoTitle: data.seoTitle,
      description: data.description ?? "",
      category: data.category ?? "",
      type,
      publishedAt: data.publishedAt ?? "",
      updatedAt: data.updatedAt ?? "",
      author: data.author ?? "ToddlerTravelGear Team",
      featuredImage: data.featuredImage,
      productIds: data.productIds ?? [],
      tags: data.tags ?? [],
      readingTime: rt.text,
    },
    content,
  };
}

export function getRelatedContent(
  current: ContentMeta,
  limit = 4
): ContentMeta[] {
  const all = getAllContent();
  return all
    .filter(
      (item) =>
        item.meta.slug !== current.slug &&
        (item.meta.category === current.category ||
          item.meta.tags?.some((t) => current.tags?.includes(t)))
    )
    .slice(0, limit)
    .map((item) => item.meta);
}
