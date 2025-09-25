'use client';
import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft,
  MapPin, 
  Clock, 
  Building2,
  DollarSign,
  Send,
  User,
  Mail,
  Phone,
  MessageSquare,
  CheckCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { JobPosition } from '@/types/career';

export default function JobDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [position, setPosition] = useState<JobPosition | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showApplication, setShowApplication] = useState(false);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);
  const [applicationLoading, setApplicationLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    coverLetter: ''
  });

  const fetchPosition = useCallback(async () => {
    try {
      const response = await fetch(`/api/jobs/${slug}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('Pozice nenalezena');
        } else {
          throw new Error('Chyba při načítání pozice');
        }
        return;
      }

      const data = await response.json();
      setPosition(data.position);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    if (!slug) return;
    fetchPosition();
  }, [slug, fetchPosition]);

  const getJobTypeLabel = (type: string) => {
    const types = {
      'FULL_TIME': 'Plný úvazek',
      'PART_TIME': 'Částečný úvazek',
      'CONTRACT': 'Smlouva',
      'INTERNSHIP': 'Stáž'
    };
    return types[type as keyof typeof types] || type;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!position) return;
    
    setApplicationLoading(true);
    
    try {
      const response = await fetch('/api/jobs/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobPositionId: position.id,
          ...formData
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Chyba při odesílání žádosti');
      }

      setApplicationSubmitted(true);
      setShowApplication(false);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        coverLetter: ''
      });
    } catch (err: any) {
      alert(err.message);
    } finally {
      setApplicationLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 flex items-center justify-center pt-20 transition-colors duration-300">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Načítání pozice...</p>
        </div>
      </div>
    );
  }

  if (error || !position) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-20">
          <div className="text-center">
            <Building2 className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
            <h1 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
              {error}
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300 transition-colors duration-300">
              Zkuste se vrátit na seznam pozic
            </p>
            <Link
              href="/kariera"
              className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Zpět na kariéru
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 transition-colors duration-300">
      {/* Header */}
      <div className="bg-white dark:bg-zinc-800 shadow-sm transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pt-20">
          <Link
            href="/kariera"
            className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-300 mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Zpět na kariéru
          </Link>
          
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span className="inline-flex px-4 py-2 text-sm font-semibold rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200">
              {position.department}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 transition-colors duration-300">
            {position.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-lg text-gray-600 dark:text-gray-300">
            <div className="flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              {position.location}
            </div>
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              {getJobTypeLabel(position.type)}
            </div>
            <div className="flex items-center">
              <Building2 className="h-5 w-5 mr-2" />
              {position.department}
            </div>
            {position.salary && (
              <div className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                {position.salary}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm p-8 transition-colors duration-300">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Popis pozice
              </h2>
              <div className="prose prose-lg max-w-none dark:prose-invert">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                  {position.description}
                </p>
              </div>
            </div>

            {/* Requirements */}
            {position.requirements && (
              <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm p-8 transition-colors duration-300">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Požadavky
                </h2>
                <div className="prose prose-lg max-w-none dark:prose-invert">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                    {position.requirements}
                  </p>
                </div>
              </div>
            )}

            {/* Benefits */}
            {position.benefits && (
              <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm p-8 transition-colors duration-300">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Co nabízíme
                </h2>
                <div className="prose prose-lg max-w-none dark:prose-invert">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                    {position.benefits}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Application Card */}
            {position.isActive && !applicationSubmitted && (
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">
                  Zaujala vás tato pozice?
                </h3>
                <p className="text-blue-100 mb-6">
                  Vyplňte formulář a ozveme se vám co nejdříve.
                </p>
                <button
                  onClick={() => setShowApplication(true)}
                  className="w-full bg-white text-blue-600 font-semibold py-3 px-6 rounded-lg hover:bg-blue-50 transition-colors duration-300"
                >
                  Poslat žádost
                </button>
              </div>
            )}

            {/* Success Message */}
            {applicationSubmitted && (
              <motion.div
                className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-8"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center mb-4">
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400 mr-3" />
                  <h3 className="text-lg font-semibold text-green-800 dark:text-green-300">
                    Žádost odeslána!
                  </h3>
                </div>
                <p className="text-green-700 dark:text-green-300">
                  Děkujeme za váš zájem. Ozveme se vám co nejdříve.
                </p>
              </motion.div>
            )}

            {/* Contact Info */}
            <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm p-8 transition-colors duration-300">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Máte otázky?
              </h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-gray-400 mr-3" />
                  <a 
                    href="mailto:info@maxprojekty.cz"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    info@maxprojekty.cz
                  </a>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Neváhejte se na nás obrátit s jakýmikoli dotazy ohledně této pozice.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {showApplication && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            className="bg-white dark:bg-zinc-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Žádost o pozici
                </h2>
                <button
                  onClick={() => setShowApplication(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmitApplication} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Jméno *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-zinc-700 dark:text-white"
                        placeholder="Vaše jméno"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Příjmení *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-zinc-700 dark:text-white"
                        placeholder="Vaše příjmení"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-zinc-700 dark:text-white"
                      placeholder="vas@email.cz"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Telefon
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-zinc-700 dark:text-white"
                      placeholder="+420 xxx xxx xxx"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Motivační dopis *
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
                    <textarea
                      name="coverLetter"
                      value={formData.coverLetter}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-zinc-700 dark:text-white"
                      placeholder="Proč máme zvolit právě vás? Napište nám o sobě..."
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowApplication(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 dark:border-zinc-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors duration-300"
                  >
                    Zrušit
                  </button>
                  <button
                    type="submit"
                    disabled={applicationLoading}
                    className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors duration-300 flex items-center justify-center"
                  >
                    {applicationLoading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Odeslat žádost
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}