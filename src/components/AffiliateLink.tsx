"use client";

interface AffiliateLinkProps {
  href: string;
  productId: string;
  children: React.ReactNode;
  className?: string;
  placement?: string;
}

export function AffiliateLink({
  href,
  productId,
  children,
  className,
  placement = "inline",
}: AffiliateLinkProps) {
  const handleClick = () => {
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", "affiliate_click", {
        product_id: productId,
        placement,
        page_type: window.location.pathname.split("/")[1] || "home",
      });
    }
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="nofollow noopener sponsored"
      onClick={handleClick}
      className={className}
    >
      {children}
    </a>
  );
}
