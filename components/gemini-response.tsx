"use client";

import { runGeminiAPI } from "@/lib/action";
import { usePromptStore } from "@/lib/prompt-store";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

export function GeminiResponse() {
  const prompt = usePromptStore((state) => state.prompt);
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (prompt) {
      setIsLoading(true);
      setResponse(null);
      runGeminiAPI(prompt)
        .then((res) => setResponse(res))
        .catch((err) => setResponse(`Error: ${err.message}`))
        .finally(() => setIsLoading(false));
    }
  }, [prompt]);

  if (!prompt) return null;

  return (
    <Card className="w-full md:w-2/6 rounded-none">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">
          周树人答语：
        </CardTitle>
      </CardHeader>
      <CardContent className="w-full">
        {isLoading ? (
          <div className="flex flex-col space-y-3 p-4">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                苦思冥想中，答语渐现……
              </p>
            </div>
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ) : (
          <div className="max-h-[500px] overflow-y-auto p-4">
            <pre className="whitespace-pre-line text-sm">{response}</pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
