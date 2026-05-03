import { redirect } from "next/navigation";

const DashboardPage = async ({ params }) => {
  const { id } = await params;

  redirect(`/shop/${id}`);
};

export default DashboardPage;
