import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/context/AuthProvider";
import { Toaster } from "@/components/ui/toaster"
 


export const metadata: Metadata = {
  title: "True Feedback",
  description: "Real feedback from real people",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" >
      <AuthProvider>
        <body>
          {children}
           <Toaster />
        </body>
      </AuthProvider>
    </html>
  );
}
