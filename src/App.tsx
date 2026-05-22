import React, { useState } from "react";
import { Camera, Image as ImageIcon } from "lucide-react";
import PolaroidResult from "./components/PolaroidResult";
import FlowerArchiver from "./components/FlowerArchiver";

export default function App() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [flowerData, setFlowerData] = useState<{
    name: string;
    language: string;
  } | null>(null);
  const [archive, setArchive] = useState<string[]>([]);

  // 1단계: 토스 카메라/앨범 연동 시뮬레이션 핸들러
  const handlePickImage = (type: "camera" | "album") => {
    console.log(
      `앱인토스 SDK 브릿지 실행: with-${type === "camera" ? "camera" : "album-photos"}`,
    );
    setIsAnalyzing(true);

    // 2단계: AI 멀티모달 분석 딜레이 연출 (2.5초)
    setTimeout(() => {
      // App.tsx 내부의 handlePickImage 내 mockFlowers 데이터 수정 버전
      const mockFlowers = [
        { name: "개망초", language: "가까이 있는 사람을 행복하게 해요" },
        { name: "튤립", language: "당신을 향한 아름다운 사랑의 고백" },
        { name: "민들레", language: "행복을 가득 안고 찾아갈게요" },
      ];
      const randomFlower =
        mockFlowers[Math.floor(Math.random() * mockFlowers.length)];

      // 테스트용 고화질 식물 이미지 샘플
      setImageSrc(
        "https://images.unsplash.com/photo-1560717789-0ac7c58ac90a?auto=format&fit=crop&w=600&q=80",
      );
      setFlowerData(randomFlower);
      setIsAnalyzing(false);
    }, 2500);
  };

  const handleSaveToArchive = (savedImage: string) => {
    setArchive((prev) => [savedImage, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-between p-6 select-none">
      {/* 1단계: 메인 인트로 헤더 */}
      <header className="w-full text-center mt-10">
        <span className="text-xs bg-pink-100 text-pink-600 font-bold px-3 py-1 rounded-full">
          Apps in Toss 챌린지 출품작
        </span>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight mt-3">
          엄마는 꽃 🌸
        </h1>
        <p className="text-sm font-medium text-slate-400 mt-1.5">
          길가다 마주친 예쁜 꽃의 이름을 찾아줄게요
        </p>
      </header>

      {/* 2단계: 메인 액션 및 로딩 패널 */}
      <main className="w-full max-w-md flex flex-col items-center justify-center flex-1 py-8">
        {isAnalyzing ? (
          <div className="flex flex-col items-center gap-4 text-center animate-in fade-in duration-300">
            {/* 귀여운 꽃망울 핑 스피너 */}
            <div className="relative flex h-14 w-14">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-14 w-14 bg-pink-500 items-center justify-center text-xl">
                🌸
              </span>
            </div>
            <div className="mt-2">
              <p className="text-pink-600 font-bold text-base">
                AI가 꽃을 들여다보는 중
              </p>
              <p className="text-xs text-slate-400 mt-1">
                예쁜 이름과 꽃말을 피워내고 있어요...
              </p>
            </div>
          </div>
        ) : (
          <div className="w-full flex flex-col gap-3.5">
            <button
              onClick={() => handlePickImage("camera")}
              className="w-full py-5 bg-pink-500 text-white font-bold rounded-2xl shadow-lg shadow-pink-500/10 hover:bg-pink-600 active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 text-base"
            >
              <Camera size={22} />
              지금 사진 찍어 이름 찾기
            </button>
            <button
              onClick={() => handlePickImage("album")}
              className="w-full py-4.5 bg-white text-slate-700 font-bold rounded-2xl border border-slate-200/80 shadow-sm hover:bg-slate-50 active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 text-base"
            >
              <ImageIcon size={20} className="text-slate-400" />
              앨범에서 사진 가져오기
            </button>
          </div>
        )}
      </main>

      {/* 하단 도감 히스토리 판 */}
      <FlowerArchiver archive={archive} />

      {/* 3단계: 분석 완료 폴라로이드 팝업 모달 */}
      {flowerData && imageSrc && (
        <PolaroidResult
          imageSrc={imageSrc}
          flowerName={flowerData.name}
          flowerLanguage={flowerData.language}
          onClose={() => setFlowerData(null)}
          onSaveToArchive={handleSaveToArchive}
        />
      )}
    </div>
  );
}
