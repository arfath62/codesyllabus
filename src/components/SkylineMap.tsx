import React from "react";
import { CURRICULUM } from "../data/curriculum";

interface SkylineMapProps {
  completedFloors: Record<string, number>;
  activeCityId: string;
  onSelectCity: (cityId: string) => void;
  // Let's add parameters so we can handle topic switching with click
  activeTopicIndex?: number;
  onSelectTopic?: (index: number) => void;
}

export const SkylineMap: React.FC<SkylineMapProps> = ({
  completedFloors,
  activeCityId,
  activeTopicIndex = 0,
  onSelectTopic,
}) => {
  const currentCity = CURRICULUM[activeCityId] || CURRICULUM.python;
  const topics = currentCity.floors;
  const completedCount = completedFloors[activeCityId] || 0;

  return (
    <div className="bg-stone-950 border-4 border-black p-3.5 relative w-full overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] select-none">
      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10 bg-black/60 px-2 py-0.5 border border-stone-800 rounded">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
        <span className="text-[9px] font-mono font-black text-cyan-300 tracking-wider">ACTIVE SYLLABUS ROADMAP</span>
      </div>

      <div className="text-right text-[9px] font-mono text-stone-500 mb-2.5 uppercase select-none">
        {currentCity.name} • {completedCount}/{topics.length} LESSONS COMPLETED
      </div>

      {/* Retro cyber Grid and Connector Timeline */}
      <div className="relative border-2 border-stone-800 bg-stone-900/60 p-4 rounded overflow-x-auto scrollbar-thin">
        <div className="min-w-[850px] flex items-center justify-between relative py-6">
          
          {/* Connector horizontal track line */}
          <div className="absolute top-[44px] left-8 right-8 h-2 bg-stone-950 border border-stone-800 rounded-full z-0">
            <div 
              className="h-full bg-cyan-300 transition-all duration-500"
              style={{ width: `${Math.min((completedCount / (topics.length - 1 || 1)) * 100, 100)}%` }}
            />
          </div>

          {topics.map((t, idx) => {
            const isCompleted = t.number <= completedCount;
            const isActive = idx === activeTopicIndex;
            const isSelectable = idx <= completedCount; // Can preview any unlocked lesson

            return (
              <div 
                key={t.number}
                onClick={() => isSelectable && onSelectTopic && onSelectTopic(idx)}
                className={`relative flex flex-col items-center z-10 group ${
                  isSelectable ? "cursor-pointer" : "cursor-not-allowed opacity-50"
                }`}
                style={{ width: `${100 / topics.length}%` }}
              >
                {/* Node circle state */}
                <div 
                  className={`w-11 h-11 rounded-full border-4 flex items-center justify-center font-mono text-xs font-black transition-all ${
                    isActive
                      ? "bg-yellow-300 text-black border-black scale-110 shadow-[0_0_12px_rgba(234,179,8,0.4)]"
                      : isCompleted
                        ? "bg-emerald-400 text-black border-black hover:bg-emerald-500"
                        : "bg-stone-800 text-stone-400 border-stone-950"
                  }`}
                >
                  {isCompleted ? "✓" : idx + 1}
                </div>

                {/* Micro level difficulties indicator */}
                <div className={`mt-2.5 text-[8px] font-mono leading-none px-1.5 py-0.5 border ${
                  isActive 
                    ? "bg-black text-yellow-300 border-black" 
                    : "bg-stone-950 text-stone-500 border-stone-800"
                }`}>
                  L{t.number}
                </div>

                {/* Hover bubble tooltip showing topic summary */}
                <div className="absolute bottom-[60px] scale-0 group-hover:scale-100 transition-all duration-150 origin-bottom bg-black border-2 border-stone-700 text-white text-[9.5px] p-2 rounded shadow-2xl z-30 w-36 pointer-events-none text-center leading-normal">
                  <div className="font-extrabold text-cyan-300 uppercase mb-0.5">Lesson {t.number}</div>
                  <div className="font-bold text-stone-100">{t.title}</div>
                  <div className="text-[8px] text-stone-400 mt-1 uppercase font-mono">{t.difficulty}</div>
                </div>
              </div>
            );
          })}

        </div>
      </div>

      <div className="mt-2.5 flex items-center justify-between text-[10px] text-stone-400 font-mono select-none">
        <span>🏁 foundations</span>
        <span>🚀 advanced systems</span>
      </div>
    </div>
  );
};
