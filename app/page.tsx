import { InputForm } from "@/components/custom-button";
import { GeminiResponse } from "@/components/gemini-response";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full p-4">
      <div className="w-full md:w-2/6 mb-12">
        <InputForm />
      </div>

      {/* 直接渲染组件 */}
      <GeminiResponse />
    </div>
  );
}
