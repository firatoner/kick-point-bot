import './globals.css'

export const metadata = {
  title: 'Kick Point Bot',
  description: 'Automated emoji bot for Kick streamers',
}

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  )
}
