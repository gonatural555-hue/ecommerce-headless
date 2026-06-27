import { splitGoodProductsBrandNameForLocale } from "@/lib/good-ideas-brand";
import type { Locale } from "@/lib/i18n/config";

type Props = {
  locale: Locale;
  className?: string;
  prefixClassName?: string;
  suffixClassName?: string;
};

/**
 * Nombre de marca Good Products / Buenos Productos.
 * Primera palabra en blanco; segunda en acento #3B82F6.
 */
export default function GoodProductsBrandName({
  locale,
  className,
  prefixClassName = "text-white transition-colors duration-200",
  suffixClassName = "text-[#3B82F6] transition-colors duration-200",
}: Props) {
  const { prefix, suffix } = splitGoodProductsBrandNameForLocale(locale);

  return (
    <span className={className}>
      <span className={prefixClassName}>{prefix}</span>
      {suffix ? (
        <>
          {" "}
          <span className={suffixClassName}>{suffix}</span>
        </>
      ) : null}
    </span>
  );
}
