'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Building2, Home, ArrowLeft, HardHat, Compass } from 'lucide-react';

export default function NotFound() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-zinc-900 dark:to-zinc-800 flex items-center justify-center px-4 transition-colors duration-300">
      <div className="max-w-2xl text-center">
        {/* Animovaná ikona */}
        <motion.div
          className="mb-8"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="relative inline-block">
            <Building2 className="w-32 h-32 text-blue-500 mx-auto mb-4" />
            <motion.div
              className="absolute -top-2 -right-2"
              animate={{ 
                rotate: [0, -10, 10, -10, 0],
                scale: [1, 1.1, 1, 1.1, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <HardHat className="w-8 h-8 text-yellow-500" />
            </motion.div>
          </div>
        </motion.div>

        {/* Hlavní nadpis */}
        <motion.h1
          className="text-6xl md:text-8xl font-bold mb-6 text-blue-600 dark:text-blue-400"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          404
        </motion.h1>

        {/* Vtipný text */}
        <motion.h2
          className="text-2xl md:text-3xl font-bold mb-4 text-gray-800 dark:text-white"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Oops! Naši architekti stále plánují tuto stránku
        </motion.h2>

        <motion.p
          className="text-lg mb-8 text-gray-600 dark:text-gray-300 leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          Vypadá to, že se pokušíte vstoupit do budovy, která ještě není dokončena. 
          Náš tým architektů tvrdě pracuje na dokončení všech plánů, ale tato stránka 
          bohužel ještě neprošla stavebním řízením.
        </motion.p>

        {/* Animované informace */}
        <motion.div
          className="bg-white dark:bg-zinc-800 rounded-xl p-6 mb-8 shadow-lg border border-gray-200 dark:border-zinc-700"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="flex items-center justify-center mb-4">
            <Compass className="w-6 h-6 text-blue-500 mr-2" />
            <span className="font-semibold text-gray-800 dark:text-white">Stavební stav</span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-300">
            <div>
              <span className="font-medium">Stavební povolení:</span> ❌ Čeká na schválení
            </div>
            <div>
              <span className="font-medium">Architektonické plány:</span> 📋 V procesu
            </div>
            <div>
              <span className="font-medium">Statické výpočty:</span> 📐 Nedokončeno
            </div>
            <div>
              <span className="font-medium">Předpokládané dokončení:</span> 🚧 Brzy™
            </div>
          </div>
        </motion.div>

        {/* Tlačítka */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          <Link
            href="/"
            className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Návrat na hlavní stránku
          </Link>
          
          <Link
            href="/kontakt"
            className="inline-flex items-center px-8 py-4 bg-gray-100 dark:bg-zinc-700 hover:bg-gray-200 dark:hover:bg-zinc-600 text-gray-800 dark:text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Home className="w-5 h-5 mr-2" />
            Kontaktujte architekty
          </Link>
        </motion.div>

        {/* Vtipná poznámka */}
        <motion.p
          className="mt-8 text-sm text-gray-500 dark:text-gray-400 italic"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          💡 Tip: Zatímco čekáte, můžete si prohlédnout naše{' '}
          <Link href="/references" className="text-blue-500 hover:text-blue-600 underline">
            dokončené projekty
          </Link>
          {' '}nebo se seznámit s našimi{' '}
          <Link href="/sluzby" className="text-blue-500 hover:text-blue-600 underline">
            službami
          </Link>
          .
        </motion.p>
      </div>
    </div>
  );
}
