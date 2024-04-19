import { Inter } from "next/font/google";
import "./globals.css";
import Head from 'next/head';
import React, { ReactNode } from 'react';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Appfolio X Lev",
  description: "Appfolio X Lev",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps): JSX.Element {
  const faviconUrl = "/favicon.ico";

  return (
    <html lang="en">
      <Head>
        <link rel="shortcut icon" href={faviconUrl} sizes="any" type="image/x-icon" />
      </Head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
