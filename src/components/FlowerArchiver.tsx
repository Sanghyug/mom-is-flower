import { useState } from "react";
import { Share2, Trash2, X } from "lucide-react";
import type { FlowerCard } from "../App";

interface Props {
  archive: FlowerCard[];
  onDelete: (id: string) => void;
}

export default function FlowerArchiver({ archive, onDelete }: Props) {
  const [selected, setSelected] = useState<FlowerCard | null>(null);

  const handleShare = async (card: FlowerCard) => {
    if (navigator.share) {
      await navigator.share({
        title: card.name,
        text: `${card.name}\n✨ ${card.language}`,
      });
    } else {
      const link = document.createElement("a");
      link.href = card.image;
      link.download = `${card.name}_card.png`;
      link.click();
    }
  };

  return (
    <div className="w-full max-w-md border-t border-slate-100 pt-6 mb-4">
      <h2 className="text-base font-bold text-slate-800 flex items-center gap-1.5 mb-4">
        나만의 꽃 도감 🗂️
        <span className="text-xs bg-pink-50 text-pink-500 px-2 py-0.5 rounded-full font-semibold">
          {archive.length}송이
        </span>
      </h2>

      {archive.length === 0 ? (
        <div className="py-12 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
          <span className="text-3xl mb-2">🌱</span>
          <p className="text-sm font-medium text-slate-400">
            아직 수집한 꽃이 없어요.
          </p>
          <p className="text-xs text-slate-400 mt-1">
            첫 번째 길가다 만난 꽃을 피워보세요!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          {archive.map((card) => (
            <button
              key={card.id}
              onClick={() => setSelected(card)}
              className="aspect-[3/4] bg-white p-1 rounded shadow-sm border border-slate-100 overflow-hidden"
            >
              <img
                src={card.image}
                alt={card.name}
                className="w-full aspect-square object-cover rounded-sm"
              />
              <p className="text-[10px] font-bold text-slate-700 mt-1 truncate">
                {card.name}
              </p>
            </button>
          ))}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-5">
          <div className="bg-white rounded-2xl p-4 w-full max-w-sm">
            <div className="flex justify-end mb-2">
              <button onClick={() => setSelected(null)}>
                <X size={22} />
              </button>
            </div>

            <img
              src={selected.image}
              alt={selected.name}
              className="w-full rounded-xl"
            />

            <div className="mt-3">
              <h3 className="text-lg font-bold text-slate-800">
                {selected.name}
              </h3>
              <p className="text-sm text-pink-500 font-semibold mt-1">
                ✨ {selected.language}
              </p>
              {selected.memo && (
                <p className="text-sm text-slate-500 mt-2">
                  ✍️ {selected.memo}
                </p>
              )}
            </div>

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => handleShare(selected)}
                className="flex-1 py-3 rounded-xl bg-pink-500 text-white font-bold flex items-center justify-center gap-2"
              >
                <Share2 size={18} />
                공유하기
              </button>

              <button
                onClick={() => {
                  onDelete(selected.id);
                  setSelected(null);
                }}
                className="flex-1 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold flex items-center justify-center gap-2"
              >
                <Trash2 size={18} />
                삭제하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}