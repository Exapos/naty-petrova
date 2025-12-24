
import Link from "next/link";
import { 
  DocumentTextIcon, 
  PhotoIcon, 
  ChartBarIcon,
  UserGroupIcon,
  CalendarDaysIcon,
  BriefcaseIcon,
  InboxIcon,
  ClockIcon,
  ServerIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  CogIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';
import { prisma } from '@/lib/prisma';
import { GoogleAnalyticsService } from '@/lib/analytics';

// Pomocný typ pro statistiky
interface DashboardStats {
  blogPostsCount: number;
  publishedPostsCount: number;
  draftPostsCount: number;
  referencesCount: number;
  jobPositionsCount: number;
  activeJobsCount: number;
  jobApplicationsCount: number;
  newApplicationsCount: number;
  usersCount: number;
  lastMonthPostsCount: number;
  previousMonthPostsCount: number;
}

// Pomocná funkce pro načtení dat
async function getDashboardData(): Promise<{
  stats: DashboardStats;
  recentPosts: any[];
  recentApplications: any[];
  analyticsData: any;
  systemHealth: { status: 'ok' | 'warning' | 'error'; message: string }[];
}> {
  let stats: DashboardStats = {
    blogPostsCount: 0,
    publishedPostsCount: 0,
    draftPostsCount: 0,
    referencesCount: 0,
    jobPositionsCount: 0,
    activeJobsCount: 0,
    jobApplicationsCount: 0,
    newApplicationsCount: 0,
    usersCount: 0,
    lastMonthPostsCount: 0,
    previousMonthPostsCount: 0,
  };
  let recentPosts: any[] = [];
  let recentApplications: any[] = [];
  let analyticsData: any = null;
  const systemHealth: { status: 'ok' | 'warning' | 'error'; message: string }[] = [];

  try {
    // Paralelní načtení všech dat
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    
    const previousMonthStart = new Date(oneMonthAgo);
    previousMonthStart.setMonth(previousMonthStart.getMonth() - 1);

    const [
      blogPostsCount,
      publishedPostsCount,
      draftPostsCount,
      referencesCount,
      jobPositionsCount,
      activeJobsCount,
      jobApplicationsCount,
      newApplicationsCount,
      usersCount,
      lastMonthPostsCount,
      previousMonthPostsCount,
      posts,
      applications
    ] = await Promise.all([
      prisma.blogPost.count(),
      prisma.blogPost.count({ where: { published: true } }),
      prisma.blogPost.count({ where: { published: false } }),
      prisma.reference.count(),
      prisma.jobPosition.count(),
      prisma.jobPosition.count({ where: { isActive: true } }),
      prisma.jobApplication.count(),
      prisma.jobApplication.count({ where: { status: 'NEW' } }),
      prisma.user.count(),
      prisma.blogPost.count({
        where: { createdAt: { gte: oneMonthAgo } }
      }),
      prisma.blogPost.count({
        where: {
          createdAt: { gte: previousMonthStart, lt: oneMonthAgo }
        }
      }),
      prisma.blogPost.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { author: { select: { name: true } } }
      }),
      prisma.jobApplication.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { jobPosition: { select: { title: true } } }
      })
    ]);

    stats = {
      blogPostsCount,
      publishedPostsCount,
      draftPostsCount,
      referencesCount,
      jobPositionsCount,
      activeJobsCount,
      jobApplicationsCount,
      newApplicationsCount,
      usersCount,
      lastMonthPostsCount,
      previousMonthPostsCount,
    };

    recentPosts = posts;
    recentApplications = applications;

    // System health checks
    systemHealth.push({ status: 'ok', message: 'Databáze připojena' });

    // Kontrola GA konfigurace
    const gaPropertyId = await prisma.settings.findUnique({ where: { key: 'gaPropertyId' } });
    const gaEmail = await prisma.settings.findUnique({ where: { key: 'gaServiceAccountEmail' } });
    const gaPrivateKey = await prisma.settings.findUnique({ where: { key: 'gaServiceAccountPrivateKey' } });

    const propertyId = process.env.GA_PROPERTY_ID || gaPropertyId?.value || '';
    const serviceAccountEmail = process.env.GA_SERVICE_ACCOUNT_EMAIL || gaEmail?.value || '';
    const privateKey = process.env.GA_SERVICE_ACCOUNT_PRIVATE_KEY || gaPrivateKey?.value || '';

    if (propertyId && serviceAccountEmail && privateKey) {
      systemHealth.push({ status: 'ok', message: 'Google Analytics nakonfigurováno' });
      
      try {
        const analyticsService = new GoogleAnalyticsService({
          propertyId,
          serviceAccountEmail,
          privateKey,
        });
        analyticsData = await analyticsService.getAnalyticsData(30);
      } catch (analyticsError) {
        console.error('Error loading analytics data:', analyticsError);
        systemHealth.push({ status: 'warning', message: 'Nepodařilo se načíst GA data' });
      }
    } else {
      systemHealth.push({ status: 'warning', message: 'Google Analytics není nakonfigurováno' });
    }

    // Kontrola nepublikovaných článků
    if (draftPostsCount > 5) {
      systemHealth.push({ status: 'warning', message: `${draftPostsCount} nepublikovaných článků` });
    }

    // Kontrola nových aplikací
    if (newApplicationsCount > 0) {
      systemHealth.push({ 
        status: newApplicationsCount > 5 ? 'warning' : 'ok', 
        message: `${newApplicationsCount} nových žádostí o práci` 
      });
    }

  } catch (error) {
    console.error('Error loading dashboard data:', error);
    systemHealth.push({ status: 'error', message: 'Chyba při načítání dat' });
  }

  return { stats, recentPosts, recentApplications, analyticsData, systemHealth };
}

