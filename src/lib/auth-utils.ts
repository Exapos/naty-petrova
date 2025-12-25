/**
 * Utility functions for authentication handling
 */

/**
 * Validate a URL string and return it if valid, otherwise null
 */
function validateUrl(url: string | undefined): string | null {
  if (!url) return null;
  try {
    new URL(url);
    return url;
  } catch {
    console.warn(`[auth-utils] Invalid URL: ${url}`);
    return null;
  }
}

/**
 * Get the full origin URL for NextAuth from environment or request
 * Detects automatically if running on production or localhost
 */
export function getAuthOrigin(): string {
  const isProduction = process.env.NODE_ENV === 'production';
  
  // Priority 1: Explicit NEXTAUTH_URL from environment (already validated by NextAuth)
  const nextAuthUrl = validateUrl(process.env.NEXTAUTH_URL);
  if (nextAuthUrl) {
    return nextAuthUrl;
  }
  if (process.env.NEXTAUTH_URL) {
    console.warn('[auth-utils] NEXTAUTH_URL is set but invalid, ignoring');
  }

  // Priority 2: For server-side, derive from VERCEL_PROJECT_PRODUCTION_URL
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    const vercelProdUrl = validateUrl(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`);
    if (vercelProdUrl) {
      return vercelProdUrl;
    }
    console.warn('[auth-utils] VERCEL_PROJECT_PRODUCTION_URL is invalid, ignoring');
  }

  // Priority 3: VERCEL_URL for Vercel preview deployments
  if (process.env.VERCEL_URL) {
    const vercelUrl = validateUrl(`https://${process.env.VERCEL_URL}`);
    if (vercelUrl) {
      return vercelUrl;
    }
    console.warn('[auth-utils] VERCEL_URL is invalid, ignoring');
  }

  // Priority 4: Configurable production URL from environment
  if (process.env.PRODUCTION_URL) {
    const prodUrl = validateUrl(process.env.PRODUCTION_URL);
    if (prodUrl) {
      return prodUrl;
    }
    console.warn('[auth-utils] PRODUCTION_URL is invalid, ignoring');
  }

  // In production, fail-fast if no valid URL is found
  if (isProduction) {
    const error = new Error(
      '[auth-utils] CRITICAL: No valid production URL found. Set NEXTAUTH_URL, VERCEL_PROJECT_PRODUCTION_URL, VERCEL_URL, or PRODUCTION_URL environment variable.'
    );
    console.error(error.message);
    throw error;
  }

  // Fallback to localhost for development
  console.warn('[auth-utils] No production URL configured, falling back to http://localhost:3000 for development');
  return 'http://localhost:3000';
}

/**
 * Get the redirect URL for logout or signin
 * Returns a relative URL that NextAuth will properly handle with NEXTAUTH_URL
 */
export function getLogoutRedirectUrl(): string {
  return '/admin';
}
