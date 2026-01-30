type BlogHeroProps = {
  title: string;
  subtitle: string;
  image: string;
};

export default function BlogHero({ title, subtitle, image }: BlogHeroProps) {
  return (
    <section className="relative min-h-[50vh] md:min-h-[60vh] flex items-end overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover object-center"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-dark-base/70 via-dark-base/45 to-dark-base/85" />
      <div className="relative z-10 w-full">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 pb-14 md:pb-18">
          <h1 className="text-4xl md:text-5xl font-semibold text-text-primary">
            {title}
          </h1>
          <p className="mt-3 text-lg text-text-muted">{subtitle}</p>
        </div>
      </div>
    </section>
  );
}

