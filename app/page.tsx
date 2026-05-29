"use client";

import { useState } from "react";

export default function Page() {
  const ideas = [
    "Agar tum kisi movie universe me reh sakte, konsa choose karte? 🎬",
    "Tumhara most random talent kya hai jo log expect nahi karte? 😭",
    "Agar abhi free ticket mile toh kaha travel karoge? ✈️",
    "Ek song jo tum repeat pe sun sakte ho pura week? 🎧",
    "Tum zyada night owl ho ya early bird? 🌙",
  ];

  const pickupLines = [
    "Tumhari vibe WiFi jaisi hai... automatically connect ho gaya 😭",
    "Tum normal insan ho ya Netflix main character? 👀",
    "Tumhari energy coffee se zyada addictive lagti hai ☕",
  ];

  const [text, setText] = useState(
    "Tap a button and let the rizz machine cook 🍳"
  );

  const generateIdea = () => {
    setText(ideas[Math.floor(Math.random() * ideas.length)]);
  };

  const generateLine = () => {
    setText(pickupLines[Math.floor(Math.random() * pickupLines.length)]);
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="bg-zinc-900 rounded-3xl p-8 w-full max-w-xl">
        <h1 className="text-4xl font-bold text-center mb-3">
          AI Conversation Generator 🤖
        </h1>

        <div className="bg-zinc-800 rounded-2xl p-6 text-center min-h-[120px] flex items-center justify-center">
          {text}
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <button
            onClick={generateIdea}
            className="bg-white text-black py-3 rounded-2xl"
          >
            Generate Idea 💬
          </button>

          <button
            onClick={generateLine}
            className="bg-zinc-700 py-3 rounded-2xl"
          >
            Pickup Line ⚡
          </button>
        </div>
      </div>
    </div>
  );
}