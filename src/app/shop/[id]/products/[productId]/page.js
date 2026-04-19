import { notFound } from "next/navigation";
import { getProductById } from "@/api";
import ProductEditForm from "@/components/shop/ProductEditForm";

export const dynamic = "force-dynamic";

const EditProductPage = async ({ params }) => {
  const { id, productId } = await params;
  const result = await getProductById(null, productId);

  if (!result.success || !result.data) {
    notFound();
  }

  return <ProductEditForm product={result.data} storeId={id} />;
};

export default EditProductPage;
