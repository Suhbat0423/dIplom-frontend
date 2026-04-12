import Link from "next/link";
import Input from "@/components/ui/Input";

const CreateProductPage = async ({ params }) => {
  const { id } = await params;

  return (
    <div>
      <h1 className="text-4xl font-bold text-zinc-900 mb-8">Create Product</h1>

      <div className="bg-white rounded-lg border border-zinc-200 p-8 max-w-2xl">
        <form className="space-y-6">
          <Input
            label="Product Name"
            type="text"
            placeholder="Enter product name"
          />

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Description
            </label>
            <textarea
              placeholder="Enter product description"
              rows="4"
              className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:border-blue-500"
            ></textarea>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input label="Price" type="number" placeholder="0.00" />
            </div>
            <div>
              <Input label="Stock" type="number" placeholder="0" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Product Image
            </label>
            <input
              type="file"
              className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Create Product
            </button>
            <Link
              href={`/shop/${id}/products`}
              className="px-6 py-2 border border-zinc-300 text-zinc-700 rounded-lg hover:bg-zinc-50 transition"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProductPage;
