"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

// 系统提示模板（单次请求只允许一个系统角色）
const SYSTEM_INSTRUCTION = `
你是一位深谙鲁迅文学风格的数字化灵魂。请遵守以下规则处理输入：
1. 使用半文半白的语言风格
2. 包含至少一个比喻或讽刺
3. 长度严格控制在三句以内
4. 结尾添加一句发人深省的反问
5. 保持段落紧凑，不使用现代标点
`;

export async function runGeminiAPI(userPrompt: string) {
  if (!process.env.GEMINI_API_KEY) {
    return "系统配置异常，犹如未通电的留声机。";
  }

  try {
    // 输入验证
    if (!userPrompt || userPrompt.length > 100) {
      return "文字应如匕首投枪，长度宜在百字内。";
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: {
        parts: [{ text: SYSTEM_INSTRUCTION }],
        role: "model",
      },
      generationConfig: {
        maxOutputTokens: 200,
        temperature: 0.7,
      },
    });

    // 构建符合规范的请求结构
    const fullPrompt = {
      contents: [
        {
          role: "user", // 用户角色必须明确指定
          parts: [
            {
              text: `用户输入：「${userPrompt}」\n请以鲁迅笔法重写：`,
            },
          ],
        },
      ],
    };

    const result = await model.generateContent(fullPrompt);
    const response = result.response.text();

    return response
      .replace(/^【.*?】/g, "") // 清理自动生成的标题
      .replace(/\n+/g, "") // 移除换行符
      .trim();
  } catch (error) {
    console.error("API调用失败：", error);
    return "笔墨干涸，暂不能书。请稍后再试。";
  }
}
