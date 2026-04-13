import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

type Props = {
  items: BreadcrumbItem[];
  /** Miga de pan sutil sobre foto / hero oscuro (p. ej. catálogo). */
  variant?: "default" | "darkHero";
};

export default function Breadcrumbs({ items, variant = "default" }: Props) {
  const isDarkHero = variant === "darkHero";

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol
        className={
          isDarkHero
            ? "flex flex-wrap items-center gap-2 text-sm text-white/50"
            : "flex flex-wrap items-center gap-2 text-sm text-white"
        }
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center">
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className={
                    isDarkHero
                      ? "transition-colors duration-200 hover:text-white/80"
                      : "hover:text-white/80 transition-colors duration-200"
                  }
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={
                    isDarkHero
                      ? isLast
                        ? "font-medium text-white"
                        : "text-white/50"
                      : isLast
                        ? "text-white font-medium"
                        : "text-white"
                  }
                >
                  {item.label}
                </span>
              )}
              {!isLast && (
                <span
                  className={
                    isDarkHero
                      ? "mx-2 text-white/35"
                      : "mx-2 text-white/70"
                  }
                  aria-hidden="true"
                >
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

