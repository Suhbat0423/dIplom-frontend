import AuthAside from "@/components/shop/AuthAside";
import AuthModeTabs from "@/components/shop/AuthModeTabs";

const AuthPageShell = ({ title, subtitle, children }) => {
  return (
    <div className="flex h-screen w-full">
      <AuthAside />

      <section className="flex w-1/2 flex-col justify-center gap-6 bg-[#f8f7f5] px-40">
        <AuthModeTabs />

        <div>
          <h2 className="font-serif text-3xl text-zinc-900">{title}</h2>
          <p className="mt-1 text-sm text-zinc-400">{subtitle}</p>
        </div>

        {children}
      </section>
    </div>
  );
};

export default AuthPageShell;
