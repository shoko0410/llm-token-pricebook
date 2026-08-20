import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "LLM 토큰 가격지수 읽기 노트", description: "Open·Closed LLM 가격지수를 읽는 간결한 가이드" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ko"><body>{children}</body></html>;
}
