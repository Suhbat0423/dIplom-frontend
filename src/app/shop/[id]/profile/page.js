const ProfilePage = () => {
  return (
    <div>
      <h1 className="text-4xl font-bold text-zinc-900 mb-8">Store Profile</h1>

      <div className="bg-white rounded-lg border border-zinc-200 p-6 max-w-2xl">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Store Name
            </label>
            <input
              type="text"
              placeholder="Enter store name"
              className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter email"
              className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Description
            </label>
            <textarea
              placeholder="Enter store description"
              rows="4"
              className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:border-blue-500"
            ></textarea>
          </div>

          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
