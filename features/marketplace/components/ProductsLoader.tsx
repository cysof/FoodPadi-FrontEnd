
import ProductCardLoader from "./ProductCardLoader";

const ProductsLoader = () => {

  return (
    <div
      className={`grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 py-10 px-3 md:px-10 max-w-7xl w-full mx-auto`}
    >
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((product) => (
        <ProductCardLoader key={product} />
      ))}
    </div>
  );
};

export default ProductsLoader;
