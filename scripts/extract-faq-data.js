const fs = require("fs");
const path = require("path");

const CONTENT_DIRS = [
  "src/content/reviews",
  "src/content/best",
  "src/content/guides",
];

const allFaqData = {};
const results = { ok: 0, skip: 0, err: 0 };

for (const dir of CONTENT_DIRS) {
  const fullDir = path.resolve(dir);
  if (!fs.existsSync(fullDir)) continue;

  const files = fs.readdirSync(fullDir).filter((f) => f.endsWith(".mdx"));

  for (const file of files) {
    const slug = file.replace(".mdx", "");
    const filePath = path.join(fullDir, file);
    const content = fs.readFileSync(filePath, "utf-8");

    const faqRegex = /<FAQ\s+items=\{(\[[\s\S]*?\])\}\s*\/>/;
    const match = content.match(faqRegex);

    if (!match) {
      if (content.includes("<PackingListFAQ")) {
        console.log(`  [SKIP] ${slug} — uses PackingListFAQ`);
      } else if (content.includes("<FAQ")) {
        console.log(`  [SKIP] ${slug} — has FAQ tag but no inline items`);
      }
      results.skip++;
      continue;
    }

    try {
      const arrayStr = match[1];
      const items = new Function(`return ${arrayStr}`)();

      if (!Array.isArray(items) || items.length === 0) {
        console.log(`  [SKIP] ${slug} — empty FAQ array`);
        results.skip++;
        continue;
      }

      for (const item of items) {
        if (!item.question || !item.answer) {
          throw new Error("Missing question or answer field");
        }
      }

      allFaqData[slug] = items;

      const newContent = content.replace(faqRegex, "");
      fs.writeFileSync(filePath, newContent);

      console.log(`  [OK] ${slug} (${items.length} items)`);
      results.ok++;
    } catch (e) {
      console.error(`  [ERR] ${slug}: ${e.message}`);
      results.err++;
    }
  }
}

const slugs = Object.keys(allFaqData).sort();
let tsLines = [];
tsLines.push("export interface FAQItem {");
tsLines.push("  question: string;");
tsLines.push("  answer: string;");
tsLines.push("}");
tsLines.push("");
tsLines.push("const FAQ_DATA: Record<string, FAQItem[]> = {");

for (const slug of slugs) {
  const items = allFaqData[slug];
  tsLines.push(`  ${JSON.stringify(slug)}: [`);
  for (const item of items) {
    tsLines.push(
      `    { question: ${JSON.stringify(item.question)}, answer: ${JSON.stringify(item.answer)} },`
    );
  }
  tsLines.push("  ],");
}

tsLines.push("};");
tsLines.push("");
tsLines.push("export default FAQ_DATA;");
tsLines.push("");

const outPath = path.resolve("src/data/faq-data.ts");
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, tsLines.join("\n"));

console.log(
  `\nDone: ${results.ok} extracted, ${results.skip} skipped, ${results.err} errors`
);
console.log(
  `Generated ${outPath} with ${slugs.length} entries (${slugs.reduce((n, s) => n + allFaqData[s].length, 0)} total FAQ items)`
);
