'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { SafeText, SafeTitle, SafeDescription } from '@/components/SafeText/SafeText';
import {
  ArrowLeftIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  TagIcon,
} from '@heroicons/react/24/outline';

interface Reference {
  id: string;
  title: string;
  slug: string;
  location: string;
  description: string;
  category: string;
  image: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function ReferenceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const t = useTranslations('ReferencesPage');
  
  const [reference, setReference] = useState<Reference | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchReference = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/references/public/${slug}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setError(t('noResults'));
          } else {
            throw new Error(t('loading'));
          }
          return;
        }

        const data = await response.json();
        setReference(data.reference);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReference();
  }, [slug, t]);

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 flex items-center justify-center pt-20 transition-colors duration-300">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (error || !reference) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-20">
          <div className="text-center">
            <BuildingOfficeIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
            <h1 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
              {error || t('noResults')}
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300 transition-colors duration-300">
              {t('tryDifferentSearch')}
            </p>
            <button
              onClick={handleBack}
              className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              {t('backToReferences')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 transition-colors duration-300">
      {/* Header with back button */}
      <div className="bg-white dark:bg-zinc-800 shadow-sm transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pt-20">
          <button
            onClick={handleBack}
            className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-4 transition-colors duration-300"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            {t('backToReferences')}
          </button>
          
          <div className="flex items-center space-x-3 mb-4">
            <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 transition-colors duration-300">
              {reference.category}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center transition-colors duration-300">
              <CalendarIcon className="h-4 w-4 mr-1" />
              {new Date(reference.createdAt).toLocaleDateString('cs-CZ', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>

          <SafeTitle 
            title={reference.title}
            className="text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300"
          />

          <div className="flex items-center text-lg text-gray-600 dark:text-gray-300 transition-colors duration-300">
            <MapPinIcon className="h-5 w-5 mr-2" />
            <SafeText>{reference.location}</SafeText>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Image */}
        {reference.image && (
          <div className="mb-12">
            <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-lg">
              <Image
                src={reference.image}
                alt={reference.title}
                width={800}
                height={450}
                className="w-full h-96 object-cover"
                unoptimized={reference.image.startsWith('http')}
                priority
              />
            </div>
          </div>
        )}

        {/* Description */}
        <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm p-8 mb-8 transition-colors duration-300">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 transition-colors duration-300">
            O projektu
          </h2>
          <div className="prose prose-lg max-w-none">
            <SafeDescription 
              description={reference.description}
              className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line transition-colors duration-300"
            />
          </div>
        </div>

        {/* Project Info */}
        <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm p-8 transition-colors duration-300">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 transition-colors duration-300">
            {t('projectInfo')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-3">
              <MapPinIcon className="h-6 w-6 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0 transition-colors duration-300" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white transition-colors duration-300">{t('location')}</h3>
                <SafeText className="text-gray-600 dark:text-gray-300 transition-colors duration-300">{reference.location}</SafeText>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <TagIcon className="h-6 w-6 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0 transition-colors duration-300" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white transition-colors duration-300">{t('category')}</h3>
                <SafeText className="text-gray-600 dark:text-gray-300 transition-colors duration-300">{reference.category}</SafeText>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <CalendarIcon className="h-6 w-6 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0 transition-colors duration-300" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white transition-colors duration-300">{t('completionDate')}</h3>
                <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">
                  {new Date(reference.createdAt).toLocaleDateString('cs-CZ', {
                    year: 'numeric',
                    month: 'long'
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <BuildingOfficeIcon className="h-6 w-6 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0 transition-colors duration-300" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white transition-colors duration-300">{t('projectType')}</h3>
                <SafeText className="text-gray-600 dark:text-gray-300 transition-colors duration-300">{reference.category}</SafeText>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            {t('contactText')}
          </h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            {t('contactDescription')}
          </p>
          <div className="space-x-4">
            <button
              onClick={() => router.push('/kontakt')}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-gray-50 shadow-sm"
            >
              {t('contactUs')}
            </button>
            <button
              onClick={() => router.push('/references')}
              className="inline-flex items-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-blue-800"
            >
              {t('moreReferences')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}