import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "BuildBlock — District 01", description: "A living developer district shaped by public GitHub activity." };
export default function RootLayout({ children }: LayoutProps<"/">) { return <html lang="en"><body>{children}</body></html>; }
