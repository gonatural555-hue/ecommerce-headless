import Link from "next/link";

type CategoryItem = {
  title: string;
  href: string;
  image: string;
};

export default function CategoriesSection({ items }: { items: CategoryItem[] }) {
  return (
    <section className="bg-dark-base py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="grid gap-6 md:gap-8 md:grid-cols-2">
          {items.map((category) => (
            <Link
              key={category.title}
              href={category.href}
              className="group relative overflow-hidden rounded-2xl min-h-[320px] md:min-h-[380px]"
            >
              <div className="absolute inset-0">
                <img
                  src={category.image}
                  alt={category.title}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover object-center transition-transform duration-300 ease-out group-hover:scale-[1.03]"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-dark-base/30 via-dark-base/55 to-dark-base/85 transition-colors duration-300 ease-out group-hover:from-dark-base/40 group-hover:via-dark-base/65 group-hover:to-dark-base/90" />
              <div className="relative z-10 h-full flex items-end">
                <div className="p-8 sm:p-10">
                  <h3 className="text-2xl sm:text-3xl font-semibold text-text-primary">
                    {category.title}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

