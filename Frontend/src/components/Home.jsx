import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 via-gray-900 to-gray-950 flex flex-col items-center justify-center px-4">
      <h1 className="text-4xl sm:text-5xl font-bold text-rose-500 mb-4">
        Let’s Connect 💖
      </h1>

      <p className="text-center text-gray-300 text-lg sm:text-xl max-w-xl mb-8">
        Find your vibe. Match, love. Real people. Genuine connections.
      </p>

      <div className="flex gap-4">
        <button
          onClick={() => navigate("/login")}
          className="px-6 py-2 bg-rose-500 text-white rounded-xl shadow hover:bg-rose-600 transition"
        >
          Get Started
        </button>
        <button
          onClick={() => navigate("/about")}
          className="px-6 py-2 border border-rose-400 text-rose-500 rounded-xl hover:bg-rose-100 transition"
        >
          Learn More
        </button>
      </div>
    </div>
  );
};

export default Home;
