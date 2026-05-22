import { useRef, useState } from "react";
import { Download, X, Pencil } from "lucide-react";

interface Props {
  imageSrc: string;
  flowerName: string;
  flowerLanguage: string;
  onClose: () => void;
  onSaveToArchive: (savedImage: string) => void;
}

export default function PolaroidResult({
  imageSrc,
  flowerName,
  flowerLanguage,
  onClose,
  onSaveToArchive,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [memo, setMemo] = useState<string>(""); // 엄마의 메모 상태 추가

  // HTML5 Canvas 이미지 합성 및 다운로드 로직
  const handleGeneratePolaroid = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageSrc;

    img.onload = () => {
      // 1. 폴라로이드 세로 길이를 메모 공간 확보를 위해 살짝 늘림 (400x540)
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, 400, 540);

      // 2. 상단 정방형 사진 (360x360)
      ctx.drawImage(img, 20, 20, 360, 360);

      // 3. 꽃 이름 (큼직하고 선명하게)
      ctx.fillStyle = "#1E293B";
      ctx.font = "bold 24px sans-serif";
      ctx.fillText(flowerName, 24, 415);

      // 4. 꽃말 (이름 아래에 귀여운 핑크색으로)
      ctx.fillStyle = "#EC4899";
      ctx.font = "medium 15px sans-serif";
      ctx.fillText(`✨ ${flowerLanguage}`, 24, 445);

      // 5. 엄마의 한 줄 메모 (있을 때만 합성)
      ctx.fillStyle = "#475569";
      ctx.font = "italic 16px sans-serif";
      if (memo.trim()) {
        ctx.fillText(`✍️ ${memo}`, 24, 485);
      } else {
        ctx.fillText(`✍️ 예쁜 꽃을 마주친 행복한 날`, 24, 485); // 메모 비었을 때 기본 문구
      }

      // 6. 우측 하단 아날로그 날짜 도장
      ctx.fillStyle = "#94A3B8";
      ctx.font = "13px monospace";
      const today = new Date()
        .toLocaleDateString()
        .replace(/\. /g, ".")
        .slice(0, -1);
      ctx.fillText(today, 295, 515);

      // 7. 이미지 추출 및 저장
      const dataUrl = canvas.toDataURL("image/png");
      onSaveToArchive(dataUrl);

      const link = document.createElement("a");
      link.download = `${flowerName}_${today}.png`;
      link.href = dataUrl;
      link.click();

      alert("📸 꽃말과 메모가 담긴 폴라로이드 카드가 저장되었습니다!");
      onClose();
    };
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex flex-col items-center justify-center p-6 z-50 overflow-y-auto">
      {/* 백그라운드 합성용 히든 캔버스 (사이즈 업그레이드) */}
      <canvas ref={canvasRef} width={400} height={540} className="hidden" />

      {/* 실물 뷰어 카드 */}
      <div className="bg-white p-5 rounded-sm shadow-2xl w-full max-w-sm flex flex-col gap-4 transform transition-all animate-in fade-in zoom-in-95 duration-200">
        <div className="aspect-square w-full overflow-hidden rounded-sm bg-slate-100 relative">
          <img
            src={imageSrc}
            alt="촬영된 꽃"
            className="w-full h-full object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* 폴라로이드 하단 텍스트 영역 */}
        <div className="flex flex-col gap-1.5 pt-1">
          <div className="flex justify-between items-baseline">
            <h3 className="text-xl font-bold text-slate-800">{flowerName}</h3>
            <span className="text-xs text-slate-400 font-mono">
              {new Date()
                .toLocaleDateString()
                .replace(/\. /g, ".")
                .slice(0, -1)}
            </span>
          </div>
          <p className="text-sm text-pink-500 font-semibold">
            ✨ {flowerLanguage}
          </p>

          {/* 프리뷰 화면에 보여질 메모 대역 */}
          <div className="mt-2 pt-2 border-t border-dashed border-slate-100">
            <p className="text-sm text-slate-600 font-medium italic min-h-[1.5rem]">
              {memo ? (
                `✍️ ${memo}`
              ) : (
                <span className="text-slate-300">메모가 함께 저장됩니다!</span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* ✍️ 실시간 메모 입력창 패널 */}
      <div className="w-full max-w-sm mt-4 bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10 flex items-center gap-2">
        <Pencil size={16} className="text-pink-300 shrink-0" />
        <input
          type="text"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          maxLength={25}
          placeholder="사진에 메모를 넣어보세요(25자)"
          className="w-full bg-transparent text-white text-sm placeholder-white/50 focus:outline-none"
        />
      </div>

      {/* 액션 버튼 세트 */}
      <div className="w-full max-w-sm flex flex-col gap-2 mt-4">
        <button
          onClick={handleGeneratePolaroid}
          className="w-full py-4 bg-pink-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-pink-900/20 active:scale-[0.99] transition-all"
        >
          <Download size={20} />
          메모와 함께 사진첩에 저장
        </button>
      </div>
    </div>
  );
}
