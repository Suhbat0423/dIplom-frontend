import { redirect } from "next/navigation";

const StorePage = async ({ params }) => {
  const { id } = await params;

  redirect(`/shop/${id}/dashboard`);
};

export default StorePage;
