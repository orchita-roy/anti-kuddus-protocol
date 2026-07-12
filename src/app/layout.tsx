import "./globals.css";import { Providers } from "@/components/Providers";
export const metadata={title:"Anti-Kuddus Protocol",description:"Class 7B resistance operations command center"};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><Providers>{children}</Providers></body></html>}
