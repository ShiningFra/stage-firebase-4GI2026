import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Transport App - Réservation de courses avec QR code',
  description: 'Application de transport avec système de QR code pour la validation des courses',
  icons: {
    icon: '/img/vehicleLogo.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/html5-qrcode/2.3.8/html5-qrcode.min.css"
        />
        <script
          src="https://cdnjs.cloudflare.com/ajax/libs/html5-qrcode/2.3.8/html5-qrcode.min.js"
          async
        ></script>
      </head>
      <body className={inter.className}>
        <div className="fade-in">
          {children}
        </div>
      </body>
    </html>
  )
}
