type Props = {
  images: string[];
  title: string;
};

export default function ProductLifestyleImages({ images, title }: Props) {
  if (images.length === 0) return null;

  return (
    <section className="mt-16">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Product in Use</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((img, index) => (
          <div
            key={img}
            className="aspect-square bg-gray-100 rounded-lg overflow-hidden"
          >
            <img
              src={img}
              alt={`${title} - Lifestyle ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  );
}

