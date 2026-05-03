import { redirect } from "next/navigation";

const LegacyShopBrandPage = async ({ params }) => {
  const { id } = await params;
  redirect(`/brands/${id}`);
};

export default LegacyShopBrandPage;
