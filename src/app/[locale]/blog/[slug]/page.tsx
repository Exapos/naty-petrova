'use client';

import React, { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { motion } from 'framer-motion';
import { BlogPost } from '@/types/blog';
import Image from 'next/image';
import { 
  CalendarIcon, 
  UserIcon, 
  ClockIcon,
  ShareIcon,
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { useParams } from 'next/navigation';
import { RenderBlogBlocks } from '@/components/editor/RenderBlogBlocks';


export default function BlogPostPage() {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [previousPost, setPreviousPost] = useState<BlogPost | null>(null);
  const [nextPost, setNextPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const urlParams = useParams();
  const slug = urlParams.slug as string;

  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Načteme článek s navigací a souvisejícími články
        const response = await fetch(`/api/blog/slug/${slug}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            return notFound();
          }
          throw new Error(`Chyba při načítání článku: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Separujeme post data od navigačních dat
        const { navigation, relatedPosts, ...postData } = data;
        
        setPost(postData);
        setRelatedPosts(relatedPosts || []);
        setPreviousPost(navigation?.previous || null);
        setNextPost(navigation?.next || null);
        
      } catch (error) {
        console.error('Error fetching blog data:', error);
        setError(error instanceof Error ? error.message : 'Neznámá chyba');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  const formatDate = (dateString: string | Date) => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.toLocaleDateString('cs-CZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto"></div>
              <p className="mt-4 text-gray-500 dark:text-gray-400">Načítám článek...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <p className="text-red-600 dark:text-red-400">{error}</p>
            <Link 
              href="/blog"
              className="mt-4 inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white rounded transition-colors"
            >
              Zpět na blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Image Header */}
      <div className="relative h-[70vh] overflow-hidden">
        {/* Hero Image */}
        <div className="absolute inset-0">
          <Image
            src={post.featuredImage || "/hero-building.jpg"}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60"></div>
        </div>
        
        {/* Breadcrumb */}
        <div className="absolute left-0 right-0 z-20 top-16 flex justify-start pointer-events-none">
          <div className="max-w-7xl w-full mx-auto px-2 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Link
                href="/blog"
                className="inline-flex items-center text-white/90 hover:text-white font-medium transition-colors group bg-black/20 backdrop-blur-sm px-4 py-2 rounded-lg pointer-events-auto"
              >
                <ChevronLeftIcon className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Zpět na blog
              </Link>
            </motion.div>
          </div>
        </div>
        
        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-4xl"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                {post.title}
              </h1>
              {post.excerpt && (
                <p className="text-xl text-white/90 max-w-3xl leading-relaxed">
                  {post.excerpt}
                </p>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Article Metadata Bar */}
      <div className="bg-white dark:bg-gray-900 py-8 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="flex flex-wrap items-center justify-between gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center">
                <CalendarIcon className="w-4 h-4 mr-2 text-blue-600" />
                <time dateTime={post.createdAt.toString()}>
                  {formatDate(post.createdAt)}
                </time>
              </div>
              {post.author && (
                <div className="flex items-center">
                  <UserIcon className="w-4 h-4 mr-2 text-blue-600" />
                  <span className="font-medium">{post.author.name || 'Maxprojekty'}</span>
                </div>
              )}
              <div className="flex items-center">
                <ClockIcon className="w-4 h-4 mr-2 text-blue-600" />
                <span>5 min čtení</span>
              </div>
            </div>
            
            {post.keywords && (
              <div className="flex items-center gap-2">
                {post.keywords.split(',').slice(0, 3).map((keyword, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full"
                  >
                    {keyword.trim()}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Main Article Layout */}
      <div className="bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Main Article Content */}
            <div className="flex-1 max-w-4xl">
            {/* Share Section */}
            <motion.div
              className="flex items-center justify-between mb-12 pb-6 border-b border-gray-200 dark:border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <UserIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white text-lg">
                    {post.author?.name || 'Maxprojekty'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Architektonický expert</p>
                </div>
              </div>
              
              <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl font-semibold group">
                <ShareIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                Sdílet článek
              </button>
            </motion.div>

              {/* Article Content - Clean Magazine Style */}
            <motion.div
              className="mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div
                className="prose prose-lg md:prose-xl max-w-none
                  prose-headings:text-slate-900 dark:prose-headings:text-slate-100 prose-headings:font-bold prose-headings:tracking-tight
                  prose-p:text-slate-800 dark:prose-p:text-slate-200 prose-p:leading-8 prose-p:mb-6 prose-p:text-lg
                  prose-a:text-blue-600 dark:prose-a:text-blue-300 prose-a:font-semibold hover:prose-a:text-blue-700 dark:hover:prose-a:text-blue-200
                  prose-strong:text-slate-900 dark:prose-strong:text-slate-100 prose-strong:font-semibold
                  prose-ul:text-slate-800 dark:text-slate-200 prose-ul:text-lg prose-ul:space-y-2 prose-ul:mb-6
                  prose-ol:text-slate-800 dark:text-slate-200 prose-ol:text-lg prose-ol:space-y-2 prose-ol:mb-6
                  prose-li:leading-relaxed
                  prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 dark:prose-blockquote:bg-blue-900/20 prose-blockquote:p-6 prose-blockquote:rounded-r-xl prose-blockquote:my-10 prose-blockquote:text-slate-700 dark:prose-blockquote:text-slate-200
                  prose-code:bg-slate-100 dark:prose-code:bg-slate-800 prose-code:text-slate-900 dark:prose-code:text-slate-100 prose-code:px-2 prose-code:py-1 prose-code:rounded-md prose-code:font-medium
                  prose-pre:bg-slate-900 dark:prose-pre:bg-slate-950 prose-pre:text-slate-100 prose-pre:rounded-xl prose-pre:shadow-lg prose-pre:my-8
                  prose-img:rounded-2xl prose-img:shadow-2xl prose-img:my-10 prose-img:border prose-img:border-slate-200 dark:prose-img:border-slate-700
                  prose-figure:my-10"
              >
                {post.editorMode === 'block' && post.blocks ? (
                  <RenderBlogBlocks blocks={post.blocks} globalStyles={post.globalStyles} />
                ) : (
                  <div dangerouslySetInnerHTML={{ __html: post.content }} />
                )}
              </div>
            </motion.div>

            {/* Clean Navigation between articles */}
            <motion.div
              className="mt-12 grid md:grid-cols-2 gap-6 pt-8 border-t border-gray-200 dark:border-gray-700"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              {previousPost ? (
                <Link
                  href={`/blog/${previousPost.slug}`}
                  className="group flex items-center p-6 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <ChevronLeftIcon className="w-5 h-5 mr-3 text-blue-600 group-hover:-translate-x-1 transition-transform" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Předchozí článek</p>
                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                      {previousPost.title}
                    </h3>
                  </div>
                </Link>
              ) : (
                <div></div>
              )}
              
              {nextPost ? (
                <Link
                  href={`/blog/${nextPost.slug}`}
                  className="group flex items-center justify-end p-6 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-right"
                >
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Další článek</p>
                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                      {nextPost.title}
                    </h3>
                  </div>
                  <ChevronRightIcon className="w-5 h-5 ml-3 text-blue-600 group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <div></div>
              )}
            </motion.div>
          </div>

          {/* Clean Sidebar */}
          <div className="lg:w-80 lg:flex-shrink-0">
            <div className="sticky top-8 space-y-6">
              {/* Author Card */}
              <motion.div
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <UserIcon className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      {post.author?.name || 'Maxprojekty'}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Architektonický expert</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Profesionální architektonické a projekční služby s více než 10letou praxí v oboru.
                </p>
              </motion.div>

              {/* Contact CTA */}
              <motion.div
                className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl p-6 text-white"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <h3 className="text-lg font-bold mb-3">Potřebujete poradit?</h3>
                <p className="text-blue-100 text-sm mb-4">
                  Máte projekt? Kontaktujte nás pro nezávaznou konzultaci.
                </p>
                <Link
                  href="/kontakt"
                  className="inline-flex items-center justify-center w-full px-4 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Kontaktujte nás
                  <ArrowRightIcon className="w-4 h-4 ml-2" />
                </Link>
              </motion.div>
            </div>
          </div>

          </div>
        </div>
      </div>

      {/* Premium Related Articles Section */}
      {relatedPosts.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-800 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                DALŠÍ ČLÁNKY
              </h2>
              <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost, index) => (
                <motion.div
                  key={relatedPost.id}
                  className="group bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                >
                  {/* Featured Image for related articles */}
                  {relatedPost.featuredImage && (
                    <div className="relative h-40 overflow-hidden">
                      <Image
                        src={relatedPost.featuredImage}
                        alt={relatedPost.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  )}
                  
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                      <CalendarIcon className="w-4 h-4 mr-1" />
                      {formatDate(relatedPost.createdAt)}
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {relatedPost.title}
                    </h3>
                    
                    {relatedPost.excerpt && (
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                        {relatedPost.excerpt}
                      </p>
                    )}
                    
                    <Link
                      href={`/blog/${relatedPost.slug}`}
                      className="inline-flex items-center text-blue-600 dark:text-blue-400 font-medium text-sm hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                    >
                      Číst článek
                      <ArrowRightIcon className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                href="/blog"
                className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Všechny články
                <ArrowRightIcon className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};