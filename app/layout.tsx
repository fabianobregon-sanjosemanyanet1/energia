import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Energía en familia · Aprender, actuar, observar",
  description: "Una prueba privada para acompañar prácticas de uso responsable de la energía en casa y en el colegio.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">{children}</body>
    </html>
  );
}
