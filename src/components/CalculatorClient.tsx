'use client';
import { motion } from 'framer-motion';
import { useState, useMemo } from 'react';
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

// DPH sazba v ČR
const VAT_RATE = 0.21;

interface ProjectType {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  pricePerM2: number; // Cena za m² bez DPH
  minPrice: number;   // Minimální cena projektu
}

interface ComplexityLevel {
  id: string;
  name: string;
  multiplier: number;
  description: string;
}

export default function CalculatorClient() {
  const t = useTranslations('Calculator');
  const [selectedType, setSelectedType] = useState<ProjectType | null>(null);
  const [complexity, setComplexity] = useState('standard');
  const [area, setArea] = useState<number>(100);
  const [includeInterior, setIncludeInterior] = useState(false);
  const [includePermit, setIncludePermit] = useState(false);

  // Ceny za m² pro architektonické služby (realistické pro ČR 2024)
  // Rodinný dům má vyšší cenu za m² (unikátní návrh)
  // Bytový dům má nižší cenu za m² (opakování bytů) ale vyšší min. cenu (je větší)
  const projectTypes: ProjectType[] = [
    { 
      id: 'residential', 
      name: t('projectTypes.residential'), 
      icon: HomeIcon, 
      pricePerM2: 1000,   // Rodinný dům: 1000 Kč/m² (individuální návrh)
      minPrice: 80000     // Minimálně 80 000 Kč (i pro malý dům)
    },
    { 
      id: 'apartment', 
      name: t('projectTypes.apartment'), 
      icon: BuildingOfficeIcon, 
      pricePerM2: 500,    // Bytový dům: nižší cena za m² (opakování)
      minPrice: 250000    // Ale vyšší minimum (větší projekt)
    },
    { 
      id: 'commercial', 
      name: t('projectTypes.commercial'), 
      icon: BuildingStorefrontIcon, 
      pricePerM2: 700,    // Komerční: střední cena za m²
      minPrice: 150000    // Minimálně 150 000 Kč
    },
  ];

  const complexityLevels: ComplexityLevel[] = useMemo(() => [
    { id: 'simple', name: t('complexityLevels.simple.name'), multiplier: 0.8, description: t('complexityLevels.simple.description') },
    { id: 'standard', name: t('complexityLevels.standard.name'), multiplier: 1.0, description: t('complexityLevels.standard.description') },
    { id: 'complex', name: t('complexityLevels.complex.name'), multiplier: 1.4, description: t('complexityLevels.complex.description') },
  ], [t]);

  // Výpočet ceny
  const priceCalculation = useMemo(() => {
    if (!selectedType) {
      return {
        basePrice: 0,
        afterComplexity: 0,
        interiorPrice: 0,
        permitPrice: 0,
        totalWithoutVAT: 0,
        vatAmount: 0,
        totalWithVAT: 0,
        complexityMultiplier: 1,
      };
    }

    const complexityMultiplier = complexityLevels.find(c => c.id === complexity)?.multiplier || 1;
    
    // 1. Základní cena = cena za m² × plocha (ale minimálně minPrice)
    const calculatedBasePrice = selectedType.pricePerM2 * area;
    const basePrice = Math.max(calculatedBasePrice, selectedType.minPrice);
    
    // 2. Po aplikaci složitosti
    const afterComplexity = Math.round(basePrice * complexityMultiplier);
    
    // 3. Příplatky za služby
    const interiorPrice = includeInterior ? Math.round(afterComplexity * 0.30) : 0;
    const permitPrice = includePermit ? Math.round(afterComplexity * 0.20) : 0;
    
    // 4. Celkem bez DPH
    const totalWithoutVAT = afterComplexity + interiorPrice + permitPrice;
    
    // 5. DPH 21%
    const vatAmount = Math.round(totalWithoutVAT * VAT_RATE);
    
    // 6. Celkem s DPH
    const totalWithVAT = totalWithoutVAT + vatAmount;
    
    return {
      basePrice,
      afterComplexity,
      interiorPrice,
      permitPrice,
      totalWithoutVAT,
      vatAmount,
      totalWithVAT,
      complexityMultiplier,
    };
  }, [selectedType, complexity, area, includeInterior, includePermit, complexityLevels]);

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
                            {type.pricePerM2.toLocaleString()} Kč/m² (min. {type.minPrice.toLocaleString()} Kč)
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
                    <div className="flex justify-between items-center">
                      <div className="font-medium text-gray-900 dark:text-white">{level.name}</div>
                      <div className="text-sm text-blue-600 dark:text-blue-400">×{level.multiplier}</div>
                    </div>
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
              <div className="flex items-center space-x-3">
                <input
                  type="number"
                  value={area || ''}
                  onChange={(e) => setArea(e.target.value === '' ? 0 : Number(e.target.value))}
                  min="20"
                  max="5000"
                  className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <span className="text-gray-600 dark:text-gray-400 font-medium">m²</span>
              </div>
              {selectedType && (
                <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {area} m² × {selectedType.pricePerM2} Kč = {(area * selectedType.pricePerM2).toLocaleString()} Kč
                </div>
              )}
            </div>

            {/* Additional Services */}
            <div className="space-y-3">
              <label className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 dark:border-gray-600 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <input
                  type="checkbox"
                  checked={includeInterior}
                  onChange={(e) => setIncludeInterior(e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <div className="flex-1">
                  <span className="text-gray-700 dark:text-gray-300">{t('services.interior')}</span>
                  <span className="ml-2 text-sm text-green-600 dark:text-green-400">(+30%)</span>
                </div>
              </label>
              <label className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 dark:border-gray-600 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <input
                  type="checkbox"
                  checked={includePermit}
                  onChange={(e) => setIncludePermit(e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <div className="flex-1">
                  <span className="text-gray-700 dark:text-gray-300">{t('services.permit')}</span>
                  <span className="ml-2 text-sm text-green-600 dark:text-green-400">(+20%)</span>
                </div>
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

            {/* Main Price */}
            <div className="text-center mb-6">
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">
                {t('results.totalWithVAT')}
              </div>
              <div className="text-5xl font-bold text-blue-600 dark:text-blue-400">
                {priceCalculation.totalWithVAT.toLocaleString()} Kč
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-5 mb-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 text-sm uppercase tracking-wide">
                {t('results.breakdownTitle')}
              </h3>
              
              <div className="space-y-3">
                {/* Base Price */}
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    {t('results.basePrice')} ({area} m² × {selectedType?.pricePerM2 || 0} Kč):
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {priceCalculation.basePrice.toLocaleString()} Kč
                  </span>
                </div>

                {/* Complexity */}
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    {t('results.complexity')} (×{priceCalculation.complexityMultiplier}):
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {priceCalculation.afterComplexity.toLocaleString()} Kč
                  </span>
                </div>

                {/* Interior */}
                {includeInterior && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      {t('services.interior')}:
                    </span>
                    <span className="font-medium text-green-600 dark:text-green-400">
                      +{priceCalculation.interiorPrice.toLocaleString()} Kč
                    </span>
                  </div>
                )}

                {/* Permit */}
                {includePermit && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      {t('services.permit')}:
                    </span>
                    <span className="font-medium text-green-600 dark:text-green-400">
                      +{priceCalculation.permitPrice.toLocaleString()} Kč
                    </span>
                  </div>
                )}

                <div className="border-t border-gray-300 dark:border-gray-600 pt-3 mt-3">
                  {/* Without VAT */}
                  <div className="flex justify-between items-center text-sm mb-2">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                      {t('results.totalWithoutVAT')}:
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {priceCalculation.totalWithoutVAT.toLocaleString()} Kč
                    </span>
                  </div>

                  {/* VAT */}
                  <div className="flex justify-between items-center text-sm mb-2">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                      {t('results.vat')}:
                    </span>
                    <span className="font-semibold text-amber-600 dark:text-amber-400">
                      +{priceCalculation.vatAmount.toLocaleString()} Kč
                    </span>
                  </div>

                  {/* Total */}
                  <div className="flex justify-between items-center pt-2 border-t border-gray-300 dark:border-gray-600">
                    <span className="text-gray-900 dark:text-white font-bold">
                      {t('results.totalFinal')}:
                    </span>
                    <span className="font-bold text-blue-600 dark:text-blue-400 text-lg">
                      {priceCalculation.totalWithVAT.toLocaleString()} Kč
                    </span>
                  </div>
                </div>
              </div>
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
