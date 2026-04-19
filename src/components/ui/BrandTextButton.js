const BrandTextButton = ({ children, active = false }) => {
  return (
    <button
      type="button"
      className={`w-auto rounded-full border px-4 py-2 text-sm font-medium transition ${
        active
          ? "border-black bg-black text-white"
          : "border-zinc-200 bg-white text-zinc-700 hover:border-black hover:text-black"
      }`}
    >
      {children}
    </button>
  );
};

export default BrandTextButton;
