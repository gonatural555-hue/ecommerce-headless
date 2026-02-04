import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

type Props = {
  items: BreadcrumbItem[];
};

export default function Breadcrumbs({ items }: Props) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center">
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="hover:text-gray-900 transition-colors duration-200"
                >
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? "text-gray-900 font-medium" : ""}>
                  {item.label}
                </span>
              )}
              {!isLast && (
                <span className="mx-2 text-gray-400" aria-hidden="true">
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

