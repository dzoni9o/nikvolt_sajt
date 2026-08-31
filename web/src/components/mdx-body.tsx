import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { mdxComponents } from "@/components/mdx-components";

/**
 * The one place article bodies are rendered.
 *
 * Every page used to call MDXRemote directly with no options, which meant no
 * remark-gfm: markdown tables were not tables at all, and every price and
 * rating table on the site shipped to the reader as raw text full of pipe
 * characters. Routing all five call sites through here means a page cannot
 * forget the plugin.
 */
export function MdxBody({ source }: { source: string }) {
  return (
    <MDXRemote
      source={source}
      components={mdxComponents}
      options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
    />
  );
}
