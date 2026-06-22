import { useState } from "react";
import axios from "axios";

const consultants = [
  { id: 1, name: "Dr. Grace Mwangi", category: "Animal", speciality: "Dairy Cattle Health", rating: 4.8, image: "/images/grace.jpg" },
  { id: 2, name: "Mr. Daniel Ouma", category: "Plant", speciality: "Maize Pest Control", rating: 4.6, image: "/images/daniel.jpg" },
  { id: 3, name: "Dr. Lucy Kamau", category: "Animal", speciality: "Poultry Diseases", rating: 4.7, image: "/images/lucy.jpg" },
  { id: 4, name: "Prof. James Kiptoo", category: "Plant", speciality: "Horticultural Crops", rating: 4.5, image: "/images/james.jpg" },
  { id: 5, name: "Dr. Aisha Njeri", category: "Animal", speciality: "Goat & Sheep Health", rating: 4.9, image: "/images/aisha.jpg" },
  { id: 6, name: "Mr. Peter Waweru", category: "Plant", speciality: "Soil Fertility & Irrigation", rating: 4.4, image: "/images/peter.jpg" },
  { id: 7, name: "Dr. Samuel Otieno", category: "Animal", speciality: "Aquaculture & Fish Farming", rating: 4.8, image: "/images/samuel.jpg" },
  { id: 8, name: "Ms. Beatrice Muthoni", category: "Plant", speciality: "Fruit Tree Management", rating: 4.6, image: "/images/beatrice.jpg" },
  { id: 9, name: "Dr. Kelvin Mutua", category: "Animal", speciality: "Camel & Donkey Care", rating: 4.5, image: "/images/kelvin.jpg" },
  { id: 10, name: "Mr. David Chebet", category: "Plant", speciality: "Cereal Crop Diseases", rating: 4.7, image: "/images/david.jpg" }
];

export default function CropAdvice() {
  const [category, setCategory] = useState("Plant");
  const [activeConsultant, setActiveConsultant] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessage = { sender: "farmer", text: input };
    setMessages(prev => [...prev, newMessage]);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("http://localhost:8000/api/get_advice/", {
        consultantId: activeConsultant.id,
        question: newMessage.text
      });

      if (response.data.answer) {
        setMessages(prev => [...prev, { sender: "ai", text: response.data.answer }]);
      } else {
        setError("No response received from the advisor.");
      }
    } catch (err) {
      console.error("Error contacting backend:", err);
      setError("❌ Sorry, the AI advisor could not be reached.");
      setMessages(prev => [...prev, { sender: "ai", text: "❌ Something went wrong. Please try again later." }]);
    }

    setLoading(false);
  };

  return (
    <div
      className="min-h-screen text-gray-900 p-6"
      style={{
        backgroundImage: "url('/images/farm-bg.jpg')", // add an agricultural background image
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {!activeConsultant ? (
        <>
          <h1 className="text-green-800 text-3xl font-bold mb-6 bg-white/70 inline-block px-4 py-2 rounded-lg shadow">
            🌾 AgriSmart Crop & Livestock Advice
          </h1>

          {/* Toggle Plant / Animal */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setCategory("Plant")}
              className={`px-6 py-2 rounded-lg font-semibold shadow ${category === "Plant" ? "bg-green-600 text-white" : "bg-white/80 text-green-800"}`}
            >
              🌱 Plant Advice
            </button>
            <button
              onClick={() => setCategory("Animal")}
              className={`px-6 py-2 rounded-lg font-semibold shadow ${category === "Animal" ? "bg-green-600 text-white" : "bg-white/80 text-green-800"}`}
            >
              🐄 Animal Advice
            </button>
          </div>

          {/* Consultant Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {consultants
              .filter(c => c.category === category)
              .map(c => (
                <div
                  key={c.id}
                  onClick={() => {
                    setActiveConsultant(c);
                    setMessages([]);
                  }}
                  className="bg-white/80 backdrop-blur rounded-xl p-4 shadow-lg hover:scale-105 transition cursor-pointer border border-green-300"
                >
                  <img src={c.image} alt={c.name} className="w-24 h-24 rounded-full mx-auto" />
                  <h2 className="text-xl font-semibold mt-3 text-green-900">{c.name}</h2>
                  <p className="text-green-700">{c.speciality}</p>
                  <p className="text-yellow-600">⭐ {c.rating}</p>
                </div>
              ))}
          </div>
        </>
      ) : (
        // Chat interface
        <div className="bg-white/90 backdrop-blur p-6 rounded-xl shadow-lg min-h-screen flex flex-col">
          <button
            onClick={() => setActiveConsultant(null)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg mb-4 hover:bg-red-700 w-32"
          >
            ⬅ Back
          </button>
          <div className="flex items-center gap-4 mb-6">
            <img src={activeConsultant.image} alt={activeConsultant.name} className="w-16 h-16 rounded-full border-2 border-green-500" />
            <div>
              <h2 className="text-2xl font-bold text-green-900">{activeConsultant.name}</h2>
              <p className="text-green-700">{activeConsultant.speciality}</p>
            </div>
          </div>

          {/* Chat messages */}
          <div className="flex-1 bg-gray-100 p-4 rounded-lg overflow-y-auto mb-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`my-2 p-3 rounded-lg max-w-xs shadow-md ${
                  msg.sender === "farmer"
                    ? "bg-green-500 text-white ml-auto rounded-br-none"
                    : "bg-white text-gray-900 mr-auto border border-gray-300 rounded-bl-none"
                }`}
              >
                {msg.text}
              </div>
            ))}
            {loading && <p className="text-gray-500 italic">AI is typing...</p>}
            {error && <p className="text-red-600">{error}</p>}
          </div>

          {/* Input box */}
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type your question..."
              className="flex-1 px-4 py-3 rounded-lg border border-gray-400"
              disabled={loading}
            />
            <button
              onClick={handleSend}
              className={`px-6 py-3 rounded-lg font-semibold ${loading ? "bg-gray-400" : "bg-green-600 text-white hover:bg-green-700"}`}
              disabled={loading}
            >
              {loading ? "Sending..." : "Send"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
