"use client";
import { useEffect, useState } from "react";
import Header from "../components/Header";

const sections = [
  {
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600",
    title: "Section 1",
  },
  {
    image:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1600",
    title: "Section 2",
  },
  {
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600",
    title: "Section 3",
  },
];

export default function Home() {
  const [scrollY, setScrollY] = useState(0);

  return (
    <>
      <Header scrollY={scrollY} animated />
      <div
        id="scroll-container"
        className="w-full h-screen overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
        onScroll={(e) => setScrollY(e.currentTarget.scrollTop)}
      >
        {sections.map((section, i) => (
          <div
            key={i}
            className="w-full h-screen snap-start flex items-center justify-center relative"
            style={{
              backgroundImage: `url(${section.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-black/40" />
            <h1 className="relative text-white text-5xl font-bold z-10">
              {section.title}
            </h1>
          </div>
        ))}
      </div>
    </>
  );
}
