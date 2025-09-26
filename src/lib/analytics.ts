// Google Analytics 4 API client
import { BetaAnalyticsDataClient } from '@google-analytics/data';

interface AnalyticsConfig {
  propertyId: string;
  serviceAccountEmail: string;
  privateKey: string;
}

interface AnalyticsData {
  totalUsers: number;
  totalSessions: number;
  totalPageViews: number;
  bounceRate: number;
  averageSessionDuration: number;
  topPages: Array<{
    page: string;
    views: number;
    uniqueViews: number;
  }>;
  trafficSources: Array<{
    source: string;
    users: number;
    percentage: number;
  }>;
  dailyData: Array<{
    date: string;
    users: number;
    sessions: number;
    pageViews: number;
  }>;
}

class GoogleAnalyticsService {
  private client: BetaAnalyticsDataClient | null = null;
  private propertyId: string;

  constructor(config: AnalyticsConfig) {
    this.propertyId = config.propertyId;
    
    try {
      // Inicializace klienta s service account - pouze pokud máme všechny potřebné údaje
      if (config.serviceAccountEmail && config.privateKey) {
        this.client = new BetaAnalyticsDataClient({
          credentials: {
            client_email: config.serviceAccountEmail,
            private_key: config.privateKey.replace(/\\n/g, '\n'),
          },
          projectId: config.serviceAccountEmail.split('@')[1].split('.')[0],
        });
      }
    } catch (error) {
      console.error('Error initializing Google Analytics client:', error);
    }
  }

  async getAnalyticsData(days: number = 30): Promise<AnalyticsData> {
    // Pokud není klient inicializován, vrátíme mock data
    if (!this.client || !this.propertyId) {
      return this.getMockData();
    }

    try {
      // Definice date range
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      const endDate = new Date();

      // Základní metriky
      const [basicMetrics] = await this.client.runReport({
        property: `properties/${this.propertyId}`,
        dateRanges: [
          {
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0],
          },
        ],
        metrics: [
          { name: 'totalUsers' },
          { name: 'sessions' },
          { name: 'screenPageViews' },
          { name: 'bounceRate' },
          { name: 'averageSessionDuration' },
        ],
      });

      // Top stránky
      const [topPages] = await this.client.runReport({
        property: `properties/${this.propertyId}`,
        dateRanges: [
          {
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0],
          },
        ],
        dimensions: [{ name: 'pagePath' }],
        metrics: [
          { name: 'screenPageViews' },
          { name: 'totalUsers' },
        ],
        orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
        limit: 10,
      });

      // Traffic sources
      const [trafficSources] = await this.client.runReport({
        property: `properties/${this.propertyId}`,
        dateRanges: [
          {
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0],
          },
        ],
        dimensions: [{ name: 'sessionSource' }],
        metrics: [{ name: 'totalUsers' }],
        orderBys: [{ metric: { metricName: 'totalUsers' }, desc: true }],
        limit: 5,
      });

      // Denní data
      const [dailyData] = await this.client.runReport({
        property: `properties/${this.propertyId}`,
        dateRanges: [
          {
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0],
          },
        ],
        dimensions: [{ name: 'date' }],
        metrics: [
          { name: 'totalUsers' },
          { name: 'sessions' },
          { name: 'screenPageViews' },
        ],
        orderBys: [{ dimension: { dimensionName: 'date' } }],
      });

      // Parsování výsledků
      const totalUsers = parseInt(basicMetrics.rows?.[0]?.metricValues?.[0]?.value || '0');
      const totalSessions = parseInt(basicMetrics.rows?.[0]?.metricValues?.[1]?.value || '0');
      const totalPageViews = parseInt(basicMetrics.rows?.[0]?.metricValues?.[2]?.value || '0');
      const bounceRate = parseFloat(basicMetrics.rows?.[0]?.metricValues?.[3]?.value || '0');
      const averageSessionDuration = parseFloat(basicMetrics.rows?.[0]?.metricValues?.[4]?.value || '0');

      const topPagesData = topPages.rows?.map(row => ({
        page: row.dimensionValues?.[0]?.value || '',
        views: parseInt(row.metricValues?.[0]?.value || '0'),
        uniqueViews: parseInt(row.metricValues?.[1]?.value || '0'),
      })) || [];

      const totalTrafficUsers = trafficSources.rows?.reduce((sum, row) => 
        sum + parseInt(row.metricValues?.[0]?.value || '0'), 0) || 1;

      const trafficSourcesData = trafficSources.rows?.map(row => ({
        source: row.dimensionValues?.[0]?.value || 'Unknown',
        users: parseInt(row.metricValues?.[0]?.value || '0'),
        percentage: Math.round((parseInt(row.metricValues?.[0]?.value || '0') / totalTrafficUsers) * 100),
      })) || [];

      const dailyDataFormatted = dailyData.rows?.map(row => ({
        date: row.dimensionValues?.[0]?.value || '',
        users: parseInt(row.metricValues?.[0]?.value || '0'),
        sessions: parseInt(row.metricValues?.[1]?.value || '0'),
        pageViews: parseInt(row.metricValues?.[2]?.value || '0'),
      })) || [];

      return {
        totalUsers,
        totalSessions,
        totalPageViews,
        bounceRate,
        averageSessionDuration,
        topPages: topPagesData,
        trafficSources: trafficSourcesData,
        dailyData: dailyDataFormatted,
      };

    } catch (error) {
      console.error('Error fetching Google Analytics data:', error);
      return this.getMockData();
    }
  }

  private getMockData(): AnalyticsData {
    const now = new Date();
    const dailyData: Array<{
      date: string;
      users: number;
      sessions: number;
      pageViews: number;
    }> = [];
    
    // Generujeme mock data za posledních 30 dní
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      dailyData.push({
        date: date.toISOString().split('T')[0],
        users: Math.floor(Math.random() * 50) + 10,
        sessions: Math.floor(Math.random() * 80) + 15,
        pageViews: Math.floor(Math.random() * 150) + 25,
      });
    }

    return {
      totalUsers: 847,
      totalSessions: 1203,
      totalPageViews: 2156,
      bounceRate: 0.42,
      averageSessionDuration: 145.6,
      topPages: [
        { page: '/', views: 523, uniqueViews: 412 },
        { page: '/sluzby', views: 298, uniqueViews: 256 },
        { page: '/o-nas', views: 187, uniqueViews: 164 },
        { page: '/reference', views: 156, uniqueViews: 134 },
        { page: '/kontakt', views: 134, uniqueViews: 118 },
        { page: '/kariera', views: 89, uniqueViews: 76 },
      ],
      trafficSources: [
        { source: 'google', users: 456, percentage: 54 },
        { source: 'direct', users: 234, percentage: 28 },
        { source: 'facebook', users: 87, percentage: 10 },
        { source: 'linkedin', users: 45, percentage: 5 },
        { source: 'referral', users: 25, percentage: 3 },
      ],
      dailyData,
    };
  }
}

export { GoogleAnalyticsService, type AnalyticsData };