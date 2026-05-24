type Section = {
  heading?: string;
  paragraphs: string[];
  image?: string;
};

type Props = {
  intro?: string;
  sections?: Section[];
  closing?: string;
  locale?: string;
};

export default function GoodIdeasBlogPostContent({
  intro = "",
  sections = [],
  closing = "",
  locale = "",
}: Props) {
  const resolveLocale = (text: string) =>
    text.replaceAll("{{locale}}", locale);

  const renderParagraph = (paragraph: string) => {
    const content = resolveLocale(paragraph);
    if (content.includes("<a ")) {
      return <span dangerouslySetInnerHTML={{ __html: content }} />;
    }
    return content;
  };

  return (
    <section className="border-t border-white/[0.06] bg-[#0B0F14] py-14 md:py-18">
      <div className="mx-auto max-w-3xl px-6 sm:px-10 lg:px-16">
        {intro ? (
          <p className="font-inter text-lg leading-relaxed text-[rgba(232,236,241,0.78)] md:text-xl">
            {resolveLocale(intro)}
          </p>
        ) : null}

        <div className="mt-10 space-y-10 md:space-y-12">
          {sections.map((block, index) => (
            <div key={index} className="space-y-5">
              {block.heading ? (
                <h2 className="font-display text-2xl font-semibold tracking-[-0.02em] text-[#E8ECF1] md:text-3xl">
                  {block.heading}
                </h2>
              ) : null}
              <div className="space-y-4">
                {block.paragraphs.map((paragraph, paragraphIndex) => (
                  <p
                    key={paragraphIndex}
                    className="font-inter text-base leading-relaxed text-[rgba(232,236,241,0.72)] md:text-lg"
                  >
                    {renderParagraph(paragraph)}
                  </p>
                ))}
              </div>
              {block.image ? (
                <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-white/[0.08]">
                  <img
                    src={block.image}
                    alt={block.heading || "Article image"}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover object-center"
                  />
                </div>
              ) : null}
            </div>
          ))}
        </div>

        {closing ? (
          <p className="mt-12 font-inter text-base leading-relaxed text-[rgba(232,236,241,0.72)] md:text-lg">
            {resolveLocale(closing)}
          </p>
        ) : null}
      </div>
    </section>
  );
}
