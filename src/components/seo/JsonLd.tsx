/** Структурированные данные schema.org. JSON экранируется, чтобы «</script>» в тексте не ломал разметку. */
export function JsonLd({ data }: { data: Record<string, unknown> | Array<Record<string, unknown>> }) {
  const json = JSON.stringify(data).replace(/</g, '\\u003c')
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
}
