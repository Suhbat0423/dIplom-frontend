const OrdersPage = () => {
  return (
    <div>
      <h1 className="text-4xl font-bold text-zinc-900 mb-8">Orders</h1>

      <div className="bg-white rounded-lg border border-zinc-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-zinc-50 border-b border-zinc-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-zinc-900">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-zinc-900">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-zinc-900">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-zinc-900">
                Status
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-zinc-900">
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-zinc-200 hover:bg-zinc-50">
              <td colSpan="5" className="px-6 py-8 text-center text-zinc-500">
                No orders yet.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersPage;
