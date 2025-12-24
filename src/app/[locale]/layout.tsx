import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '@/app/[locale]/globals.css'
import { ThemeProvider } from '@/components/ThemeProvider';
import CookieConsent from '@/components/CookieConsent';
import AnalyticsWrapper from '@/components/AnalyticsWrapper/AnalyticsWrapper';
import { Inter, JetBrains_Mono, Merriweather, Poppins, Roboto, Source_Code_Pro } from 'next/font/google';

// Only load fonts actually needed for UI - subset for performance
const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-inter',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
});

const merriweather = Merriweather({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-merriweather',
});

const poppins = Poppins({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-poppins',
});

const roboto = Roboto({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '700'],
  display: 'swap',
  variable: '--font-roboto',
});

const sourceCodePro = Source_Code_Pro({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-source-code-pro',
});


export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} className={`${inter.variable} ${jetbrainsMono.variable} ${merriweather.variable} ${poppins.variable} ${roboto.variable} ${sourceCodePro.variable}`}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Maxprojekty - Projekční kancelář pro vaše stavební plány. Architektura, projekce, stavební dozor a více." />
        <meta name="theme-color" content="#18181b" />
        <title>Maxprojekty</title>
      </head>
      <body className="flex min-h-screen flex-col bg-background text-foreground dark:bg-zinc-900 dark:text-zinc-100 transition-colors duration-300">
        <script dangerouslySetInnerHTML={{__html: `console.log('🔥 Layout loaded!');`}} />
        <ThemeProvider>
          <NextIntlClientProvider messages={messages}>
            <AnalyticsWrapper />
            <Header />
            <main className="flex-grow">{children}</main>
            <ToastContainer position="bottom-right" />
            <Footer />
            {/* Cookie lišta pro souhlas s analytickými cookies */}
            <CookieConsent />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
