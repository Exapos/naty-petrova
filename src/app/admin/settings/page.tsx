'use client';
import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import { 
  UserIcon, 
  ShieldCheckIcon,
  GlobeAltIcon,
  CheckCircleIcon,
  XMarkIcon,
  ComputerDesktopIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  ClockIcon,
  MapPinIcon,
  DevicePhoneMobileIcon
} from '@heroicons/react/24/outline';

// Typ pro zdroj integrace
type IntegrationSource = 'env' | 'database' | 'none';

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const [activeTab, setActiveTab] = useState('account');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);
  
  const [userSettings, setUserSettings] = useState({
    name: '',
    email: '',
    bio: '',
    title: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [integrations, setIntegrations] = useState({
    googleAnalytics: '',
    facebookPixel: '',
    googleTagManager: '',
    hotjar: '',
    mailchimp: '',
    gaServiceAccountEmail: '',
    gaServiceAccountPrivateKey: '',
    gaPropertyId: '',
  });

  // Zdroje integrací (env/database/none)
  const [integrationSources, setIntegrationSources] = useState<Record<string, IntegrationSource>>({});
  const [envVariables, setEnvVariables] = useState<Record<string, string>>({});

  const [sessions, setSessions] = useState<any[]>([]);

  // Filtruji tabs podle role uživatele
  const getTabs = () => {
    const baseTabs = [
      { id: 'account', name: 'Účet', icon: UserIcon },
      { id: 'security', name: 'Zabezpečení', icon: ShieldCheckIcon },
    ];
    
    // Pouze admin vidí integrace
    if (session?.user?.role === 'ADMIN') {
      baseTabs.push({ id: 'integrations', name: 'Integrace', icon: GlobeAltIcon });
    }
    
    return baseTabs;
  };

  const tabs = getTabs();

  useEffect(() => {
    if (session?.user) {
      setUserSettings(prev => ({
        ...prev,
        name: session.user?.name || '',
        email: session.user?.email || '',
      }));
      
      // Načtení bio a title z API
      loadUserProfile();
      
      // Načtení integrací pro admin uživatele
      if (session.user.role === 'ADMIN') {
        loadIntegrations();
      }
    }
  }, [session]);

  const loadIntegrations = async () => {
    try {
      const response = await fetch('/api/settings/integrations');
      if (response.ok) {
        const data = await response.json();
        setIntegrations(data.integrations);
        setIntegrationSources(data.sources || {});
        setEnvVariables(data.envVariables || {});
      }
    } catch (error) {
      console.error('Error loading integrations:', error);
    }
  };

  const loadUserProfile = async () => {
    try {
      const response = await fetch('/api/user/profile');
      if (response.ok) {
        const data = await response.json();
        setUserSettings(prev => ({
          ...prev,
          bio: data.bio || '',
          title: data.title || '',
        }));
      } else {
        showNotification('error', 'Nepodařilo se načíst profilová data');
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      showNotification('error', 'Nepodařilo se načíst profilová data');
    }
  };

  // Helper pro získání barvy a textu zdroje integrace
  const getSourceBadge = (key: string) => {
    const source = integrationSources[key];
    const envVar = envVariables[key];
    
    if (source === 'env') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800" title={`Hodnota z environment variable: ${envVar}`}>
          <CheckCircleIcon className="w-3 h-3 mr-1" />
          .env
        </span>
      );
    } else if (source === 'database') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800" title="Hodnota z databáze">
          <InformationCircleIcon className="w-3 h-3 mr-1" />
          Databáze
        </span>
      );
    }
    return null;
  };

  // Je pole editovatelné? (pouze pokud není v .env)
  const isFieldEditable = (key: string) => {
    return integrationSources[key] !== 'env';
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleUserSettingsChange = (key: string, value: string) => {
    setUserSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleIntegrationsChange = (key: string, value: string) => {
    setIntegrations(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveAccount = async () => {
    if (!userSettings.name.trim() || !userSettings.email.trim()) {
      showNotification('error', 'Vyplňte všechna povinná pole');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: userSettings.name,
          email: userSettings.email,
          bio: userSettings.bio,
          title: userSettings.title,
        }),
      });

      if (response.ok) {
        showNotification('success', 'Profil byl úspěšně aktualizován');
        // Trigger session update
        await update({ name: userSettings.name, email: userSettings.email });
      } else {
        throw new Error('Chyba při ukládání');
      }
    } catch (error) {
      showNotification('error', 'Nepodařilo se uložit změny');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!userSettings.currentPassword || !userSettings.newPassword || !userSettings.confirmPassword) {
      showNotification('error', 'Vyplňte všechna pole pro změnu hesla');
      return;
    }

    if (userSettings.newPassword !== userSettings.confirmPassword) {
      showNotification('error', 'Nová hesla se neshodují');
      return;
    }

    if (userSettings.newPassword.length < 8) {
      showNotification('error', 'Nové heslo musí mít alespoň 8 znaků');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/user/change-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: userSettings.currentPassword,
          newPassword: userSettings.newPassword,
        }),
      });

      if (response.ok) {
        showNotification('success', 'Heslo bylo změněno');
        setUserSettings(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        }));
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Chyba při změně hesla');
      }
    } catch (error: any) {
      showNotification('error', error.message || 'Nepodařilo se změnit heslo');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveIntegrations = async () => {
    // Pouze admin může ukládat integrace
    if (session?.user?.role !== 'ADMIN') {
      showNotification('error', 'Nemáte oprávnění k úpravě integrací');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/settings/integrations', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(integrations),
      });

      if (response.ok) {
        showNotification('success', 'Integrace byly aktualizovány');
      } else {
        throw new Error('Chyba při ukládání');
      }
    } catch (error) {
      showNotification('error', 'Nepodařilo se uložit integrace');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadSessions = async () => {
    try {
      const response = await fetch('/api/user/sessions');
      if (response.ok) {
        const data = await response.json();
        setSessions(data.sessions || []);
      }
    } catch (error) {
      console.error('Error loading sessions:', error);
    }
  };

  const handleTerminateSession = async (sessionId: string) => {
    try {
      const response = await fetch('/api/user/sessions', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      });

      if (response.ok) {
        showNotification('success', 'Relace byla ukončena');
        loadSessions(); // Reload sessions
      } else {
        throw new Error('Chyba při ukončování relace');
      }
    } catch (error) {
      showNotification('error', 'Nepodařilo se ukončit relaci');
      console.error(error);
    }
  };

  const handleTerminateAllSessions = async () => {
    if (!confirm('Opravdu chcete ukončit všechny relace? Budete odhlášeni ze všech zařízení.')) {
      return;
    }

    try {
      const response = await fetch('/api/user/sessions/terminate-all', {
        method: 'POST',
      });

      if (response.ok) {
        showNotification('success', 'Všechny relace byly ukončeny');
        // Odhlásit uživatele po ukončení všech sessions
        setTimeout(() => {
          signOut({ callbackUrl: '/admin' });
        }, 2000);
      } else {
        throw new Error('Chyba při ukončování relací');
      }
    } catch (error) {
      showNotification('error', 'Nepodařilo se ukončit relace');
      console.error(error);
    }
  };

  // Load sessions when security tab is active
  useEffect(() => {
    if (activeTab === 'security') {
      loadSessions();
    }
  }, [activeTab]);

  return (
    <div className="space-y-6">
      {/* Header with user info */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white text-xl font-bold">
              {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : 'U'}
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {session?.user?.name || 'Uživatel'}
            </h1>
            <p className="text-gray-600">{session?.user?.email}</p>
            <p className="text-sm text-gray-500">Spravujte nastavení vašeho účtu a integrace</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-5 h-5 mr-2" />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Notification */}
      {notification && (
        <div className={`rounded-md p-4 mb-4 ${
          notification.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          <div className="flex">
            <div className="flex-shrink-0">
              {notification.type === 'success' ? (
                <CheckCircleIcon className="h-5 w-5 text-green-400" />
              ) : (
                <XMarkIcon className="h-5 w-5 text-red-400" />
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{notification.message}</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {activeTab === 'account' && (
          <div className="p-6 space-y-8">
            {/* Profil */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center mb-6">
                <UserIcon className="w-6 h-6 text-gray-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Osobní údaje</h3>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Jméno *
                    </label>
                    <input
                      type="text"
                      value={userSettings.name}
                      onChange={(e) => handleUserSettingsChange('name', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      placeholder="Zadejte vaše jméno"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      E-mail *
                    </label>
                    <input
                      type="email"
                      value={userSettings.email}
                      onChange={(e) => handleUserSettingsChange('email', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      placeholder="Zadejte váš e-mail"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Titul (např. &quot;Architektonický expert&quot;)
                    </label>
                    <input
                      type="text"
                      value={userSettings.title}
                      onChange={(e) => handleUserSettingsChange('title', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      placeholder="Zadejte váš profesní titul"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio / Popisek
                  </label>
                  <textarea
                    value={userSettings.bio}
                    onChange={(e) => handleUserSettingsChange('bio', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    placeholder="Profesionální architektonické a projekční služby s více než 10letou praxí v oboru..."
                  />
                </div>
                
                <div className="flex justify-end">
                  <button 
                    onClick={handleSaveAccount}
                    disabled={loading}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    {loading ? 'Ukládám...' : 'Uložit změny'}
                  </button>
                </div>
              </div>
            </div>

            {/* Změna hesla */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center mb-6">
                <ShieldCheckIcon className="w-6 h-6 text-gray-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Zabezpečení hesla</h3>
              </div>
              
              <div className="space-y-6 max-w-md">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Současné heslo
                  </label>
                  <input 
                    type="password" 
                    value={userSettings.currentPassword}
                    onChange={(e) => handleUserSettingsChange('currentPassword', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    placeholder="Zadejte současné heslo"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nové heslo
                  </label>
                  <input 
                    type="password" 
                    value={userSettings.newPassword}
                    onChange={(e) => handleUserSettingsChange('newPassword', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    placeholder="Zadejte nové heslo (min. 8 znaků)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Potvrdit nové heslo
                  </label>
                  <input 
                    type="password" 
                    value={userSettings.confirmPassword}
                    onChange={(e) => handleUserSettingsChange('confirmPassword', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    placeholder="Potvrďte nové heslo"
                  />
                </div>
                <div className="flex justify-start">
                  <button 
                    onClick={handleChangePassword}
                    disabled={loading}
                    className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    {loading ? 'Měním heslo...' : 'Změnit heslo'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Zabezpečení</h3>
              <span className="text-sm text-gray-500">
                Spravujte přihlášení a zabezpečení vašeho účtu
              </span>
            </div>
            
            <div className="space-y-6">
              {/* Aktivní relace */}
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-md font-medium text-gray-900 flex items-center">
                    <ComputerDesktopIcon className="w-5 h-5 mr-2 text-gray-600" />
                    Aktivní relace
                  </h4>
                  <button
                    onClick={loadSessions}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Obnovit
                  </button>
                </div>
                
                {loading ? (
                  <div className="p-4 text-center text-gray-500">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2">Načítání relací...</p>
                  </div>
                ) : sessions.length === 0 ? (
                  <div className="p-6 text-center bg-white rounded-lg border border-dashed border-gray-300">
                    <ComputerDesktopIcon className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500">Žádné aktivní relace nenalezeny</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Session tracking bude aktivován při příštím přihlášení
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {sessions.map((sessionItem, index) => {
                      const isCurrentSession = index === 0;
                      const lastActivity = new Date(sessionItem.lastActivity);
                      const timeAgo = lastActivity.toLocaleString('cs-CZ');
                      
                      // Detekce typu zařízení z user agent
                      const isMobile = sessionItem.userAgent?.toLowerCase().includes('mobile');
                      const DeviceIcon = isMobile ? DevicePhoneMobileIcon : ComputerDesktopIcon;
                      
                      return (
                        <div 
                          key={sessionItem.id} 
                          className={`flex items-center justify-between p-4 bg-white rounded-lg border ${
                            isCurrentSession ? 'border-green-200 bg-green-50' : 'border-gray-200'
                          }`}
                        >
                          <div className="flex items-center flex-1">
                            <div className={`p-2 rounded-lg mr-4 ${
                              isCurrentSession ? 'bg-green-100' : 'bg-gray-100'
                            }`}>
                              <DeviceIcon className={`w-6 h-6 ${
                                isCurrentSession ? 'text-green-600' : 'text-gray-500'
                              }`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2">
                                <h5 className="text-sm font-medium text-gray-900">
                                  {isCurrentSession ? 'Současná relace' : (isMobile ? 'Mobilní zařízení' : 'Desktop')}
                                </h5>
                                {isCurrentSession && (
                                  <span className="px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded-full">
                                    Aktivní
                                  </span>
                                )}
                              </div>
                              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                                <span className="flex items-center">
                                  <ClockIcon className="w-3 h-3 mr-1" />
                                  {timeAgo}
                                </span>
                                {sessionItem.ipAddress && (
                                  <span className="flex items-center">
                                    <MapPinIcon className="w-3 h-3 mr-1" />
                                    {sessionItem.ipAddress}
                                  </span>
                                )}
                              </div>
                              {sessionItem.userAgent && (
                                <p className="text-xs text-gray-400 mt-1 truncate max-w-md">
                                  {sessionItem.userAgent}
                                </p>
                              )}
                            </div>
                          </div>
                          
                          {!isCurrentSession && (
                            <button 
                              onClick={() => handleTerminateSession(sessionItem.id)}
                              className="ml-4 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors flex-shrink-0"
                            >
                              Ukončit
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Dvoufaktorové ověření */}
              <TwoFactorSection showNotification={showNotification} />

              {/* Bezpečnostní akce */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
                  <ExclamationTriangleIcon className="w-5 h-5 mr-2 text-red-500" />
                  Bezpečnostní akce
                </h4>
                <div className="space-y-3">
                  <button
                    onClick={handleTerminateAllSessions}
                    className="w-full flex items-center justify-between px-4 py-3 bg-white border border-red-200 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <div className="flex items-center">
                      <XMarkIcon className="w-5 h-5 mr-3" />
                      <div className="text-left">
                        <p className="font-medium">Odhlásit ze všech zařízení</p>
                        <p className="text-xs text-red-400">Ukončí všechny aktivní relace včetně této</p>
                      </div>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => signOut({ callbackUrl: '/admin' })}
                    className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center">
                      <UserIcon className="w-5 h-5 mr-3" />
                      <div className="text-left">
                        <p className="font-medium">Odhlásit se</p>
                        <p className="text-xs text-gray-400">Odhlásí vás z tohoto zařízení</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Bezpečnostní tipy */}
              <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
                <h4 className="text-md font-medium text-blue-900 mb-3 flex items-center">
                  <InformationCircleIcon className="w-5 h-5 mr-2" />
                  Bezpečnostní doporučení
                </h4>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li className="flex items-start">
                    <CheckCircleIcon className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Používejte silné a unikátní heslo pro váš účet</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Pravidelně kontrolujte aktivní relace a ukončujte neznámé</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Nepoužívejte veřejné Wi-Fi sítě pro přístup k administraci</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Po dokončení práce se vždy odhlaste</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'integrations' && (
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Integrace</h3>
              <button
                onClick={loadIntegrations}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Obnovit
              </button>
            </div>

            {/* Info o prioritě .env */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <InformationCircleIcon className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-blue-900">Priorita konfigurace</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Hodnoty se primárně načítají z <code className="px-1 py-0.5 bg-blue-100 rounded">.env</code> souboru. 
                    Pokud tam nejsou nastaveny, můžete je konfigurovat zde a uloží se do databáze.
                  </p>
                  <p className="text-xs text-blue-600 mt-2">
                    Pole označená <span className="px-1.5 py-0.5 bg-green-100 text-green-800 rounded text-xs">.env</span> jsou 
                    nastavena v environment variables a nelze je zde měnit.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Formulář pro integrace */}
            <div className="space-y-6">
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <h4 className="text-md font-medium text-gray-900 mb-4">Google Analytics 4</h4>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Measurement ID
                      </label>
                      {getSourceBadge('googleAnalytics')}
                    </div>
                    <input
                      type="text"
                      value={integrations.googleAnalytics}
                      onChange={(e) => handleIntegrationsChange('googleAnalytics', e.target.value)}
                      placeholder="G-XXXXXXXXXX"
                      disabled={!isFieldEditable('googleAnalytics')}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        !isFieldEditable('googleAnalytics') ? 'bg-gray-100 cursor-not-allowed' : ''
                      }`}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Measurement ID z Google Analytics (pro tracking) • ENV: <code className="text-xs">NEXT_PUBLIC_GA_MEASUREMENT_ID</code>
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Property ID
                      </label>
                      {getSourceBadge('gaPropertyId')}
                    </div>
                    <input
                      type="text"
                      value={integrations.gaPropertyId}
                      onChange={(e) => handleIntegrationsChange('gaPropertyId', e.target.value)}
                      placeholder="123456789"
                      disabled={!isFieldEditable('gaPropertyId')}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        !isFieldEditable('gaPropertyId') ? 'bg-gray-100 cursor-not-allowed' : ''
                      }`}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Číselné Property ID z Google Analytics (pro API) • ENV: <code className="text-xs">GA_PROPERTY_ID</code>
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Service Account Email
                      </label>
                      {getSourceBadge('gaServiceAccountEmail')}
                    </div>
                    <input
                      type="email"
                      value={integrations.gaServiceAccountEmail}
                      onChange={(e) => handleIntegrationsChange('gaServiceAccountEmail', e.target.value)}
                      placeholder="ga-service-account@project.iam.gserviceaccount.com"
                      disabled={!isFieldEditable('gaServiceAccountEmail')}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        !isFieldEditable('gaServiceAccountEmail') ? 'bg-gray-100 cursor-not-allowed' : ''
                      }`}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      E-mail Service Account z Google Cloud • ENV: <code className="text-xs">GA_SERVICE_ACCOUNT_EMAIL</code>
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Private Key
                      </label>
                      {getSourceBadge('gaServiceAccountPrivateKey')}
                    </div>
                    <textarea
                      value={integrationSources['gaServiceAccountPrivateKey'] === 'env' ? '***NASTAVENO V .ENV***' : integrations.gaServiceAccountPrivateKey}
                      onChange={(e) => handleIntegrationsChange('gaServiceAccountPrivateKey', e.target.value)}
                      placeholder="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
                      rows={4}
                      disabled={!isFieldEditable('gaServiceAccountPrivateKey')}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-xs ${
                        !isFieldEditable('gaServiceAccountPrivateKey') ? 'bg-gray-100 cursor-not-allowed' : ''
                      }`}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Privátní klíč ze souboru JSON • ENV: <code className="text-xs">GA_SERVICE_ACCOUNT_PRIVATE_KEY</code>
                    </p>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                    <div className="flex">
                      <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500 mr-3 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-yellow-800">
                          <strong>Doporučení:</strong> Pro produkční prostředí použijte environment variables v <code className="px-1 bg-yellow-100 rounded">.env</code> souboru. 
                          Hodnoty uložené v databázi jsou méně bezpečné.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Facebook Pixel ID
                  </label>
                  {getSourceBadge('facebookPixel')}
                </div>
                <input
                  type="text"
                  value={integrations.facebookPixel}
                  onChange={(e) => handleIntegrationsChange('facebookPixel', e.target.value)}
                  placeholder="123456789012345"
                  disabled={!isFieldEditable('facebookPixel')}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    !isFieldEditable('facebookPixel') ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Pro sledování konverzí a remarketing • ENV: <code className="text-xs">NEXT_PUBLIC_FB_PIXEL_ID</code>
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Google Tag Manager ID
                  </label>
                  {getSourceBadge('googleTagManager')}
                </div>
                <input
                  type="text"
                  value={integrations.googleTagManager}
                  onChange={(e) => handleIntegrationsChange('googleTagManager', e.target.value)}
                  placeholder="GTM-XXXXXXX"
                  disabled={!isFieldEditable('googleTagManager')}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    !isFieldEditable('googleTagManager') ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Pro centralizované správu tagů • ENV: <code className="text-xs">NEXT_PUBLIC_GTM_ID</code>
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Hotjar Site ID
                  </label>
                  {getSourceBadge('hotjar')}
                </div>
                <input
                  type="text"
                  value={integrations.hotjar}
                  onChange={(e) => handleIntegrationsChange('hotjar', e.target.value)}
                  placeholder="1234567"
                  disabled={!isFieldEditable('hotjar')}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    !isFieldEditable('hotjar') ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Heatmapy a nahrávky uživatelských relací • ENV: <code className="text-xs">NEXT_PUBLIC_HOTJAR_ID</code>
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Mailchimp API Key
                  </label>
                  {getSourceBadge('mailchimp')}
                </div>
                <input
                  type="text"
                  value={integrations.mailchimp}
                  onChange={(e) => handleIntegrationsChange('mailchimp', e.target.value)}
                  placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-us1"
                  disabled={!isFieldEditable('mailchimp')}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    !isFieldEditable('mailchimp') ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Pro e-mail marketing a newslettery • ENV: <code className="text-xs">MAILCHIMP_API_KEY</code>
                </p>
              </div>

              <div className="pt-4 flex items-center space-x-4">
                <button 
                  onClick={handleSaveIntegrations}
                  disabled={loading}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 font-medium transition-colors"
                >
                  {loading ? 'Ukládám...' : 'Uložit integrace'}
                </button>
                <span className="text-sm text-gray-500">
                  Ukládá pouze hodnoty, které nejsou nastaveny v .env
                </span>
              </div>
            </div>

            {/* Dostupné integrace */}
            <div className="border-t pt-6">
              <h4 className="text-sm font-medium text-gray-900 mb-4">Stav integrací</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-white font-bold text-sm">G</span>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-gray-900">Google Analytics 4</h5>
                      <p className="text-xs text-gray-500">
                        {integrations.googleAnalytics && integrations.gaPropertyId && integrations.gaServiceAccountEmail && integrations.gaServiceAccountPrivateKey
                          ? 'Kompletní nastavení s API přístupem'
                          : integrations.googleAnalytics
                          ? 'Pouze základní tracking'
                          : 'Sledování návštěvnosti'
                        }
                      </p>
                    </div>
                  </div>
                  <div className={`px-2 py-1 text-xs rounded-full ${
                    integrations.googleAnalytics && integrations.gaPropertyId && integrations.gaServiceAccountEmail && integrations.gaServiceAccountPrivateKey
                      ? 'bg-green-100 text-green-800' 
                      : integrations.googleAnalytics
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {integrations.googleAnalytics && integrations.gaPropertyId && integrations.gaServiceAccountEmail && integrations.gaServiceAccountPrivateKey
                      ? 'Plně aktivní'
                      : integrations.googleAnalytics
                      ? 'Částečně aktivní'
                      : 'Neaktivní'
                    }
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-white font-bold text-sm">F</span>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-gray-900">Facebook Pixel</h5>
                      <p className="text-xs text-gray-500">Konverze a remarketing</p>
                    </div>
                  </div>
                  <div className={`px-2 py-1 text-xs rounded-full ${
                    integrations.facebookPixel 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {integrations.facebookPixel ? 'Připojeno' : 'Nepřipojeno'}
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-white font-bold text-sm">H</span>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-gray-900">Hotjar</h5>
                      <p className="text-xs text-gray-500">Heatmapy a UX analýza</p>
                    </div>
                  </div>
                  <div className={`px-2 py-1 text-xs rounded-full ${
                    integrations.hotjar 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {integrations.hotjar ? 'Připojeno' : 'Nepřipojeno'}
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-white font-bold text-sm">M</span>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-gray-900">Mailchimp</h5>
                      <p className="text-xs text-gray-500">E-mail marketing</p>
                    </div>
                  </div>
                  <div className={`px-2 py-1 text-xs rounded-full ${
                    integrations.mailchimp 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {integrations.mailchimp ? 'Připojeno' : 'Nepřipojeno'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Komponenta pro 2FA nastavení
function TwoFactorSection({ showNotification }: { showNotification: (type: 'success' | 'error', message: string) => void }) {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [setupMode, setSetupMode] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[] | null>(null);
  const [disableMode, setDisableMode] = useState(false);
  const [disablePassword, setDisablePassword] = useState('');
  const [disableCode, setDisableCode] = useState('');

  // Load 2FA status on mount
  useEffect(() => {
    load2FAStatus();
  }, []);

  const load2FAStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/user/two-factor');
      if (response.ok) {
        const data = await response.json();
        setTwoFactorEnabled(data.enabled || false);
      }
    } catch (error) {
      console.error('Error loading 2FA status:', error);
    } finally {
      setLoading(false);
    }
  };

  const startSetup = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/user/two-factor');
      if (response.ok) {
        const data = await response.json();
        if (!data.enabled) {
          setQrCode(data.qrCode);
          setSecret(data.manualEntry);
          setSetupMode(true);
        }
      }
    } catch {
      showNotification('error', 'Nepodařilo se zahájit nastavení 2FA');
    } finally {
      setLoading(false);
    }
  };

  const verifyAndEnable = async () => {
    if (verificationCode.length !== 6) {
      showNotification('error', 'Zadejte 6místný kód');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/user/two-factor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: verificationCode }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setBackupCodes(data.backupCodes);
        setTwoFactorEnabled(true);
        showNotification('success', '2FA bylo úspěšně aktivováno');
      } else {
        showNotification('error', data.error || 'Neplatný kód');
      }
    } catch {
      showNotification('error', 'Nepodařilo se aktivovat 2FA');
    } finally {
      setLoading(false);
    }
  };

  const disable2FA = async () => {
    if (!disablePassword || !disableCode) {
      showNotification('error', 'Vyplňte heslo a kód');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/user/two-factor', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: disablePassword, code: disableCode }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setTwoFactorEnabled(false);
        setDisableMode(false);
        setDisablePassword('');
        setDisableCode('');
        showNotification('success', '2FA bylo deaktivováno');
      } else {
        showNotification('error', data.error || 'Nepodařilo se deaktivovat 2FA');
      }
    } catch {
      showNotification('error', 'Nepodařilo se deaktivovat 2FA');
    } finally {
      setLoading(false);
    }
  };

  const cancelSetup = () => {
    setSetupMode(false);
    setQrCode(null);
    setSecret(null);
    setVerificationCode('');
    setBackupCodes(null);
  };

  if (loading && !setupMode && !disableMode) {
    return (
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-64"></div>
        </div>
      </div>
    );
  }

  // Zobrazení záložních kódů po aktivaci
  if (backupCodes) {
    return (
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <ShieldCheckIcon className="w-6 h-6 text-green-600 mr-2" />
          <h4 className="text-md font-medium text-gray-900">2FA bylo aktivováno!</h4>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <h5 className="font-medium text-yellow-800 mb-2">Uložte si záložní kódy</h5>
          <p className="text-sm text-yellow-700 mb-3">
            Tyto kódy můžete použít pro přihlášení, pokud ztratíte přístup k autentikační aplikaci.
            Každý kód lze použít pouze jednou.
          </p>
          <div className="grid grid-cols-2 gap-2 font-mono text-sm bg-white p-3 rounded border border-yellow-300">
            {backupCodes.map((code, i) => (
              <div key={i} className="text-gray-800">{code}</div>
            ))}
          </div>
        </div>
        
        <button
          onClick={() => setBackupCodes(null)}
          className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
        >
          Rozumím, uložil jsem si kódy
        </button>
      </div>
    );
  }

  // Setup mode - zobrazení QR kódu
  if (setupMode) {
    return (
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-md font-medium text-gray-900 flex items-center">
            <ShieldCheckIcon className="w-5 h-5 mr-2 text-gray-600" />
            Nastavení 2FA
          </h4>
          <button
            onClick={cancelSetup}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Zrušit
          </button>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            1. Naskenujte QR kód pomocí autentikační aplikace (Google Authenticator, Authy, atd.)
          </p>
          
          {qrCode && (
            <div className="flex justify-center">
              <Image src={qrCode} alt="2FA QR Code" width={192} height={192} className="border rounded-lg" />
            </div>
          )}

          {secret && (
            <div className="bg-white p-3 rounded-lg border">
              <p className="text-xs text-gray-500 mb-1">Nebo zadejte kód ručně:</p>
              <p className="font-mono text-sm select-all break-all">{secret}</p>
            </div>
          )}

          <p className="text-sm text-gray-600">
            2. Zadejte 6místný kód z aplikace pro ověření:
          </p>

          <input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="000000"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-2xl font-mono tracking-widest"
            maxLength={6}
          />

          <button
            onClick={verifyAndEnable}
            disabled={loading || verificationCode.length !== 6}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {loading ? 'Ověřuji...' : 'Aktivovat 2FA'}
          </button>
        </div>
      </div>
    );
  }

  // Disable mode
  if (disableMode) {
    return (
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-md font-medium text-gray-900 flex items-center">
            <ExclamationTriangleIcon className="w-5 h-5 mr-2 text-red-500" />
            Deaktivovat 2FA
          </h4>
          <button
            onClick={() => setDisableMode(false)}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Zrušit
          </button>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Pro deaktivaci 2FA zadejte své heslo a aktuální kód z autentikační aplikace.
          </p>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Heslo</label>
            <input
              type="password"
              value={disablePassword}
              onChange={(e) => setDisablePassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Zadejte heslo"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">2FA kód</label>
            <input
              type="text"
              value={disableCode}
              onChange={(e) => setDisableCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 font-mono text-center tracking-widest"
              placeholder="000000"
              maxLength={6}
            />
          </div>

          <button
            onClick={disable2FA}
            disabled={loading || !disablePassword || disableCode.length !== 6}
            className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {loading ? 'Deaktivuji...' : 'Deaktivovat 2FA'}
          </button>
        </div>
      </div>
    );
  }

  // Default view - status
  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-md font-medium text-gray-900 flex items-center">
            <ShieldCheckIcon className="w-5 h-5 mr-2 text-gray-600" />
            Dvoufaktorové ověření (2FA)
          </h4>
          <p className="text-sm text-gray-500 mt-1">
            {twoFactorEnabled 
              ? 'Váš účet je chráněn dvoufaktorovým ověřením'
              : 'Přidejte další vrstvu zabezpečení k vašemu účtu'}
          </p>
        </div>
        <span className={`px-3 py-1 text-xs rounded-full ${
          twoFactorEnabled 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-600'
        }`}>
          {twoFactorEnabled ? 'Aktivní' : 'Neaktivní'}
        </span>
      </div>

      <div className="mt-4">
        {twoFactorEnabled ? (
          <button
            onClick={() => setDisableMode(true)}
            className="px-4 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
          >
            Deaktivovat 2FA
          </button>
        ) : (
          <button
            onClick={startSetup}
            disabled={loading}
            className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
          >
            {loading ? 'Načítání...' : 'Nastavit 2FA'}
          </button>
        )}
      </div>
    </div>
  );
}