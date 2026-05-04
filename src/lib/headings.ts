export interface Heading {
  id: string;
  text: string;
  level: 2 | 3;
}

export function parseHeadings(mdxContent: string): Heading[] {
  const headings: Heading[] = [];
  const lines = mdxContent.split("\n");

  for (const line of lines) {
    const match = line.match(/^(#{2,3})\s+(.+)$/);
    if (!match) continue;
    const level = match[1].length as 2 | 3;
    const text = match[2]
      .replace(/\*\*(.+?)\*\*/g, "$1")
      .replace(/\*(.+?)\*/g, "$1")
      .replace(/`(.+?)`/g, "$1")
      .replace(/\[(.+?)\]\(.+?\)/g, "$1")
      .trim();
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
    headings.push({ id, text, level });
  }

  return headings;
}

export function parseFAQItems(
  mdxContent: string
): { question: string; answer: string }[] {
  const faqMatch = mdxContent.match(
    /<FAQ\s+items=\{(\[[\s\S]*?\])}\s*\/>/
  );
  if (!faqMatch) return [];
  try {
    const jsonStr = faqMatch[1]
      .replace(/(\w+):/g, '"$1":')
      .replace(/'/g, '"')
      .replace(/,\s*]/g, "]")
      .replace(/,\s*}/g, "}");
    return JSON.parse(jsonStr);
  } catch {
    const items: { question: string; answer: string }[] = [];
    const questionMatches = mdxContent.matchAll(
      /question:\s*"([^"]+)"[\s\S]*?answer:\s*"([^"]+)"/g
    );
    for (const m of questionMatches) {
      items.push({ question: m[1], answer: m[2] });
    }
    return items;
  }
}
