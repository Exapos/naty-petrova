'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import {
  CalculatorIcon,
  HomeIcon,
  BuildingOfficeIcon,
  BuildingStorefrontIcon,
  QuestionMarkCircleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

interface ProjectType {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  basePrice: number;
  multiplier: number;
}

export default function CalculatorClient() {
  const t = useTranslations('Calculator');
  const [selectedType, setSelectedType] = useState<ProjectType | null>(null);
  const [complexity, setComplexity] = useState('standard');
  const [area, setArea] = useState<number>(100);
  const [includeInterior, setIncludeInterior] = useState(false);
  const [includePermit, setIncludePermit] = useState(false);

  const projectTypes: ProjectType[] = [
    { id: 'residential', name: t('projectTypes.residential'), icon: HomeIcon, basePrice: 50000, multiplier: 1 },
    { id: 'apartment', name: t('projectTypes.apartment'), icon: BuildingOfficeIcon, basePrice: 150000, multiplier: 2.5 },
    { id: 'commercial', name: t('projectTypes.commercial'), icon: BuildingStorefrontIcon, basePrice: 200000, multiplier: 3 },
  ];

  const complexityLevels = [
    { id: 'simple', name: t('complexityLevels.simple.name'), multiplier: 0.8, description: t('complexityLevels.simple.description') },
    { id: 'standard', name: t('complexityLevels.standard.name'), multiplier: 1, description: t('complexityLevels.standard.description') },
    { id: 'complex', name: t('complexityLevels.complex.name'), multiplier: 1.5, description: t('complexityLevels.complex.description') },
  ];

  const calculatePrice = () => {
    if (!selectedType) return 0;

    const complexityMultiplier = complexityLevels.find(c => c.id === complexity)?.multiplier || 1;
    const areaMultiplier = Math.max(0.5, Math.min(3, area / 200)); // Area scaling

    let price = selectedType.basePrice * selectedType.multiplier * complexityMultiplier * areaMultiplier;

    if (includeInterior) price *= 1.3;
    if (includePermit) price *= 1.2;

    return Math.round(price);
  };

  const price = calculatePrice();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-20">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-4">
            <CalculatorIcon className="w-16 h-16 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t('title')}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            {t('subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calculator Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {t('configuration')}
            </h2>

            {/* Project Type */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                {t('projectType')}
              </label>
              <div className="grid grid-cols-1 gap-3">
                {projectTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.id}
                      onClick={() => setSelectedType(type)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        selectedType?.id === type.id
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                        <div className="text-left">
                          <div className="font-medium text-gray-900 dark:text-white">{type.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {t('fromPrice')} {type.basePrice.toLocaleString()} Kč
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Complexity */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                {t('complexity')}
              </label>
              <div className="space-y-2">
                {complexityLevels.map((level) => (
                  <button
                    key={level.id}
                    onClick={() => setComplexity(level.id)}
                    className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                      complexity === level.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-gray-900 dark:text-white">{level.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{level.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Area */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                {t('area')}
              </label>
              <input
                type="number"
                value={area || ''}
                onChange={(e) => setArea(e.target.value === '' ? 0 : Number(e.target.value))}
                min="20"
                max="2000"
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            {/* Additional Services */}
            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={includeInterior}
                  onChange={(e) => setIncludeInterior(e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700 dark:text-gray-300">{t('services.interior')}</span>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={includePermit}
                  onChange={(e) => setIncludePermit(e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700 dark:text-gray-300">{t('services.permit')}</span>
              </label>
            </div>
          </motion.div>

          {/* Price Display */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {t('results.title')}
            </h2>

            <div className="text-center mb-8">
              <div className="text-6xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {price.toLocaleString()} Kč
              </div>
              <div className="text-gray-500 dark:text-gray-400">
                {t('results.vatNote')}
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-3 mb-8">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">{t('breakdown.basePrice')}:</span>
                <span className="text-gray-900 dark:text-white">
                  {selectedType ? (selectedType.basePrice * selectedType.multiplier).toLocaleString() : 0} Kč
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">{t('breakdown.complexity')}:</span>
                <span className="text-gray-900 dark:text-white">
                  {complexityLevels.find(c => c.id === complexity)?.name}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">{t('breakdown.area')}:</span>
                <span className="text-gray-900 dark:text-white">{area} m²</span>
              </div>
              {includeInterior && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">{t('breakdown.interior')}:</span>
                  <span className="text-green-600 dark:text-green-400">+30%</span>
                </div>
              )}
              {includePermit && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">{t('breakdown.permit')}:</span>
                  <span className="text-green-600 dark:text-green-400">+20%</span>
                </div>
              )}
            </div>

            {/* CTA */}
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {t('cta.note')}
              </p>
              <Link
                href="/kontakt"
                className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                {t('cta.button')}
                <CheckCircleIcon className="w-5 h-5 ml-2" />
              </Link>
            </div>

            {/* Disclaimer */}
            <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="flex items-start space-x-2">
                <QuestionMarkCircleIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>{t('disclaimer.title')}:</strong> {t('disclaimer.message')}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}