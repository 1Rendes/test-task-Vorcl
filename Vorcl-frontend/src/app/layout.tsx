import React from 'react';
import './globals.css';
import NavBar from './components/NavBar';
import { Toaster } from 'react-hot-toast';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <NavBar />
        <Toaster />
        {children}
      </body>
    </html>
  );
}