export default async function AdminDashboard() {
  const { stats, recentPosts, recentApplications, analyticsData, systemHealth } = await getDashboardData();
  
  // Výpočet změny v procentech
  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? '+100%' : '0%';
    const change = ((current - previous) / previous) * 100;
    return change > 0 ? `+${change.toFixed(0)}%` : `${change.toFixed(0)}%`;
  };
  
  const postsChange = calculateChange(stats.lastMonthPostsCount, stats.previousMonthPostsCount);
  const postsChangeType = stats.lastMonthPostsCount >= stats.previousMonthPostsCount ? 'positive' : 'negative';
  
  // Příprava analytics dat
  const visitorsValue = analyticsData ? analyticsData.totalUsers.toLocaleString() : '---';
  const pageViewsValue = analyticsData ? analyticsData.totalPageViews.toLocaleString() : '---';
  const bounceRateValue = analyticsData ? `${(analyticsData.bounceRate * 100).toFixed(1)}%` : '---';
  const avgSessionValue = analyticsData ? `${Math.floor(analyticsData.averageSessionDuration / 60)}m ${Math.floor(analyticsData.averageSessionDuration % 60)}s` : '---';
  
  const mainStats = [
    { 
      name: 'Celkem článků', 
      value: stats.blogPostsCount.toString(), 
      subtext: `${stats.publishedPostsCount} publikovaných, ${stats.draftPostsCount} konceptů`,
      icon: DocumentTextIcon, 
      change: postsChange, 
      changeType: postsChangeType,
      href: '/admin/blog'
    },
    { 
      name: 'Reference', 
      value: stats.referencesCount.toString(), 
      subtext: 'Celkem projektů',
      icon: PhotoIcon, 
      change: '---', 
      changeType: 'neutral',
      href: '/admin/reference'
    },
    { 
      name: 'Návštěvníci (měsíc)', 
      value: visitorsValue, 
      subtext: pageViewsValue !== '---' ? `${pageViewsValue} zobrazení` : 'Nakonfigurujte GA',
      icon: UserGroupIcon, 
      change: '---', 
      changeType: 'neutral',
      href: '/admin/analytics'
    },
    { 
      name: 'Pracovní pozice', 
      value: stats.jobPositionsCount.toString(), 
      subtext: `${stats.activeJobsCount} aktivních`,
      icon: BriefcaseIcon, 
      change: '---', 
      changeType: 'neutral',
      href: '/admin/jobs'
    },
  ];

  const secondaryStats = [
    { 
      name: 'Žádosti o práci', 
      value: stats.jobApplicationsCount, 
      highlight: stats.newApplicationsCount,
      highlightLabel: 'nových',
      icon: InboxIcon,
      href: '/admin/jobs'
    },
    { 
      name: 'Bounce rate', 
      value: bounceRateValue, 
      icon: ArrowTrendingDownIcon,
      href: '/admin/analytics'
    },
    { 
      name: 'Prům. session', 
      value: avgSessionValue, 
      icon: ClockIcon,
      href: '/admin/analytics'
    },
    { 
      name: 'Uživatelé', 
      value: stats.usersCount, 
      icon: UserGroupIcon,
      href: '/admin/users'
    },
  ];

  // Formatování datumu pro zobrazení
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('cs-CZ', {
      day: 'numeric',
      month: 'numeric', 
      year: 'numeric'
    }).format(new Date(date));
  };

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 60) return `před ${minutes} min`;
    if (hours < 24) return `před ${hours} hod`;
    if (days < 7) return `před ${days} dny`;
    return formatDate(date);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NEW': return 'bg-blue-100 text-blue-800';
      case 'REVIEWED': return 'bg-yellow-100 text-yellow-800';
      case 'INTERVIEW': return 'bg-purple-100 text-purple-800';
      case 'ACCEPTED': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'NEW': return 'Nová';
      case 'REVIEWED': return 'Přečteno';
      case 'INTERVIEW': return 'Pohovor';
      case 'ACCEPTED': return 'Přijato';
      case 'REJECTED': return 'Zamítnuto';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Přehled vaší administrativní oblasti</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <Link 
            href="/admin/blog/new"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <DocumentTextIcon className="h-5 w-5 mr-2" />
            Nový článek
          </Link>
        </div>
      </div>

      {/* System Health */}
      {systemHealth.some(h => h.status !== 'ok') && (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
            <ServerIcon className="h-5 w-5 mr-2 text-gray-500" />
            Stav systému
          </h3>
          <div className="flex flex-wrap gap-2">
            {systemHealth.map((item, index) => (
              <span 
                key={index}
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                  item.status === 'ok' ? 'bg-green-100 text-green-800' :
                  item.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}
              >
                {item.status === 'ok' ? (
                  <CheckCircleIcon className="h-4 w-4 mr-1" />
                ) : (
                  <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                )}
                {item.message}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {mainStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link 
              key={stat.name} 
              href={stat.href}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-200 transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="flex-shrink-0">
                  <Icon className="h-8 w-8 text-blue-500 group-hover:text-blue-600 transition-colors" />
                </div>
                {stat.change !== '---' && (
                  <div className={`flex items-center text-sm font-semibold ${
                    stat.changeType === 'positive' ? 'text-green-600' : 
                    stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-500'
                  }`}>
                    {stat.changeType === 'positive' ? (
                      <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                    ) : stat.changeType === 'negative' ? (
                      <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />
                    ) : null}
                    {stat.change}
                  </div>
                )}
              </div>
              <div className="mt-4">
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                {stat.subtext && (
                  <p className="text-xs text-gray-400 mt-1">{stat.subtext}</p>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {secondaryStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link 
              key={stat.name}
              href={stat.href}
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all"
            >
              <div className="flex items-center space-x-3">
                <Icon className="h-6 w-6 text-gray-400" />
                <div>
                  <p className="text-lg font-semibold text-gray-900">
                    {stat.value}
                    {stat.highlight !== undefined && stat.highlight > 0 && (
                      <span className="ml-2 text-xs font-medium px-2 py-0.5 bg-red-100 text-red-800 rounded-full">
                        {stat.highlight} {stat.highlightLabel}
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-gray-500">{stat.name}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Rychlé akce</h3>
          <div className="space-y-3">
            <Link 
              href="/admin/blog/new"
              className="flex items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <DocumentTextIcon className="h-5 w-5 text-blue-500 mr-3" />
              <span className="text-blue-700 font-medium">Vytvořit nový článek</span>
            </Link>
            <Link 
              href="/admin/reference/new"
              className="flex items-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <PhotoIcon className="h-5 w-5 text-green-500 mr-3" />
              <span className="text-green-700 font-medium">Přidat novou referenci</span>
            </Link>
            <Link 
              href="/admin/jobs/new"
              className="flex items-center p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
            >
              <BriefcaseIcon className="h-5 w-5 text-orange-500 mr-3" />
              <span className="text-orange-700 font-medium">Vytvořit pracovní pozici</span>
            </Link>
            <Link 
              href="/admin/analytics"
              className="flex items-center p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <ChartBarIcon className="h-5 w-5 text-purple-500 mr-3" />
              <span className="text-purple-700 font-medium">Zobrazit analytiky</span>
            </Link>
            <Link 
              href="/admin/settings"
              className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <CogIcon className="h-5 w-5 text-gray-500 mr-3" />
              <span className="text-gray-700 font-medium">Nastavení</span>
            </Link>
          </div>
        </div>

        {/* Recent Posts */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Nedávné články</h3>
            <Link href="/admin/blog" className="text-sm text-blue-600 hover:text-blue-800">
              Zobrazit vše →
            </Link>
          </div>
          <div className="space-y-3">
            {recentPosts.length > 0 ? recentPosts.map((post) => (
              <Link 
                key={post.id} 
                href={`/admin/blog/${post.id}`}
                className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <p className="text-sm font-medium text-gray-900 line-clamp-1">{post.title}</p>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center text-xs text-gray-500">
                    <CalendarDaysIcon className="h-3 w-3 mr-1" />
                    {formatRelativeTime(post.createdAt)}
                    {post.author?.name && (
                      <span className="ml-2">• {post.author.name}</span>
                    )}
                  </div>
                  <span className={`px-2 py-0.5 text-xs rounded-full ${
                    post.published 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {post.published ? 'Publikováno' : 'Koncept'}
                  </span>
                </div>
              </Link>
            )) : (
              <div className="text-center py-8 text-gray-500">
                <DocumentTextIcon className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                <p>Zatím nejsou žádné články</p>
                <Link 
                  href="/admin/blog/new" 
                  className="text-blue-600 hover:text-blue-800 text-sm mt-2 inline-block"
                >
                  Vytvořit první článek →
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Recent Job Applications */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Žádosti o práci</h3>
            <Link href="/admin/jobs" className="text-sm text-blue-600 hover:text-blue-800">
              Zobrazit vše →
            </Link>
          </div>
          <div className="space-y-3">
            {recentApplications.length > 0 ? recentApplications.map((application) => (
              <div 
                key={application.id} 
                className="p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">
                    {application.firstName} {application.lastName}
                  </p>
                  <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(application.status)}`}>
                    {getStatusLabel(application.status)}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {application.jobPosition?.title || 'Pozice smazána'}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {formatRelativeTime(application.createdAt)}
                </p>
              </div>
            )) : (
              <div className="text-center py-8 text-gray-500">
                <InboxIcon className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                <p>Zatím žádné žádosti</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Analytics Preview */}
      {analyticsData && analyticsData.topPages && analyticsData.topPages.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Top stránky (posledních 30 dní)</h3>
            <Link href="/admin/analytics" className="text-sm text-blue-600 hover:text-blue-800">
              Detailní analytiky →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stránka</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Zobrazení</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Unikátní</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {analyticsData.topPages.slice(0, 5).map((page: any, index: number) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900 max-w-xs truncate">
                      {page.page}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right">
                      {page.views.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 text-right">
                      {page.uniqueViews.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
