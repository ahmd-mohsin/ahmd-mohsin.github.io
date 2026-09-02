import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
    metadataBase: new URL("https://ahmd-mohsin.github.io"),
    title: "Ahmad Mohsin",
    description:
        "Ahmad Mohsin, academic portfolio. Research in machine learning and reinforcement learning, publications, experience, and news.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body style={{ backgroundColor: "transparent" }}>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
