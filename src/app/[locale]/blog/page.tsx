'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/routing';
import { BlogPost } from '@/types/blog';
import { CalendarIcon, UserIcon, ArrowRightIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [inputValue, setInputValue] = useState<string>('');




  useEffect(() => {
    fetchPosts();
  }, []);

  // Debouncing pro vyhledávání
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearchQuery(inputValue);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [inputValue]);

  // Filtrování článků podle vyhledávání
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredPosts(posts);
    } else {
      const filtered = posts.filter(post => 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (post.excerpt && post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (post.content && post.content.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredPosts(filtered);
    }
  }, [posts, searchQuery]);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/blog');
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      const data = await response.json();
      // Filter only published posts
      const publishedPosts = data.filter((post: BlogPost) => post.published);
      setPosts(publishedPosts);
      setFilteredPosts(publishedPosts);
    } catch (err) {
      setError('Chyba při načítání článků');
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (value: string) => {
    setInputValue(value);
  };

  const formatDate = (dateString: string | Date) => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.toLocaleDateString('cs-CZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength).trim() + '...';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-blue-900 pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-100 dark:border-blue-900 border-t-blue-600 dark:border-t-blue-400 mx-auto"></div>
                <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-r-blue-400 animate-pulse mx-auto"></div>
              </div>
              <p className="mt-6 text-slate-600 dark:text-slate-400 text-lg">Načítám články...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-blue-900 pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50/80 dark:bg-red-900/20 backdrop-blur-sm border border-red-200 dark:border-red-800 rounded-2xl p-8 shadow-lg">
            <p className="text-red-600 dark:text-red-400 text-lg">{error}</p>
            <button 
              onClick={fetchPosts}
              className="mt-6 px-6 py-3 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 text-white rounded-xl transition-all duration-300 font-semibold"
            >
              Zkusit znovu
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-blue-900 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-block p-2 bg-blue-100 dark:bg-blue-900/30 rounded-2xl mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 dark:from-white dark:via-blue-200 dark:to-white bg-clip-text text-transparent mb-6 leading-tight" style={{ lineHeight: '1.4' }}>
            Blog & Novinky
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Objevte nejnovější trendy v architektuře, designu a stavebnictví. 
            Čtěte o našich projektech, inspiraci a odborných poznatcích.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div 
          className="max-w-2xl mx-auto mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Hledat články podle názvu nebo obsahu..."
              className="w-full pl-12 pr-4 py-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-300 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
            />
          </div>
          {searchQuery && (
            <motion.div 
              className="mt-4 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium">
                {filteredPosts.length} {filteredPosts.length === 1 ? 'výsledek' : filteredPosts.length < 5 ? 'výsledky' : 'výsledků'} pro &ldquo;{searchQuery}&rdquo;
                <button 
                  onClick={() => {
                    setInputValue('');
                    setSearchQuery('');
                  }}
                  className="ml-2 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-200"
                >
                  ✕
                </button>
              </span>
            </motion.div>
          )}
        </motion.div>

        {filteredPosts.length === 0 && searchQuery ? (
          <motion.div 
            className="text-center py-20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl p-12 border border-slate-200/50 dark:border-slate-700/50">
              <div className="w-20 h-20 bg-gradient-to-br from-slate-300 to-slate-400 dark:from-slate-600 dark:to-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <MagnifyingGlassIcon className="w-10 h-10 text-slate-500 dark:text-slate-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Žádné výsledky</h3>
              <p className="text-slate-600 dark:text-slate-400 text-lg max-w-md mx-auto mb-6">
                Pro hledaný výraz &ldquo;{searchQuery}&rdquo; jsme nenašli žádné články.
              </p>
              <button 
                onClick={() => {
                  setInputValue('');
                  setSearchQuery('');
                }}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300"
              >
                Vymazat vyhledávání
              </button>
            </div>
          </motion.div>
        ) : posts.length === 0 ? (
          <motion.div 
            className="text-center py-20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl p-12 border border-slate-200/50 dark:border-slate-700/50">
              <div className="w-20 h-20 bg-gradient-to-br from-slate-300 to-slate-400 dark:from-slate-600 dark:to-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-slate-500 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Připravujeme obsah</h3>
              <p className="text-slate-600 dark:text-slate-400 text-lg max-w-md mx-auto">
                Zatím zde nejsou žádné publikované články. Brzy přidáme zajímavý obsah!
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: {
                transition: {
                  staggerChildren: 0.12
                }
              }
            }}
          >
            {filteredPosts.map((post, idx) => (
              <motion.article
                key={post.id}
                className="group bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 overflow-hidden hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                whileHover={{ scale: 1.03, y: -5 }}
              >
                {/* Featured Image */}
                {post.featuredImage && (
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={post.featuredImage}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                )}
                
                <div className="p-8">
                  <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 mb-4">
                    <div className="flex items-center bg-slate-100 dark:bg-slate-700 rounded-full px-3 py-1">
                      <CalendarIcon className="w-4 h-4 mr-1" />
                      <time dateTime={post.createdAt.toString()}>
                        {formatDate(post.createdAt)}
                      </time>
                    </div>
                    {post.author && (
                      <div className="flex items-center bg-blue-100 dark:bg-blue-900/30 rounded-full px-3 py-1 ml-2">
                        <UserIcon className="w-4 h-4 mr-1" />
                        <span>{post.author.name || 'Anonym'}</span>
                      </div>
                    )}
                  </div>
                  
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                    {post.title}
                  </h2>
                  
                  {post.excerpt && (
                    <p className="text-slate-600 dark:text-slate-300 mb-6 line-clamp-3 leading-relaxed">
                      {truncateText(post.excerpt, 150)}
                    </p>
                  )}
                  
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 group-hover:shadow-lg group-hover:shadow-blue-500/25"
                  >
                    Číst článek
                    <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </motion.div>
        )}

        {/* Stats footer */}
        {filteredPosts.length > 0 && (
          <motion.div 
            className="mt-16 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 inline-block">
              <p className="text-slate-600 dark:text-slate-400 text-lg">
                📚 Zobrazeno <span className="font-semibold text-blue-600 dark:text-blue-400">{filteredPosts.length}</span> {filteredPosts.length === 1 ? 'článek' : filteredPosts.length < 5 ? 'články' : 'článků'}
                {searchQuery && <span className="text-slate-500"> z celkem {posts.length}</span>}
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
