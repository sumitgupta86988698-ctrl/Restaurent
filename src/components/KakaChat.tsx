import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, X, ArrowDown } from "lucide-react";

interface Message {
  id: string;
  sender: "kaka" | "user";
  content: string;
  timestamp: Date;
}

export default function KakaChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "kaka",
      content: "Hello! 🙏 Welcome to Rajkamal Mess and Restaurant! I am Rajkamal Kaka, your host here. Hungry for Nagpur's best homely food? Try our legendary Unlimited Veg Thali for just ₹150, or want some spicy Saoji gravy? Ask me anything!",
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    { text: "What's in the Unlimited Veg Thali? 🍛", short: "Thali details" },
    { text: "Tell me about Saoji Chicken Thali 🍗", short: "Saoji Chicken" },
    { text: "Something pocket-friendly under ₹120? 💰", short: "Budget items" },
    { text: "Are your chapatis fresh and soft? 🫓", short: "Chapatis" }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  const getKakaResponse = (userQuestion: string): string => {
    const q = userQuestion.toLowerCase();
    
    if (q.includes("unlimited") || q.includes("veg thali") || q.includes("🍛")) {
      return "Excellent! Our Unlimited Veg Thali at ₹150 is phenomenal value! We offer unlimited refilling of dry vegetable mix, special paneer curry, yellow comfort dal, steamed basmati rice, hot handmade wheat bread chapatis, fresh salad, and our signature Nagpur pickle. You can ask for refills anytime!";
    }
    
    if (q.includes("saoji") || q.includes("chicken") || q.includes("🍗")) {
      return "Oh, the traditional Saoji Chicken Thali is legendary! It's slow-cooked with intensely aromatic custom hand-milled spices, black-clove coriander spices and rich seasoning. Oily, spicy, and full of intense heat. Served with wheat flatbreads, steamed rice, and fresh salad. Always a hit for spice lovers!";
    }
    
    if (q.includes("pocket-friendly") || q.includes("budget") || q.includes("under") || q.includes("120") || q.includes("cheap") || q.includes("💰")) {
      return "For budget meals under ₹120, try our Regular Veg Thali for just ₹100! Or you can go to our Stainless Steel Plate custom builder and assemble custom Dal Fry Tadka (₹70), a couple of Soft Wheat Chapatis (₹10 each), or grab some comforting hot Sweet Milk Balls (₹30 for 2 pcs). Very light on the pocket!";
    }
    
    if (q.includes("chapati") || q.includes("roti") || q.includes("soft") || q.includes("🫓")) {
      return "Every single chapati is rolled by hand with pure wheat-flour and placed onto hot iron griddles directly. We don't use refined white flour. It is as soft and light as your mother cooks at home. They stay soft, fluffy, and fresh!";
    }

    if (q.includes("hi") || q.includes("hello") || q.includes("namaskar") || q.includes("hey")) {
      return "Hello! Warm welcome my friend! How can Kaka serve you today? Tell me, are you looking for lunch, dinner or want to assemble your own metal thali plate design?";
    }

    if (q.includes("location") || q.includes("where") || q.includes("address")) {
      return "We are located in Nagpur's bustling Dharampeth sector, near the Hanuman Mandir temple. Drop in anytime between 11 AM and 11 PM, or place an order for delivery/takeaway here!";
    }
    
    // Generic fallback
    return "Ayyoo, I got a little distracted in my kitchen stirring the gravies! But look, Kaka is always ready to serve you Nagpur's finest food. Order our Unlimited Veg Thali, Saoji Chicken, or customize your plate now! Let me know if you need help with selecting items.";
  };

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      content: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate Kaka preparing response with comforting delay
    setTimeout(() => {
      const responseText = getKakaResponse(text);
      const kakaMsg: Message = {
        id: `kaka-${Date.now()}`,
        sender: "kaka",
        content: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, kakaMsg]);
      setIsTyping(false);
    }, 900);
  };

  return (
    <div id="kaka-chatbot-container" className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white p-3.5 md:p-4 rounded-full shadow-2xl flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all duration-200 border border-emerald-500/20 group"
          title="Consult Chef Kaka"
        >
          <MessageSquare className="h-5 w-5 animate-pulse group-hover:animate-none" />
          <span className="text-xs font-bold uppercase tracking-wider hidden md:inline-block pr-1">Consult Kaka</span>
        </button>
      )}

      {/* Chat Window Container */}
      {isOpen && (
        <div className="bg-white rounded-3xl shadow-2xl border border-zinc-150 w-[350px] sm:w-[380px] max-h-[500px] flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
          
          {/* Header */}
          <div className="bg-emerald-600 text-white p-4 flex items-center justify-between border-b border-emerald-500/20">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-xl shadow-inner select-none">
                👨‍🍳
              </div>
              <div>
                <h3 className="font-extrabold text-sm tracking-wide">Chef Rajkamal Kaka</h3>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                  <span className="text-[10px] text-emerald-100 uppercase tracking-widest font-bold">Stirring Sauji Rassa</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white p-1 hover:bg-emerald-700 rounded-full transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages List Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-zinc-50/50 min-h-[250px] max-h-[320px]">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs font-sans leading-relaxed shadow-xs ${
                    m.sender === "user"
                      ? "bg-zinc-800 text-white rounded-tr-xs"
                      : "bg-[#fcfaf2] border border-amber-100 text-zinc-800 rounded-tl-xs"
                  }`}
                >
                  {m.content}
                </div>
                <span className="text-[9px] text-zinc-400 px-1 mt-1 font-mono">
                  {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
            
            {/* Kaka preparing/typing animation */}
            {isTyping && (
              <div className="flex flex-col items-start">
                <div className="bg-[#fcfaf2] border border-amber-100 text-zinc-500 rounded-2xl rounded-tl-xs px-3.5 py-3 text-xs flex items-center gap-1.5 shadow-xs">
                  <span>Chef Kaka is typing</span>
                  <span className="flex gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-bounce delay-0" />
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-bounce delay-150" />
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-bounce delay-300" />
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Prompts / Chips Row */}
          <div className="px-3 py-2 bg-white border-t border-zinc-100 overflow-x-auto flex gap-1.5 scrollbar-none select-none">
            {suggestedQuestions.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(q.text)}
                className="whitespace-nowrap bg-[#fcfaf2] border border-amber-100 hover:bg-amber-50 hover:border-amber-200 text-amber-900 px-2.5 py-1.5 rounded-full text-[10px] font-bold transition duration-150 shadow-2xs active:scale-95"
              >
                {q.short}
              </button>
            ))}
          </div>

          {/* Input Panel Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }}
            className="p-3 bg-zinc-50 border-t border-zinc-150 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Kaka anything (e.g. Saoji Chicken, Thali)..."
              className="flex-1 bg-white border border-zinc-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-600 text-zinc-800"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-zinc-200 disabled:text-zinc-400 text-white p-2 rounded-xl transition duration-150 flex items-center justify-center active:scale-95"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>

        </div>
      )}
    </div>
  );
}
