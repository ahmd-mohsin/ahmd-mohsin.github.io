import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
    title: "Ahmad Mohsin",
    description:
        "Ahmad Mohsin — academic portfolio: research in machine learning and reinforcement learning, publications, experience, and news.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body style={{ backgroundColor: "#070b0a" }}>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
