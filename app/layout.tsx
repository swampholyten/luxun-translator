import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import { Noto_Sans_SC } from "next/font/google";

const noto = Noto_Sans_SC({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "鲁迅风格响应器",
  description: "生成具有鲁迅先生风格的文字响应，感受鲁迅先生的笔锋。",
  openGraph: {
    title: "鲁迅风格响应器",
    description: "生成具有鲁迅先生风格的文字响应，感受鲁迅先生的笔锋。",
    siteName: "鲁迅风格响应器",
    locale: "zh_CN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "鲁迅风格响应器",
    description: "生成具有鲁迅先生风格的文字响应，感受鲁迅先生的笔锋。",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head />
      <body className={`antialiased ${noto.className}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
