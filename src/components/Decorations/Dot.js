const Dot = ({ x = "50%", y = "50%", size = 200 }) => {
  return (
    <div
      className="pointer-events-none absolute rounded-full blur-3xl opacity-40"
      style={{
        top: y,
        left: x,
        width: size,
        height: size,
        background:
          "radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%)",
        transform: "translate(-50%, -50%)",
      }}
    />
  );
};

export default Dot;
