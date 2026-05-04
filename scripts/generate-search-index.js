const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

const contentDir = path.join(__dirname, "..", "src", "content");
const productsPath = path.join(__dirname, "..", "src", "data", "products.json");
const outPath = path.join(__dirname, "..", "public", "search-index.json");

function loadArticles(dir, type) {
  const fullPath = path.join(contentDir, dir);
  if (!fs.existsSync(fullPath)) return [];

  return fs
    .readdirSync(fullPath)
    .filter((f) => f.endsWith(".mdx"))
    .map((filename) => {
      const raw = fs.readFileSync(path.join(fullPath, filename), "utf-8");
      const { data, content } = matter(raw);
      const slug = filename.replace(/\.mdx$/, "");
      const plainText = content
        .replace(/import\s.*?;/g, "")
        .replace(/<[^>]+>/g, "")
        .replace(/[#*_~`>\-|]/g, "")
        .replace(/\s+/g, " ")
        .trim();
      const excerpt = plainText.slice(0, 200);

      const urlPrefix =
        type === "roundup" ? "/best" : type === "review" ? "/reviews" : "/guides";

      return {
        title: data.title || "",
        excerpt,
        category: data.category || "",
        tags: data.tags || [],
        type,
        slug,
        url: `${urlPrefix}/${slug}`,
      };
    });
}

function loadProducts() {
  const raw = fs.readFileSync(productsPath, "utf-8");
  const products = JSON.parse(raw);

  return Object.entries(products).map(([id, p]) => ({
    name: p.name,
    brand: p.brand,
    category: p.category,
    id,
    image: p.image,
    priceHint: p.priceHint || "",
  }));
}

const articles = [
  ...loadArticles("best", "roundup"),
  ...loadArticles("reviews", "review"),
  ...loadArticles("guides", "guide"),
];

const products = loadProducts();

const index = { articles, products };

fs.writeFileSync(outPath, JSON.stringify(index));
console.log(
  `Search index: ${articles.length} articles, ${products.length} products → ${outPath}`
);
