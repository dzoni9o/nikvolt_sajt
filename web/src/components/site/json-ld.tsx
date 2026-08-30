/**
 * Renders a schema.org @graph document. Every page that emits structured data
 * goes through this component so the markup lands in the prerendered HTML.
 */
export function JsonLd({ data }: { data: string }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: data }}
    />
  );
}
