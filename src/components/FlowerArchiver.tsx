// import React from "react";

interface Props {
  archive: string[];
}

export default function FlowerArchiver({ archive }: Props) {
  return (
    <div className="w-full max-w-md border-t border-slate-100 pt-6 mb-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-base font-bold text-slate-800 flex items-center gap-1.5">
          나만의 꽃 도감 🗂️
          <span className="text-xs bg-pink-50 text-pink-500 px-2 py-0.5 rounded-full font-semibold">
            {archive.length}송이
          </span>
        </h2>
      </div>

      {archive.length === 0 ? (
        // 도감이 비었을 때 나오는 귀여운 플레이스홀더
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
        // 저장된 폴라로이드 격자 배치
        <div className="grid grid-cols-3 gap-3 animate-in fade-in duration-300">
          {archive.map((image, index) => (
            <div
              key={index}
              className="aspect-[3/4] bg-white p-1 rounded shadow-sm border border-slate-100 transform rotate-1 hover:rotate-0 transition-transform duration-200 overflow-hidden"
            >
              <img
                src={image}
                alt="수집된 꽃 카드"
                className="w-full aspect-square object-cover rounded-sm"
              />
              <div className="h-6 flex items-center justify-center bg-white">
                <span className="w-2 h-2 rounded-full bg-pink-400 animate-pulse"></span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
