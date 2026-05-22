import React, { useState } from "react";
import { Camera, Image as ImageIcon } from "lucide-react";
import PolaroidResult from "./components/PolaroidResult";
import FlowerArchiver from "./components/FlowerArchiver";

// ⚠️ 테스트용 OpenAI API Key를 여기에 입력하세요. (챌린지 제출 전에는 백엔드나 환경변수로 숨겨야 합니다)
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || "";

export default function App() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [flowerData, setFlowerData] = useState<{
    name: string;
    language: string;
  } | null>(null);
  const [archive, setArchive] = useState<string[]>([]);

  // 스마트폰 앨범/카메라 파일 선택 처리 핸들러
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 1. 이미지 미리보기 처리 및 Base64 변환
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      setImageSrc(base64String); // 화면 표시용

      // 2. 진짜 AI 분석 시작
      await analyzeFlowerWithAI(base64String);
    };
    reader.readAsDataURL(file);
  };

  // OpenAI GPT-4o 멀티모달 API 연동 함수
  const analyzeFlowerWithAI = async (base64Image: string) => {
    if (!OPENAI_API_KEY || OPENAI_API_KEY.startsWith("여기에")) {
      alert(
        "OpenAI API Key가 설정되지 않았습니다! 코드를 열어 키를 입력해 주세요.",
      );
      return;
    }

    setIsAnalyzing(true);

    try {
      // 순수 Base64 데이터 추출
      const pureBase64 = base64Image.split(",")[1];

      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-4o", // 이미지 분석이 가능한 최신 플래그십 모델
            response_format: { type: "json_object" }, // 반드시 JSON으로 받기
            messages: [
              {
                role: "user",
                content: [
                  {
                    type: "text",
                    text: '사진 속 식물이나 꽃의 이름을 한국어로 정확히 찾고, 그 꽃에 어울리는 다정하고 따뜻한 꽃말이나 위로의 문장을 한 줄(한국어)로 생성해줘. 반드시 다음과 같은 JSON 포맷으로만 응답해줘: {"name": "꽃이름", "language": "꽃말 또는 위로구문"}',
                  },
                  {
                    type: "image_url",
                    image_url: {
                      url: `data:image/jpeg;base64,${pureBase64}`,
                    },
                  },
                ],
              },
            ],
          }),
        },
      );

      const result = await response.json();
      const choiceMessage = result.choices[0].message.content;
      const parsedData = JSON.parse(choiceMessage);

      // 3. 받아온 진짜 데이터를 상태에 주입
      setFlowerData({
        name: parsedData.name,
        language: parsedData.language,
      });
    } catch (error) {
      console.error("AI 분석 실패:", error);
      alert("꽃을 분석하는 도중 에러가 발생했습니다. 다시 시도해 주세요.");
    } finally {
      setIsAnalyzing(false);
    }
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
          <div className="flex flex-col items-center gap-4 text-center">
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
                실시간으로 진짜 꽃 이름을 분석하고 있어요...
              </p>
            </div>
          </div>
        ) : (
          <div className="w-full flex flex-col gap-3.5 relative">
            {/* HTML5 기본 파일 입력창을 투명하게 얹어 모바일 카메라/앨범 트리거 */}
            <label className="w-full py-5 bg-pink-500 text-white font-bold rounded-2xl shadow-lg shadow-pink-500/10 hover:bg-pink-600 active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 text-base cursor-pointer">
              <Camera size={22} />
              지금 사진 찍어 이름 찾기
              <input
                type="file"
                accept="image/*"
                capture="environment" // 스마트폰에서 실행 시 후면 카메라 바로 구동
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            <label className="w-full py-4.5 bg-white text-slate-700 font-bold rounded-2xl border border-slate-200/80 shadow-sm hover:bg-slate-50 active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 text-base cursor-pointer">
              <ImageIcon size={20} className="text-slate-400" />
              앨범에서 사진 가져오기
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
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
