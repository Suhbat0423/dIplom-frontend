import { Correct, Store } from "@/assets/icons";
import Dot from "@/components/ui/Dot";

const features = [
  {
    title: "Product Management",
    desc: "Add, edit, and organize your premium inventory",
  },
  {
    title: "Revenue Analytics",
    desc: "Real-time sales data and performance forecasting",
  },
  {
    title: "Client Relations",
    desc: "VIP customer profiles and purchase history",
  },
];

const AuthAside = () => {
  return (
    <aside className="relative flex w-1/2 flex-col gap-8 overflow-hidden bg-[#0c0c0c] p-14">
      <h1 className="font-serif text-6xl font-bold leading-none text-white">
        High<span className="italic text-white">®</span> End
      </h1>
      <Dot x="20%" y="30%" size={300} />
      <Dot x="40%" y="70%" size={300} />

      <div className="mt-54 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-white/40 text-white">
          <Store size={20} />
        </div>
        <div className="flex flex-col justify-between">
          <h2 className="text-3xl font-bold text-white">Shop Manager Portal</h2>
          <p className="text-sm text-zinc-500">
            Manage your luxury retail business with ease
          </p>
        </div>
      </div>

      <div className="mt-10 flex flex-col gap-4">
        {features.map((feature) => (
          <div key={feature.title} className="flex items-start gap-3">
            <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border border-white/35 bg-white/10 text-white">
              <Correct size={11} />
            </div>
            <div>
              <h3 className="text-sm font-medium text-white">{feature.title}</h3>
              <p className="text-xs text-zinc-600">{feature.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-auto text-white/30">
        © 2026 High® End. Premium Retail Management.
      </p>
    </aside>
  );
};

export default AuthAside;
