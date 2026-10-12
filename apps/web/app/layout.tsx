import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "どじょうすくい | min-yoh-abc",
  description: "どじょうをすくって、安来節と民謡の世界を知る小さなブラウザゲーム。"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ja"><body>{children}</body></html>;
}