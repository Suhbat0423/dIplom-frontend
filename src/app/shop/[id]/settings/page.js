const SettingsPage = () => {
  return (
    <div>
      <h1 className="text-4xl font-bold text-zinc-900 mb-8">Settings</h1>

      <div className="max-w-2xl space-y-6">
        {/* Store Settings */}
        <div className="bg-white rounded-lg border border-zinc-200 p-6">
          <h2 className="text-lg font-semibold text-zinc-900 mb-4">
            Store Settings
          </h2>
          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  className="w-4 h-4 border-zinc-300 rounded"
                />
                <span className="text-sm text-zinc-700">Store is active</span>
              </label>
            </div>
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              Save Settings
            </button>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-lg border border-zinc-200 p-6">
          <h2 className="text-lg font-semibold text-zinc-900 mb-4">
            Notifications
          </h2>
          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  className="w-4 h-4 border-zinc-300 rounded"
                  defaultChecked
                />
                <span className="text-sm text-zinc-700">
                  Email order notifications
                </span>
              </label>
            </div>
            <div>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  className="w-4 h-4 border-zinc-300 rounded"
                  defaultChecked
                />
                <span className="text-sm text-zinc-700">
                  Email product inquiries
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-50 rounded-lg border border-red-200 p-6">
          <h2 className="text-lg font-semibold text-red-900 mb-4">
            Danger Zone
          </h2>
          <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
            Delete Store
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
