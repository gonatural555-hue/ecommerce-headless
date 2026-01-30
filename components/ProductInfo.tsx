// components/ProductInfo.tsx
import AddToCartButton from "./AddToCartButton";

type Product = {
  id: string;
  title: string;
  price: number;
  description: string;
  features: string[];
  stock: number;
};

type Props = {
  product: Product;
};

export default function ProductInfo({ product }: Props) {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">{product.title}</h1>

      <p className="text-2xl font-semibold mb-6">${product.price}</p>

      <p className="text-gray-600 mb-6">{product.description}</p>

      <ul className="list-disc list-inside mb-6 text-gray-700">
        {product.features.map((feature, i) => (
          <li key={i}>{feature}</li>
        ))}
      </ul>

      <p className="mb-4">
        {product.stock > 0 ? (
          <span className="text-green-600">
            Stock disponible ({product.stock})
          </span>
        ) : (
          <span className="text-red-600">Sin stock</span>
        )}
      </p>

      <AddToCartButton
        id={product.id}
        title={product.title}
        price={product.price}
        disabled={product.stock === 0}
      />

      <div className="mt-6 text-sm text-gray-500">
        <p>🚚 Envíos a todo el país</p>
        <p>↩️ Devoluciones sin cargo dentro de 30 días</p>
      </div>
    </div>
  );
}
