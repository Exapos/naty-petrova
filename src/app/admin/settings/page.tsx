'use client';
import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { 
  UserIcon, 
  ShieldCheckIcon,
  GlobeAltIcon,
  CheckCircleIcon,
  XMarkIcon,
  ComputerDesktopIcon 
} from '@heroicons/react/24/outline';

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const [activeTab, setActiveTab] = useState('account');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);
  
  const [userSettings, setUserSettings] = useState({
    name: '',
    email: '',
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
  });

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
    }
  }, [session]);

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
            <h3 className="text-lg font-medium text-gray-900">Zabezpečení</h3>
            
            <div className="space-y-6">
              {/* Aktivní relace */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-4">Aktivní relace</h4>
                {loading ? (
                  <div className="p-4 text-center text-gray-500">Načítání relací...</div>
                ) : sessions.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    Žádné aktivní relace nenalezeny. Session tracking bude implementován při příštím přihlášení.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {sessions.map((session, index) => {
                      const isCurrentSession = index === 0; // První session jako současná
                      const timeAgo = new Date(session.lastActivity).toLocaleString('cs-CZ');
                      
                      return (
                        <div key={session.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-center">
                            <ComputerDesktopIcon className="w-8 h-8 text-gray-400 mr-3" />
                            <div>
                              <h5 className="text-sm font-medium text-gray-900">
                                {isCurrentSession ? 'Současná relace' : 'Jiné zařízení'}
                              </h5>
                              <p className="text-xs text-gray-500">
                                {timeAgo} • {session.userAgent || 'Neznámé zařízení'}
                              </p>
                              {session.location && (
                                <p className="text-xs text-gray-400">{session.location}</p>
                              )}
                            </div>
                          </div>
                          {isCurrentSession ? (
                            <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                              Aktivní
                            </span>
                          ) : (
                            <button 
                              onClick={() => handleTerminateSession(session.id)}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              Odhlásit
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Bezpečnostní akce */}
              <div className="border-t pt-6">
                <h4 className="text-md font-medium text-gray-900 mb-4">Bezpečnostní akce</h4>
                <div className="space-y-3">
                  <button
                    onClick={handleTerminateAllSessions}
                    className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  >
                    Odhlásit se ze všech zařízení
                  </button>
                  <button
                    onClick={() => signOut()}
                    className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    Odhlásit se z tohoto zařízení
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'integrations' && (
          <div className="p-6 space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Integrace</h3>
            
            {/* Formulář pro integrace */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Google Analytics ID
                </label>
                <input
                  type="text"
                  value={integrations.googleAnalytics}
                  onChange={(e) => handleIntegrationsChange('googleAnalytics', e.target.value)}
                  placeholder="G-XXXXXXXXXX"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Zadejte své Google Analytics Measurement ID
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Facebook Pixel ID
                </label>
                <input
                  type="text"
                  value={integrations.facebookPixel}
                  onChange={(e) => handleIntegrationsChange('facebookPixel', e.target.value)}
                  placeholder="123456789012345"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Pro sledování konverzí a remarketing
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Google Tag Manager ID
                </label>
                <input
                  type="text"
                  value={integrations.googleTagManager}
                  onChange={(e) => handleIntegrationsChange('googleTagManager', e.target.value)}
                  placeholder="GTM-XXXXXXX"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Pro centralizované správu tagů
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hotjar Site ID
                </label>
                <input
                  type="text"
                  value={integrations.hotjar}
                  onChange={(e) => handleIntegrationsChange('hotjar', e.target.value)}
                  placeholder="1234567"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Heatmapy a nahrávky uživatelských relací
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mailchimp API Key
                </label>
                <input
                  type="text"
                  value={integrations.mailchimp}
                  onChange={(e) => handleIntegrationsChange('mailchimp', e.target.value)}
                  placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-us1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Pro e-mail marketing a newslettery
                </p>
              </div>

              <div className="pt-4">
                <button 
                  onClick={handleSaveIntegrations}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                >
                  {loading ? 'Ukládám...' : 'Uložit integrace'}
                </button>
              </div>
            </div>

            {/* Dostupné integrace */}
            <div className="border-t pt-6">
              <h4 className="text-sm font-medium text-gray-900 mb-4">Dostupné integrace</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-white font-bold text-sm">G</span>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-gray-900">Google Analytics</h5>
                      <p className="text-xs text-gray-500">Sledování návštěvnosti</p>
                    </div>
                  </div>
                  <div className={`px-2 py-1 text-xs rounded-full ${
                    integrations.googleAnalytics 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {integrations.googleAnalytics ? 'Připojeno' : 'Nepřipojeno'}
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