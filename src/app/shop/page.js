// shop.jsx
import { Correct, Store } from "@/assets/icons";
import Dot from "@/components/Decorations/Dot";
import Input from "@/components/input";

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

const Shop = () => {
  return (
    <div className="flex w-full h-screen">
      {/* LEFT — dark panel */}
      <div className="w-1/2 bg-[#0c0c0c] p-14 flex flex-col gap-8">
        <h1 className="font-serif text-6xl font-bold text-white leading-none">
          High<span className="italic text-white">®</span> End
        </h1>
        <Dot x="20%" y="30%" size={300} />
        <Dot x="40%" y="70%" size={300} />

        {/* Portal badge */}
        <div className="flex items-center gap-4   rounded-xl  mt-54">
          <div className="w-12 h-12 border border-white/40 rounded-lg flex items-center justify-center text-white">
            <Store size={20} />
          </div>
          <div className="flex flex-col justify-between ">
            <h2 className="text-white font-bold text-3xl">
              Shop Manager Portal
            </h2>
            <p className="text-zinc-500 text-sm">
              Manage your luxury retail business with ease
            </p>
          </div>
        </div>

        {/* Feature list */}
        <div className="flex flex-col gap-4 mt-10">
          {features.map((f) => (
            <div key={f.title} className="flex items-start gap-3">
              <div className="w-6 h-6 mt-0.5 rounded-full border border-white/35 bg-white/10 flex items-center justify-center text-white flex-shrink-0">
                <Correct size={11} />
              </div>
              <div>
                <h3 className="text-white text-sm font-medium">{f.title}</h3>
                <p className="text-zinc-600 text-xs">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div>
          <p className="text-white/30 mt-60">
            © 2026 High® End. Premium Retail Management.
          </p>
        </div>
      </div>

      {/* RIGHT — light panel */}
      <div className="w-1/2 bg-[#f8f7f5] px-40 flex flex-col justify-center gap-6">
        {/* Toggle */}
        <div className="flex h-12 rounded-lg p-0.5 bg-white">
          <button className="w-full rounded-md bg-black text-white hover:bg-black/80 transition">
            Login
          </button>
          <button className="w-full rounded-md text-black hover:bg-black/10 transition">
            Register
          </button>
        </div>

        {/* Heading */}
        <div>
          <h2 className="font-serif text-3xl text-zinc-900">
            Welcome back, <em>Manager</em>
          </h2>
          <p className="text-zinc-400 text-sm mt-1">Sign in to your portal</p>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-4">
          <Input label="Email" placeholder="Email address" />

          <Input label="Password" type="password" placeholder="Password" />
        </div>

        {/* Button */}
        <button className="bg-black text-white rounded-lg py-3 text-sm font-medium tracking-wide hover:bg-zinc-800 transition">
          Sign in to portal
        </button>
      </div>
    </div>
  );
};

export default Shop;
