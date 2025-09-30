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
    <html lang={locale}>
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
