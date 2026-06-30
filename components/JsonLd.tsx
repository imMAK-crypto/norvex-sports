/**
 * Renders a JSON-LD <script>. The payload is HTML-escaped so values that
 * contain `<`, `>` or `&` (e.g. an admin-editable title containing
 * "</script>") can never break out of the script tag. The block is
 * `application/ld+json` data, not executable JS, so HTML-significant
 * characters are the only escaping concern.
 */
export function JsonLd({ data }: { data: Record<string, unknown> | Array<Record<string, unknown>> }) {
  const json = JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
