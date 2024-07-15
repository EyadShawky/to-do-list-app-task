import { Inter } from "next/font/google";
import "./styels/globals.scss";
import { ConfigProvider } from 'antd';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "To-Do",
  description: "TO-DO app task for project interview procces",
};

export default function RootLayout({ children }) {
  return (
    <ConfigProvider>
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
    </ConfigProvider>
  );
}
