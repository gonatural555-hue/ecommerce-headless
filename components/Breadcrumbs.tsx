import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

type Props = {
  items: BreadcrumbItem[];
  variant?: "default" | "light";
};

export default function Breadcrumbs({ items, variant = "default" }: Props) {
  const isLight = variant === "light";
  const textColor = isLight ? "text-white" : "text-gray-600";
  const linkHoverColor = isLight ? "hover:text-white/80" : "hover:text-gray-900";
  const lastItemColor = isLight ? "text-white" : "text-gray-900";
  const separatorColor = isLight ? "text-white/60" : "text-gray-400";

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className={`flex flex-wrap items-center gap-2 text-sm ${textColor}`}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center">
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className={`${linkHoverColor} transition-colors duration-200`}
                >
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? `${lastItemColor} font-medium` : ""}>
                  {item.label}
                </span>
              )}
              {!isLast && (
                <span className={`mx-2 ${separatorColor}`} aria-hidden="true">
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

