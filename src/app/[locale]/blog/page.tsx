"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { format } from "date-fns";
import { cs, enUS, de } from "date-fns/locale";
import { useTheme } from "@/components/ThemeProvider";
import { UserIcon, CalendarIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

const localeMap = { cs, en: enUS, de };

export default function BlogPage({ params: { locale } }: { params: { locale: string } }) {
  const t = useTranslations("Blog");
  const [posts, setPosts] = useState<any[]>([]);
  const { theme } = useTheme();

  useEffect(() => {
    fetch("/api/blog")
      .then((res) => res.json())
      .then(setPosts);
  }, []);

  // Prozatímní statické články pro vývoj
  useEffect(() => {
    setPosts([
      {
        id: 1,
        title: "Moderní architektura v praxi",
        slug: "moderni-architektura-v-praxi",
        content: "<p>Jak vypadá moderní architektura v roce 2025? Inspirace, trendy a technologie, které mění svět stavebnictví.</p>",
        createdAt: new Date("2025-09-01T10:00:00Z"),
        author: { name: "Naty Petrova", email: "naty@studio.cz" },
        featured: true
      },
      {
        id: 2,
        title: "Udržitelnost a ekologické stavby",
        slug: "udrzitelnost-a-ekostavby",
        content: "<p>Ekologické materiály, pasivní domy a jak na udržitelný rozvoj v architektuře.</p>",
        createdAt: new Date("2025-08-15T14:30:00Z"),
        author: { name: "Petr Novák", email: "petr@studio.cz" },
        featured: false
      },
      {
        id: 3,
        title: "Tipy pro mladé architekty",
        slug: "tipy-pro-mlade-architekty",
        content: "<p>Začínáte v oboru? Přinášíme rady, jak uspět a co se vyplatí sledovat.</p>",
        createdAt: new Date("2025-07-28T09:00:00Z"),
        author: { name: "Eva Němcová", email: "eva@studio.cz" },
        featured: false
      }
    ]);
  }, []);

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <motion.h1
        className="text-4xl font-bold mb-8 text-center"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {t("title", { defaultValue: "Blog" })}
      </motion.h1>
      <div className="space-y-8">
        {posts.map((post) => (
          <motion.div
            key={post.id}
            className={`rounded-xl shadow-lg p-6 bg-white/80 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 group relative overflow-hidden`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-4 mb-2 text-zinc-500 dark:text-zinc-400 text-sm">
              <CalendarIcon className="w-5 h-5" />
              <span>
                {format(new Date(post.createdAt), "d. MMMM yyyy", { locale: localeMap[locale] || cs })}
              </span>
              <UserIcon className="w-5 h-5 ml-4" />
              <span>{post.author?.name || post.author?.email || t("unknownAuthor", { defaultValue: "Unknown" })}</span>
            </div>
            <Link href={`/${locale}/blog/${post.slug}`} className="no-underline">
              <h2 className="text-2xl font-semibold mb-2 group-hover:text-primary transition-colors duration-200">
                {post.title}
              </h2>
              <div className="line-clamp-3 text-zinc-700 dark:text-zinc-200 mb-4" dangerouslySetInnerHTML={{ __html: post.content.slice(0, 200) + (post.content.length > 200 ? '…' : '') }} />
              <span className="inline-block mt-2 text-primary font-medium group-hover:underline transition-all duration-200">
                {t("readMore", { defaultValue: "Číst dál" })} →
              </span>
            </Link>
            <div className="absolute right-4 top-4 flex gap-2">
              {/* Moderní badge, např. kategorie, featured, atd. */}
              {post.featured && (
                <span className="bg-gradient-to-r from-pink-500 to-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow">
                  {t("featured", { defaultValue: "Doporučeno" })}
                </span>
              )}
            </div>
            {/* Microinterakce: animace při hoveru, glassmorphism, stín, přechody */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-transparent via-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
