import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { ProductCard } from "@/components/ProductCard";
import { BuyBox } from "@/components/BuyBox";
import { ComparisonTable } from "@/components/ComparisonTable";
import { SafetyNote } from "@/components/SafetyNote";
import { AgeChecklist } from "@/components/AgeChecklist";
import { FAQ } from "@/components/FAQ";
import { AffiliateDisclaimer } from "@/components/AffiliateDisclaimer";
import { PackingListProvider } from "@/components/PackingListProvider";
import { TripTypeBar } from "@/components/TripTypeBar";
import { PackingListPDF } from "@/components/PackingListPDF";

const components = {
  ProductCard,
  BuyBox,
  ComparisonTable,
  SafetyNote,
  AgeChecklist,
  FAQ,
  AffiliateDisclaimer,
  PackingListProvider,
  TripTypeBar,
  PackingListPDF,
};

export default function MdxRenderer({ source }: { source: string }) {
  return (
    <div className="prose max-w-none">
      <MDXRemote
        source={source}
        components={components}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
          },
        }}
      />
    </div>
  );
}
