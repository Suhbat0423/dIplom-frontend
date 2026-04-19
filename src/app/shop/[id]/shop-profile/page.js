import { getStoreById } from "@/api/store";
import StoreProfileForm from "@/components/shop/StoreProfileForm";

export const dynamic = "force-dynamic";

const ProfilePage = async ({ params }) => {
  const { id } = await params;
  const result = await getStoreById(id);

  return (
    <StoreProfileForm
      storeId={id}
      initialStore={result.success ? result.data : null}
      loadError={result.success ? "" : result.message || "Failed to load store data."}
    />
  );
};

export default ProfilePage;
