const StorePage = () => {
  return (
    <div>
      <h1 className="mb-8 text-4xl font-bold text-zinc-900">Dashboard</h1>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
        <div className="rounded-lg border border-zinc-200 bg-white p-6">
          <p className="text-sm font-medium text-zinc-600">Total Sales</p>
          <p className="mt-2 text-3xl font-bold text-zinc-900">0</p>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white p-6">
          <p className="text-sm font-medium text-zinc-600">Total Orders</p>
          <p className="mt-2 text-3xl font-bold text-zinc-900">0</p>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white p-6">
          <p className="text-sm font-medium text-zinc-600">Products</p>
          <p className="mt-2 text-3xl font-bold text-zinc-900">0</p>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white p-6">
          <p className="text-sm font-medium text-zinc-600">Customers</p>
          <p className="mt-2 text-3xl font-bold text-zinc-900">0</p>
        </div>
      </div>

      <div className="rounded-lg border border-zinc-200 bg-white p-6">
        <h2 className="mb-4 text-xl font-semibold text-zinc-900">Recent Orders</h2>
        <p className="text-sm text-zinc-500">No recent orders yet.</p>
      </div>
    </div>
  );
};

export default StorePage;
