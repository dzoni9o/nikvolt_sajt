import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type BlogFrontmatter = {
  title: string;
  description: string;
  slug: string;
  category: string;
  readingTime: number;
  date: string;
  cover: string;
  tags: string[];
};

export type BlogPost = BlogFrontmatter & {
  content: string;
};

const CONTENT_DIR = path.join(process.cwd(), "src", "content", "blog");

export function getAllPosts(): BlogPost[] {
  const files = fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".mdx"));

  const posts = files.map((file) => {
    const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf-8");
    const { data, content } = matter(raw);
    const fm = data as BlogFrontmatter;
    return { ...fm, content };
  });

  return posts.sort((a, b) => (a.date > b.date ? -1 : 1));
}

export function getPostBySlug(slug: string): BlogPost | null {
  const all = getAllPosts();
  return all.find((p) => p.slug === slug) ?? null;
}

export function getCategories(): string[] {
  return Array.from(new Set(getAllPosts().map((p) => p.category)));
}
