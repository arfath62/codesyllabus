import React, { useState, useRef, useEffect } from "react";
import { ChatMessage } from "../types";

interface AiCoachProps {
  languageId: string;
  floorNumber: number;
  currentCode: string;
}

export const AiCoach: React.FC<AiCoachProps> = ({
  languageId,
  floorNumber,
  currentCode,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "init-welcome",
      role: "mentor",
      text: "Greetings, Developer! I am your AI Syllabus Coach Mentor. Operating inside our custom high-frequency code execution compilers, I can formulate custom visual analogies or outline complex coding algorithms for any language topic. Choose one of the instant diagnostic blueprints below or write your specific queries!",
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const submitQuery = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          language: languageId,
          floor: floorNumber,
          code: currentCode,
        }),
      });

      if (!response.ok) {
        throw new Error("API Route communication broken.");
      }

      const data = await response.json();
      const mentorMsg: ChatMessage = {
        id: `men-${Date.now()}`,
        role: "mentor",
        text: data.response || "No data received from compiler servers. Let's try rebuilding.",
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, mentorMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: "mentor",
          text: `⚠️ [Node.js Pipeline Blocked] I had trouble reaching the AI brain. Reason: ${err.message}. However, you can check your console logs or make sure your GEMINI_API_KEY is configured in Settings.`,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitQuery(input);
  };

  return (
    <div className="bg-white border-4 border-black flex flex-col h-[400px] overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all">
      {/* Mentor HUD Profile Bar */}
      <div className="bg-stone-900 border-b-4 border-black p-3 flex items-center justify-between text-white">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-cyan-300 border-2 border-black flex items-center justify-center text-black font-extrabold shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
            <span className="animate-pulse">🤖</span>
          </div>
          <div>
            <span className="text-xs font-black block uppercase tracking-wide">SKYLINE COACH MENTOR</span>
            <span className="text-[8px] text-cyan-300 font-mono block uppercase">Gemini 3.5-Flash Active</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-black animate-pulse"></span>
          <span className="text-[8px] font-mono text-stone-400 font-black">ONLINE</span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-stone-100">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`max-w-[85%] p-3 border-2 border-black ${
              m.role === "user"
                ? "bg-black text-white ml-auto shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)]"
                : "bg-white text-slate-900 mr-auto shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
            }`}
          >
            <span
              className={`text-[8px] font-mono font-black uppercase tracking-widest block mb-1 ${
                m.role === "user" ? "text-yellow-300" : "text-violet-600"
              }`}
            >
              {m.role === "user" ? "APPRENTICE PROMPT" : "MEMBER ENCRYPT"}
            </span>
            <p className="text-xs font-semibold leading-relaxed whitespace-pre-wrap">{m.text}</p>
            <span className="text-[8px] text-stone-400 font-bold font-mono text-right block mt-1 leading-none">
              {m.timestamp}
            </span>
          </div>
        ))}

        {loading && (
          <div className="bg-white border-2 border-black p-3 max-w-[85%] mr-auto shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] animate-pulse">
            <span className="text-[8px] text-stone-500 font-mono font-black uppercase tracking-widest block mb-1">
              CONSULTING SYSTEM BLUEPRINTS...
            </span>
            <div className="flex gap-1 items-center mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-600 animate-bounce" style={{ animationDelay: "0ms" }}></span>
              <span className="w-1.5 h-1.5 rounded-full bg-violet-600 animate-bounce" style={{ animationDelay: "150ms" }}></span>
              <span className="w-1.5 h-1.5 rounded-full bg-violet-600 animate-bounce" style={{ animationDelay: "300ms" }}></span>
            </div>
          </div>
        )}
        <div ref={chatBottomRef} />
      </div>

      {/* Predefined Instant Actions */}
      <div className="px-2 py-1.5 bg-white border-t-2 border-black flex flex-wrap gap-1">
        <button
          onClick={() => submitQuery(`Write a simple real-world analogy for Python / JS concepts of this active level. (${languageId} floor ${floorNumber})`)}
          className="text-[9px] bg-sky-200 text-black hover:bg-sky-300 font-mono font-black border-2 border-black px-2 py-0.5 active:translate-y-0.5 transition-transform"
        >
          💡 METAPHOR ME
        </button>
        <button
          onClick={() => submitQuery(`Identify any logical compile anomalies or errors inside my draft code:\n\n${currentCode}`)}
          className="text-[9px] bg-emerald-200 text-black hover:bg-emerald-300 font-mono font-black border-2 border-black px-2 py-0.5 active:translate-y-0.5 transition-transform"
        >
          🔍 CODE CHECK
        </button>
        <button
          onClick={() => submitQuery(`Tell me what typical developers build in corporate systems using ${languageId} once they master beginner tracks.`)}
          className="text-[9px] bg-yellow-200 text-black hover:bg-yellow-300 font-mono font-black border-2 border-black px-2 py-0.5 active:translate-y-0.5 transition-transform"
        >
          🚀 ADVANCED CAREER Blueprints
        </button>
      </div>

      {/* Quick message insert field */}
      <form onSubmit={handleFormSubmit} className="p-2 border-t-4 border-black bg-stone-200 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Query coach on floor ${floorNumber}...`}
          className="flex-1 bg-white text-xs px-3 py-2 border-2 border-black focus:outline-none focus:border-cyan-500 font-bold placeholder:text-stone-500"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="p-2 bg-black hover:bg-stone-800 text-white border-2 border-black active:translate-x-0.5 active:translate-y-0.5 transition-all text-xs flex items-center justify-center"
        >
          <span>SEND</span>
        </button>
      </form>
    </div>
  );
};
