
import Link from "next/link";
import { 
  DocumentTextIcon, 
  PhotoIcon, 
  ChartBarIcon,
  UserGroupIcon,
  EyeIcon,
  CalendarDaysIcon 
} from '@heroicons/react/24/outline';
import { prisma } from '@/lib/prisma';
import { GoogleAnalyticsService } from '@/lib/analytics';

export default async function AdminDashboard() {
  let blogPostsCount = 0;
  let referencesCount = 0; 
  let recentPosts: any[] = [];
  let lastMonthPostsCount = 0;
  let previousMonthPostsCount = 0;
  let analyticsData: any = null;

  try {
    // Získání dynamických dat z databáze
    [blogPostsCount, referencesCount, recentPosts] = await Promise.all([
      prisma.blogPost.count(),
      // Pokud máte model pro reference, jinak použijte 0
      Promise.resolve(0), // prisma.reference.count() - až když bude model Reference
      prisma.blogPost.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: { name: true }
          }
        }
      })
    ]);

    // Pokud chcete i měsíční statistiky článků
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    
    lastMonthPostsCount = await prisma.blogPost.count({
      where: {
        createdAt: {
          gte: oneMonthAgo
        }
      }
    });
    
    const previousMonthStart = new Date(oneMonthAgo);
    previousMonthStart.setMonth(previousMonthStart.getMonth() - 1);
    
    previousMonthPostsCount = await prisma.blogPost.count({
      where: {
        createdAt: {
          gte: previousMonthStart,
          lt: oneMonthAgo
        }
      }
    });

    // Načtení analytics dat
    try {
      const gaPropertyId = await prisma.settings.findUnique({
        where: { key: 'gaPropertyId' }
      });

      const gaEmail = await prisma.settings.findUnique({
        where: { key: 'gaServiceAccountEmail' }
      });

      const gaPrivateKey = await prisma.settings.findUnique({
        where: { key: 'gaServiceAccountPrivateKey' }
      });

      const propertyId = gaPropertyId?.value || '';
      const serviceAccountEmail = gaEmail?.value || '';
      const privateKey = gaPrivateKey?.value || '';

      if (propertyId && serviceAccountEmail && privateKey) {
        const analyticsService = new GoogleAnalyticsService({
          propertyId,
          serviceAccountEmail,
          privateKey,
        });
        analyticsData = await analyticsService.getAnalyticsData(30);
      }
    } catch (analyticsError) {
      console.error('Error loading analytics data:', analyticsError);
      // Analytics data zůstanou null - použijí se "---"
    }
  } catch (error) {
    console.error('Error loading dashboard data:', error);
    // Pokud se nepodaří načíst data, použijí se defaultní hodnoty (0)
  }


  
  // Výpočet změny v procentech
  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? '+100%' : '0%';
    const change = ((current - previous) / previous) * 100;
    return change > 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`;
  };
  
  const postsChange = calculateChange(lastMonthPostsCount, previousMonthPostsCount);
  const postsChangeType = lastMonthPostsCount >= previousMonthPostsCount ? 'positive' : 'negative';
  
  // Příprava analytics dat
  const visitorsValue = analyticsData ? analyticsData.totalUsers.toLocaleString() : '---';
  const pageViewsValue = analyticsData ? analyticsData.totalPageViews.toLocaleString() : '---';
  
  const stats = [
    { name: 'Celkem článků', value: blogPostsCount.toString(), icon: DocumentTextIcon, change: postsChange, changeType: postsChangeType },
    { name: 'Celkem referencí', value: referencesCount.toString(), icon: PhotoIcon, change: '---', changeType: 'neutral' },
    { name: 'Návštěvníci (měsíc)', value: visitorsValue, icon: UserGroupIcon, change: '---', changeType: 'neutral' },
    { name: 'Zobrazení stránek', value: pageViewsValue, icon: EyeIcon, change: '---', changeType: 'neutral' },
  ];

  // Formatování datumu pro zobrazení
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('cs-CZ', {
      day: 'numeric',
      month: 'numeric', 
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Přehled vaší administrativní oblasti</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Icon className="h-8 w-8 text-blue-500" />
                </div>
                <div className="ml-4 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">{stat.value}</div>
                      <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                        stat.changeType === 'positive' ? 'text-green-600' : 
                        stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-500'
                      }`}>
                        {stat.change}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
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
              href="/admin/analytics"
              className="flex items-center p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <ChartBarIcon className="h-5 w-5 text-purple-500 mr-3" />
              <span className="text-purple-700 font-medium">Zobrazit analytiky</span>
            </Link>
          </div>
        </div>

        {/* Recent Posts */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Nedávné články</h3>
          <div className="space-y-3">
            {recentPosts.length > 0 ? recentPosts.map((post) => (
              <div key={post.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{post.title}</p>
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <CalendarDaysIcon className="h-3 w-3 mr-1" />
                    {formatDate(post.createdAt)}
                    {post.author?.name && (
                      <>
                        <span className="mx-1">•</span>
                        <span>{post.author.name}</span>
                      </>
                    )}
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  post.published 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {post.published ? 'Publikováno' : 'Koncept'}
                </span>
              </div>
            )) : (
              <div className="text-center py-8 text-gray-500">
                <p>Zatím nejsou žádné články</p>
              </div>
            )}
          </div>
          <Link 
            href="/admin/blog" 
            className="block text-center text-blue-600 hover:text-blue-800 text-sm font-medium mt-4"
          >
            Zobrazit všechny články →
          </Link>
        </div>
      </div>
    </div>
  );
}
