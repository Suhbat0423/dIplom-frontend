const DashboardPage = () => {
  return (
    <div>
      <h1 className="text-4xl font-bold text-zinc-900 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-zinc-200 p-6">
          <p className="text-zinc-600 text-sm font-medium">Total Sales</p>
          <p className="text-3xl font-bold text-zinc-900 mt-2">0</p>
        </div>
        <div className="bg-white rounded-lg border border-zinc-200 p-6">
          <p className="text-zinc-600 text-sm font-medium">Total Orders</p>
          <p className="text-3xl font-bold text-zinc-900 mt-2">0</p>
        </div>
        <div className="bg-white rounded-lg border border-zinc-200 p-6">
          <p className="text-zinc-600 text-sm font-medium">Products</p>
          <p className="text-3xl font-bold text-zinc-900 mt-2">0</p>
        </div>
        <div className="bg-white rounded-lg border border-zinc-200 p-6">
          <p className="text-zinc-600 text-sm font-medium">Customers</p>
          <p className="text-3xl font-bold text-zinc-900 mt-2">0</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-zinc-200 p-6">
        <h2 className="text-xl font-semibold text-zinc-900 mb-4">
          Recent Orders
        </h2>
        <p className="text-zinc-500 text-sm">No recent orders yet.</p>
      </div>
    </div>
  );
};

export default DashboardPage;
