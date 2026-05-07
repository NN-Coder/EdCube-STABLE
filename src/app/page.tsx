"use client";

import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full px-[5%] text-center">
      <div className="flex flex-col items-center justify-center max-w-[1200px] pointer-events-none">
        <h1
          className="animate-fade-in-delay-1 animate-gradient-text font-bold leading-tight mb-[2vh] tracking-wider font-heading"
          style={{
            fontSize: "clamp(2.5rem, 8vw, 5rem)",
            background: "linear-gradient(120deg, #00ffcc 0%, #aeffee 50%, #00ffcc 100%)",
            backgroundSize: "200% auto",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            filter: "drop-shadow(0 0 0.5rem rgba(0, 255, 204, 0.4))",
          }}
        >
          Welcome to EdCube
        </h1>

        <h2
          className="animate-fade-in-delay-2 font-normal mt-0 mb-[5vh] tracking-wider"
          style={{
            fontSize: "clamp(1rem, 3.5vw, 1.8rem)",
            color: "#b3ffeb",
          }}
        >
          Start your gaming journey today!
        </h2>

        <Link href="/home" className="pointer-events-auto animate-fade-in-delay-3">
          <button
            className="font-heading uppercase tracking-wider transition-all duration-300 hover:scale-105 hover:-translate-y-0.5"
            style={{
              padding: "1.5vh 3vw",
              minWidth: "160px",
              background: "linear-gradient(90deg, #333, #555)",
              color: "white",
              border: "none",
              borderRadius: "50px",
              fontSize: "clamp(1rem, 2vw, 1.2rem)",
              boxShadow: "0 0.5vh 1.5vh rgba(0, 0, 0, 0.4)",
              letterSpacing: "1px",
              WebkitTapHighlightColor: "transparent",
              userSelect: "none",
            }}
            onMouseEnter={(e) => {
              const btn = e.currentTarget;
              btn.style.background = "linear-gradient(90deg, #de0c78, #00ffcc)";
              btn.style.boxShadow = "0 0.8vh 2.5vh rgba(255, 0, 255, 0.6)";
              btn.style.color = "black";
            }}
            onMouseLeave={(e) => {
              const btn = e.currentTarget;
              btn.style.background = "linear-gradient(90deg, #333, #555)";
              btn.style.boxShadow = "0 0.5vh 1.5vh rgba(0, 0, 0, 0.4)";
              btn.style.color = "white";
            }}
          >
            Get Started
          </button>
        </Link>
      </div>
    </div>
  );
}
