import Link from "next/link";
import { getProductsByStore } from "@/api";
import ProductTable from "@/components/shop/ProductTable";

const ProductsPage = async ({ params }) => {
  const { id } = await params;
  const result = await getProductsByStore(id);
  const products = Array.isArray(result.data) ? result.data : [];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-zinc-900">Products</h1>
        <Link
          href={`/shop/${id}/create-product`}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Add Product
        </Link>
      </div>

      <ProductTable
        initialProducts={products}
        storeId={id}
        loadError={
          result.success === false
            ? result.message || "Failed to load products."
            : ""
        }
      />
    </div>
  );
};

export default ProductsPage;
