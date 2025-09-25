"use client";
import { useState } from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { motion } from 'framer-motion';
import { Project, ProjectCategory } from '@/app/[locale]/reference/projectsData';

interface Props {
  projects: Project[];
}

export default function ClientProjects({ projects }: Props) {
  const [filter, setFilter] = useState<ProjectCategory | 'All'>('All');

  const categories = Array.from(new Set(projects.map((p) => p.category)));

  const filtered = filter === 'All' ? projects : projects.filter((p) => p.category === filter);

  return (
    <section aria-labelledby="references-title" className="py-12">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <button
            onClick={() => setFilter('All')}
            className={`px-3 py-1 rounded-full ${filter==='All'? 'bg-blue-600 text-white' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200'}`}>
            Vše
          </button>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c as ProjectCategory)}
              className={`px-3 py-1 rounded-full ${filter===c? 'bg-blue-600 text-white' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200'}`}>
              {c}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p) => (
            <motion.article key={p.id} layout whileHover={{ scale: 1.02 }} className="rounded-lg overflow-hidden bg-white/80 dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <div className="relative h-48 w-full">
                <Image src={p.image} alt={`${p.title} - ${p.location}`} fill className="object-cover" />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold leading-tight">{p.title} <span className="text-zinc-500 font-normal">• {p.location}</span></h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-2 line-clamp-3">{p.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <Link href={`/projekty/${p.slug}`} className="text-blue-600 dark:text-blue-400 font-medium">Zobrazit projekt →</Link>
                  <span className="text-xs text-zinc-500">{p.category}</span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
