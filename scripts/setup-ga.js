const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

async function initializeGoogleAnalytics() {
  try {
    const gaId = process.env.GOOGLE_ANALYTICS_ID;
    
    if (!gaId) {
      console.log('Google Analytics ID not found in environment variables');
      return;
    }

    console.log(`Setting up Google Analytics ID: ${gaId}`);

    await prisma.settings.upsert({
      where: { key: 'googleAnalytics' },
      update: { value: gaId },
      create: { key: 'googleAnalytics', value: gaId }
    });

    console.log('Google Analytics ID successfully saved to database');
  } catch (error) {
    console.error('Error setting up Google Analytics:', error);
  } finally {
    await prisma.$disconnect();
  }
}

initializeGoogleAnalytics();