"use client";
export default function ConversationIdeaAI() {
  const ideas = [
    "Agar tum kisi movie universe me reh sakte, konsa choose karte? 🎬",
    "Tumhara most random talent kya hai jo log expect nahi karte? 😭",
    "Agar abhi free ticket mile toh kaha travel karoge? ✈️",
    "Ek song jo tum repeat pe sun sakte ho pura week? 🎧",
    "Tum zyada night owl ho ya early bird? 🌙",
    "Most embarrassing school moment? 💀",
    "Agar life ek game hota toh tumhara current mission kya hota? 🎮",
    "Kis celebrity ke saath ek din spend karna chahoge? 👀",
    "Tumhara comfort food kya hai? 🍜",
    "Agar tum invisible ho jao ek din ke liye toh kya karoge? 😂",
    "Red flag jo tum instantly notice karte ho? 🚩",
    "Green flag jo instantly attractive lagta hai? ✨",
    "Konsa app delete karna impossible lagta hai? 📱",
    "Tumhari dream bike ya car kya hai? 🏍️",
    "Sabse weird DM jo tumhe mila ho? 😭"
  ];

  const pickupLines = [
    "Tumhari vibe WiFi jaisi hai... automatically connect ho gaya 😭",
    "Tum normal insan ho ya Netflix main character? 👀",
    "Tum reply late do ya fast, notification dekhke smile toh aati hai 😌",
    "Tumhare chats ka screenshot museum me hona chahiye 😂",
    "Tumhari energy coffee se zyada addictive lagti hai ☕"
  ];

  const randomIdea = () => ideas[Math.floor(Math.random() * ideas.length)];
  const randomLine = () => pickupLines[Math.floor(Math.random() * pickupLines.length)];

  const generate = (type) => {
    const box = document.getElementById("resultBox");
    if (type === "idea") {
      box.innerText = randomIdea();
    } else {
      box.innerText = randomLine();
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="bg-zinc-900 rounded-3xl shadow-2xl p-8 w-full max-w-xl border border-zinc-700">
        <h1 className="text-4xl font-bold text-center mb-3">
          AI Conversation Generator 🤖
        </h1>

        <p className="text-zinc-400 text-center mb-8">
          Live conversation ideas, random openers & vibe starters.
        </p>

        <div
          id="resultBox"
          className="bg-zinc-800 border border-zinc-700 rounded-2xl p-6 text-lg min-h-[120px] flex items-center justify-center text-center transition-all duration-300"
        >
          Tap a button and let the rizz machine cook 🍳
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <button
            onClick={() => generate("idea")}
            className="bg-white text-black font-semibold py-3 rounded-2xl hover:scale-105 transition"
          >
            Generate Idea 💬
          </button>

          <button
            onClick={() => generate("line")}
            className="bg-zinc-700 py-3 rounded-2xl hover:bg-zinc-600 hover:scale-105 transition"
          >
            Pickup Line ⚡
          </button>
        </div>

        <div className="mt-8 text-sm text-zinc-500 text-center">
          Built for awkward chats, dry DMs & emergency rizz situations 🚨
        </div>
      </div>
    </div>
  );
}
