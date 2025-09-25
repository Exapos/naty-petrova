export const metadata = {
  title: 'Admin | Naty Petrova',
  description: 'Admin panel pro správu obsahu',
}

import "./globals.css";
import ClientSessionProvider from "@/components/ClientSessionProvider";
import AdminLayoutWrapper from "../../components/AdminLayoutWrapper";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="cs">
      <body>
        <ClientSessionProvider>
          <AdminLayoutWrapper>{children}</AdminLayoutWrapper>
        </ClientSessionProvider>
      </body>
    </html>
  )
}
