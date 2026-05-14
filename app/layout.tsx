import type { Metadata } from 'next';
import { Sora, DM_Sans } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/context/AuthContext';
import './globals.css';

const sora = Sora({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-sora',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-dm-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'CertusMenutoría — Plataforma de Mentoría entre Pares',
  description: 'Conecta con mentores avanzados de Certus Instituto para acelerar tu aprendizaje académico y profesional.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${sora.variable} ${dmSans.variable} h-full`}>
      <body className="min-h-full antialiased">
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                fontFamily: 'var(--font-dm-sans, DM Sans, sans-serif)',
                fontSize: '14px',
                borderRadius: '10px',
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
