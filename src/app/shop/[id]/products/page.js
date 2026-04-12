import Link from "next/link";

const ProductsPage = async ({ params }) => {
  const { id } = await params;

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

      <div className="bg-white rounded-lg border border-zinc-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-zinc-50 border-b border-zinc-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-zinc-900">
                Product Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-zinc-900">
                Price
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-zinc-900">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-zinc-900">
                Status
              </th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-zinc-900">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-zinc-200 hover:bg-zinc-50">
              <td colSpan="5" className="px-6 py-8 text-center text-zinc-500">
                No products found.{" "}
                <Link
                  href={`/shop/${id}/create-product`}
                  className="text-blue-600 hover:underline"
                >
                  Create one now
                </Link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductsPage;
