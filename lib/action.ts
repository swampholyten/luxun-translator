"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { headers } from "next/headers";

// 系统提示模板
const SYSTEM_INSTRUCTION = `
你是一位深谙鲁迅文学风格的数字化灵魂。请遵守以下规则处理输入：
1. 使用半文半白的语言风格
2. 包含至少一个比喻或讽刺
3. 长度严格控制在三句以内
4. 结尾添加一句发人深省的反问
5. 保持段落紧凑，不使用现代标点
`;

// 速率限制存储结构
interface RateLimitRecord {
  count: number;
  resetTime: number; // 每日重置时间戳
}

const rateLimits = new Map<string, RateLimitRecord>();

// 每日清理定时器（每小时检查一次）
setInterval(() => {
  const now = Date.now();
  rateLimits.forEach((record, ip) => {
    if (now > record.resetTime) {
      rateLimits.delete(ip);
    }
  });
}, 3_600_000); // 每小时清理

async function getClientIP(): Promise<string> {
  try {
    const headersList = await headers();
    const forwardedFor = headersList.get("x-forwarded-for");
    return forwardedFor?.split(",")[0].trim() || "127.0.0.1";
  } catch (error) {
    console.error(error);
    return "127.0.0.1";
  }
}

function checkDailyLimit(ip: string): string | null {
  const now = Date.now();
  const record = rateLimits.get(ip);

  // 初始化或重置每日计数器
  if (!record || now > record.resetTime) {
    const nextReset = new Date();
    nextReset.setHours(24, 0, 0, 0); // 次日零点重置
    rateLimits.set(ip, {
      count: 1,
      resetTime: nextReset.getTime(),
    });
    return null;
  }

  // 检查当日限额
  if (record.count >= 3) {
    const remainHours = Math.ceil((record.resetTime - now) / 3600000);
    return `今日笔墨已尽，${remainHours}时辰后可再抒胸臆。`;
  }

  // 增加计数
  rateLimits.set(ip, { ...record, count: record.count + 1 });
  return null;
}

export async function runGeminiAPI(userPrompt: string) {
  if (!process.env.GEMINI_API_KEY) {
    return "系统配置异常，犹如未通电的留声机。";
  }

  // 获取客户端 IP
  const clientIP = await getClientIP();

  // 每日次数检查
  const limitError = checkDailyLimit(clientIP);
  if (limitError) return limitError;

  try {
    // 输入验证
    if (!userPrompt || userPrompt.length > 100) {
      // 回滚计数器
      const record = rateLimits.get(clientIP);
      if (record)
        rateLimits.set(clientIP, { ...record, count: record.count - 1 });
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

    const fullPrompt = {
      contents: [
        {
          role: "user",
          parts: [{ text: `用户输入：「${userPrompt}」\n请以鲁迅笔法重写：` }],
        },
      ],
    };

    const result = await model.generateContent(fullPrompt);
    return result.response
      .text()
      .replace(/^【.*?】/g, "")
      .replace(/\n+/g, "")
      .trim();
  } catch (error) {
    console.error("API调用失败：", error);
    // 回滚计数器
    const record = rateLimits.get(clientIP);
    if (record)
      rateLimits.set(clientIP, { ...record, count: record.count - 1 });
    return "笔墨干涸，暂不能书。请稍后再试。";
  }
}
