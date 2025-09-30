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
  // Nové metriky
  realTimeUsers: number;
  conversions: {
    formSubmissions: number;
    ctaClicks: number;
    phoneClicks: number;
    emailClicks: number;
  };
  devices: Array<{
    device: string;
    users: number;
    percentage: number;
  }>;
  browsers: Array<{
    browser: string;
    users: number;
    percentage: number;
  }>;
  countries: Array<{
    country: string;
    users: number;
    percentage: number;
  }>;
  performance: {
    avgPageLoadTime: number;
    errorRate: number;
    exitRate: number;
  };
}

interface WebVitalsData {
  metrics: Array<{
    name: string;
    value: number;
    rating: 'good' | 'needs-improvement' | 'poor';
    id: string;
  }>;
  lastUpdated: string;
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
      console.error('Error initializing GA4 client:', error);
    }
  }

  async getAnalyticsData(days: number = 30): Promise<AnalyticsData> {
    // Pokud není klient inicializován, vrátíme prázdná data
    if (!this.client || !this.propertyId) {
      return this.getEmptyData();
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

      // Zařízení
      const [devicesData] = await this.client.runReport({
        property: `properties/${this.propertyId}`,
        dateRanges: [
          {
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0],
          },
        ],
        dimensions: [{ name: 'deviceCategory' }],
        metrics: [{ name: 'totalUsers' }],
        orderBys: [{ metric: { metricName: 'totalUsers' }, desc: true }],
      });

      // Prohlížeče
      const [browsersData] = await this.client.runReport({
        property: `properties/${this.propertyId}`,
        dateRanges: [
          {
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0],
          },
        ],
        dimensions: [{ name: 'browser' }],
        metrics: [{ name: 'totalUsers' }],
        orderBys: [{ metric: { metricName: 'totalUsers' }, desc: true }],
        limit: 5,
      });

      // Země
      const [countriesData] = await this.client.runReport({
        property: `properties/${this.propertyId}`,
        dateRanges: [
          {
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0],
          },
        ],
        dimensions: [{ name: 'country' }],
        metrics: [{ name: 'totalUsers' }],
        orderBys: [{ metric: { metricName: 'totalUsers' }, desc: true }],
        limit: 10,
      });

      // Performance metriky (pokud jsou k dispozici) - dočasně zakázáno kvůli nekompatibilitě s GA4
      // const performanceData: any = null;
      // try {
      //   [performanceData] = await this.client.runReport({
      //     property: `properties/${this.propertyId}`,
      //     dateRanges: [
      //       {
      //         startDate: startDate.toISOString().split('T')[0],
      //         endDate: endDate.toISOString().split('T')[0],
      //       },
      //     ],
      //     metrics: [
      //       { name: 'averagePageLoadTime' },
      //       { name: 'crashRate' },
      //       { name: 'exitRate' },
      //     ],
      //   });
      // } catch (error) {
      //   // Performance metriky nemusí být dostupné
      //   console.warn('Performance metrics not available:', error);
      // }

      // Konverze - pokusíme se číst některé standardní events
      let conversionsData: any = null;
      try {
        [conversionsData] = await this.client.runReport({
          property: `properties/${this.propertyId}`,
          dateRanges: [
            {
              startDate: startDate.toISOString().split('T')[0],
              endDate: endDate.toISOString().split('T')[0],
            },
          ],
          dimensions: [{ name: 'eventName' }],
          metrics: [{ name: 'eventCount' }],
          dimensionFilter: {
            filter: {
              fieldName: 'eventName',
              inListFilter: {
                values: ['form_submit', 'click', 'phone_click', 'email_click', 'contact_form_submit'],
              },
            },
          },
        });
      } catch (error) {
        // Conversion events nemusí být dostupné
        console.warn('Conversion events not available:', error);
      }

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

      // Parsování devices
      const totalDeviceUsers = devicesData.rows?.reduce((sum, row) => 
        sum + parseInt(row.metricValues?.[0]?.value || '0'), 0) || 1;

      const devicesFormatted = devicesData.rows?.map(row => ({
        device: row.dimensionValues?.[0]?.value || 'Unknown',
        users: parseInt(row.metricValues?.[0]?.value || '0'),
        percentage: Math.round((parseInt(row.metricValues?.[0]?.value || '0') / totalDeviceUsers) * 100),
      })) || [];

      // Parsování browsers
      const totalBrowserUsers = browsersData.rows?.reduce((sum, row) => 
        sum + parseInt(row.metricValues?.[0]?.value || '0'), 0) || 1;

      const browsersFormatted = browsersData.rows?.map(row => ({
        browser: row.dimensionValues?.[0]?.value || 'Unknown',
        users: parseInt(row.metricValues?.[0]?.value || '0'),
        percentage: Math.round((parseInt(row.metricValues?.[0]?.value || '0') / totalBrowserUsers) * 100),
      })) || [];

      // Parsování countries
      const totalCountryUsers = countriesData.rows?.reduce((sum, row) => 
        sum + parseInt(row.metricValues?.[0]?.value || '0'), 0) || 1;

      const countriesFormatted = countriesData.rows?.map(row => ({
        country: row.dimensionValues?.[0]?.value || 'Unknown',
        users: parseInt(row.metricValues?.[0]?.value || '0'),
        percentage: Math.round((parseInt(row.metricValues?.[0]?.value || '0') / totalCountryUsers) * 100),
      })) || [];

      // Parsování performance metrik - dočasně zakázáno kvůli nekompatibilitě s GA4
      const avgPageLoadTime = 0; // performanceData ? parseFloat(performanceData.rows?.[0]?.metricValues?.[0]?.value || '0') : 0;
      const errorRate = 0; // performanceData ? parseFloat(performanceData.rows?.[0]?.metricValues?.[1]?.value || '0') : 0;
      const exitRate = bounceRate; // performanceData ? parseFloat(performanceData.rows?.[0]?.metricValues?.[2]?.value || '0') : bounceRate;

      // Parsování konverzí
      let formSubmissions = 0;
      let ctaClicks = 0;
      let phoneClicks = 0;
      let emailClicks = 0;

      if (conversionsData?.rows) {
        conversionsData.rows.forEach((row: any) => {
          const eventName = row.dimensionValues?.[0]?.value;
          const count = parseInt(row.metricValues?.[0]?.value || '0');

          switch (eventName) {
            case 'form_submit':
            case 'contact_form_submit':
              formSubmissions += count;
              break;
            case 'click':
              ctaClicks += count;
              break;
            case 'phone_click':
              phoneClicks += count;
              break;
            case 'email_click':
              emailClicks += count;
              break;
          }
        });
      }

      return {
        totalUsers,
        totalSessions,
        totalPageViews,
        bounceRate,
        averageSessionDuration,
        topPages: topPagesData,
        trafficSources: trafficSourcesData,
        dailyData: dailyDataFormatted,
        // Real-time uživatelé (pro teď 0, později implementujeme real-time API)
        realTimeUsers: 0,
        // Konverze z events
        conversions: {
          formSubmissions,
          ctaClicks,
          phoneClicks,
          emailClicks,
        },
        devices: devicesFormatted,
        browsers: browsersFormatted,
        countries: countriesFormatted,
        performance: {
          avgPageLoadTime,
          errorRate,
          exitRate,
        },
      };

    } catch (error) {
      console.error('GA4 API Error:', error);
      // Vrátíme prázdná data místo vyhození chyby
      return this.getEmptyData();
    }
  }

  async getWebVitalsData(days: number = 30): Promise<WebVitalsData> {
    // Pokud není klient inicializován, vrátíme prázdná data
    if (!this.client || !this.propertyId) {
      return this.getEmptyWebVitalsData();
    }

    try {
      // Definice date range - začínáme od včerejška (GA4 potřebuje čas na zpracování)
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days - 1); // -1 den navíc
      const endDate = new Date();
      endDate.setDate(endDate.getDate() - 1); // Do včerejška

      // Web Vitals metriky - LCP, FID, CLS, FCP, TTFB
      const [webVitalsReport] = await this.client.runReport({
        property: `properties/${this.propertyId}`,
        dateRanges: [
          {
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0],
          },
        ],
        dimensions: [
          { name: 'eventName' }
        ],
        metrics: [
          { name: 'eventCount' },
          { name: 'eventValue' },
        ],
        dimensionFilter: {
          andGroup: {
            expressions: [{
              filter: {
                fieldName: 'eventName',
                inListFilter: {
                  values: ['LCP', 'FID', 'CLS', 'FCP', 'TTFB'],
                  caseSensitive: false,
                },
              },
            }],
          },
        },
      });      // Zpracování dat
      const metrics: WebVitalsData['metrics'] = [];

      if (webVitalsReport.rows) {
        webVitalsReport.rows.forEach((row: any) => {
          const eventName = row.dimensionValues?.[0]?.value;
          const eventCount = parseInt(row.metricValues?.[0]?.value || '0');
          const eventValue = parseFloat(row.metricValues?.[1]?.value || '0');

          // Filtr pro Web Vitals metriky
          const webVitalsEvents = ['LCP', 'FID', 'CLS', 'FCP', 'TTFB'];
          if (eventName && webVitalsEvents.includes(eventName) && eventCount > 0) {
            // Výpočet průměrné hodnoty
            const avgValue = eventValue / eventCount;

            // Hodnocení podle Google standardů
            const rating = this.getWebVitalsRating(eventName, avgValue);

            metrics.push({
              name: eventName,
              value: avgValue,
              rating,
              id: `${eventName.toLowerCase()}-${Date.now()}`
            });
          }
        });
      }

      return {
        metrics,
        lastUpdated: new Date().toISOString()
      };

    } catch {
      return this.getEmptyWebVitalsData();
    }
  }

  private getWebVitalsRating(metricName: string, value: number): 'good' | 'needs-improvement' | 'poor' {
    switch (metricName) {
      case 'LCP':
        return value < 2500 ? 'good' : value < 4000 ? 'needs-improvement' : 'poor';
      case 'FID':
        return value < 100 ? 'good' : value < 300 ? 'needs-improvement' : 'poor';
      case 'CLS':
        return value < 0.1 ? 'good' : value < 0.25 ? 'needs-improvement' : 'poor';
      case 'FCP':
        return value < 1800 ? 'good' : value < 3000 ? 'needs-improvement' : 'poor';
      case 'TTFB':
        return value < 800 ? 'good' : value < 1800 ? 'needs-improvement' : 'poor';
      default:
        return 'good';
    }
  }

  private getEmptyWebVitalsData(): WebVitalsData {
    return {
      metrics: [],
      lastUpdated: new Date().toISOString()
    };
  }

  private getEmptyData(): AnalyticsData {
    return {
      totalUsers: 0,
      totalSessions: 0,
      totalPageViews: 0,
      bounceRate: 0,
      averageSessionDuration: 0,
      topPages: [],
      trafficSources: [],
      dailyData: [],
      // Prázdná data místo mock dat
      realTimeUsers: 0,
      conversions: {
        formSubmissions: 0,
        ctaClicks: 0,
        phoneClicks: 0,
        emailClicks: 0,
      },
      devices: [],
      browsers: [],
      countries: [],
      performance: {
        avgPageLoadTime: 0,
        errorRate: 0,
        exitRate: 0,
      },
    };
  }
}

export { GoogleAnalyticsService, type AnalyticsData, type WebVitalsData };