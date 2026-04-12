import Link from "next/link";

const AnimatedLogo = ({ scrollY = 0, animated = false }) => {
  const progress = animated ? Math.min(scrollY / 300, 1) : 1;
  const scale = 1 + (1 - progress) * 6;
  const opacity = 0.9 + (1 - progress) * 0.6;
  const letterSpacing = (1 - progress) * 12;
  const translateY = (1 - progress) * 8;
  const leftPercent = (1 - progress) * 52;
  const leftPx = progress * 80;
  const translateXPercent = (1 - progress) * -50;

  return (
    <div
      className="absolute top-2 font-bold text-xl"
      style={{
        left: `calc(${leftPercent}% + ${leftPx}px)`,
        transform: `translate(${translateXPercent}%, ${translateY}vh) scale(${scale})`,
        transformOrigin: "center top",
        opacity,
        letterSpacing: `${letterSpacing}px`,
        willChange: "transform, opacity, letter-spacing",
        fontFamily: "Georgia, serif",
        whiteSpace: "nowrap",
        zIndex: 101,
      }}
    >
      <Link href="/">High® End</Link>
    </div>
  );
};

export default AnimatedLogo;
