'use client';

import { useEffect } from 'react';
import { BlogPost } from '@/types/blog';

interface BlogPostSEOProps {
  post: BlogPost;
  url: string;
}

export function BlogPostSEO({ post, url }: BlogPostSEOProps) {
  useEffect(() => {
    // Dynamicky aktualizujeme meta tagy
    if (post.metaTitle) {
      document.title = post.metaTitle;
    } else {
      document.title = `${post.title} | Maxprojekty Blog`;
    }

    // Meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', post.metaDescription || post.excerpt || `Přečtěte si článek: ${post.title}`);
    }

    // Keywords
    if (post.keywords) {
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute('content', post.keywords);
    }

    // Open Graph tags
    updateOrCreateMetaTag('property', 'og:type', 'article');
    updateOrCreateMetaTag('property', 'og:title', post.metaTitle || post.title);
    updateOrCreateMetaTag('property', 'og:description', post.metaDescription || post.excerpt || '');
    updateOrCreateMetaTag('property', 'og:url', url);
    updateOrCreateMetaTag('property', 'og:site_name', 'Maxprojekty');
    
    if (post.featuredImage) {
      updateOrCreateMetaTag('property', 'og:image', post.featuredImage);
      updateOrCreateMetaTag('property', 'og:image:width', '1200');
      updateOrCreateMetaTag('property', 'og:image:height', '630');
      updateOrCreateMetaTag('property', 'og:image:alt', post.title);
    }

    // Article specific OG tags
    updateOrCreateMetaTag('property', 'article:published_time', new Date(post.createdAt).toISOString());
    updateOrCreateMetaTag('property', 'article:modified_time', new Date(post.updatedAt).toISOString());
    if (post.author?.name) {
      updateOrCreateMetaTag('property', 'article:author', post.author.name);
    }

    // Twitter Card tags
    updateOrCreateMetaTag('name', 'twitter:card', 'summary_large_image');
    updateOrCreateMetaTag('name', 'twitter:title', post.metaTitle || post.title);
    updateOrCreateMetaTag('name', 'twitter:description', post.metaDescription || post.excerpt || '');
    if (post.featuredImage) {
      updateOrCreateMetaTag('name', 'twitter:image', post.featuredImage);
    }

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);

  }, [post, url]);

  // JSON-LD Structured Data
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.metaDescription || post.excerpt || '',
    image: post.featuredImage || 'https://maxprojekty.cz/hero-building.jpg',
    datePublished: new Date(post.createdAt).toISOString(),
    dateModified: new Date(post.updatedAt).toISOString(),
    author: {
      '@type': 'Person',
      name: post.author?.name || 'Maxprojekty',
      ...(post.author?.bio && { description: post.author.bio }),
      ...(post.author?.title && { jobTitle: post.author.title })
    },
    publisher: {
      '@type': 'Organization',
      name: 'Maxprojekty',
      logo: {
        '@type': 'ImageObject',
        url: 'https://maxprojekty.cz/logo.png'
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

function updateOrCreateMetaTag(attr: 'name' | 'property', key: string, value: string) {
  let meta = document.querySelector(`meta[${attr}="${key}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attr, key);
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', value);
}
