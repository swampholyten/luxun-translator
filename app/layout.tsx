import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import { Noto_Serif_SC } from "next/font/google";

const noto = Noto_Serif_SC({});

export const metadata: Metadata = {
  title: "鲁迅风格转换器",
  description: "将普通语句转换为鲁迅风格的文字。体会鲁迅先生的笔锋。",
  openGraph: {
    title: "鲁迅风格转换器",
    description: "将普通语句转换为鲁迅风格的文字。体会鲁迅先生的笔锋。",
    siteName: "鲁迅风格转换器",
    locale: "zh_CN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "鲁迅风格转换器",
    description: "将普通语句转换为鲁迅风格的文字。体会鲁迅先生的笔锋。",
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
