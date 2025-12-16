import type { TokenResponse } from '../types';
import { CORS_PROXY } from './constants';

/**
 * Token cache entry with expiration timestamp
 */
interface TokenCacheEntry {
  token: string;
  expiresAt: number;
}

// Token caches per tenant (Map<tenantId, TokenCacheEntry>)
const graphTokenCache = new Map<string, TokenCacheEntry>();
const botFrameworkTokenCache = new Map<string, TokenCacheEntry>();

/**
 * Get Azure credentials from environment variables
 */
function getAzureCredentials(): { clientId: string; clientSecret: string } {
  const clientId = import.meta.env.VITE_AZURE_CLIENT_ID;
  const clientSecret = import.meta.env.VITE_AZURE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Azure credentials not configured. Set VITE_AZURE_CLIENT_ID and VITE_AZURE_CLIENT_SECRET');
  }

  return { clientId, clientSecret };
}

/**
 * Fetch OAuth token from Microsoft Identity Platform
 */
async function fetchToken(
  tenantId: string,
  scope: string,
  cache: Map<string, TokenCacheEntry>
): Promise<string> {
  // Check cache first
  const cached = cache.get(tenantId);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.token;
  }

  // Get credentials
  const { clientId, clientSecret } = getAzureCredentials();

  // Request token
  const tokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
  const proxyUrl = `${CORS_PROXY}${encodeURIComponent(tokenUrl)}`;

  const response = await fetch(proxyUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'client_credentials',
      scope,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Token request failed (${response.status}): ${errorText}`);
  }

  const data: TokenResponse = await response.json();

  // Cache token with 1 minute buffer before expiry
  const expiresAt = Date.now() + (data.expires_in * 1000) - 60000;
  cache.set(tenantId, {
    token: data.access_token,
    expiresAt,
  });

  return data.access_token;
}

/**
 * Get Microsoft Graph API token for a tenant
 * Uses client credentials flow with Graph API scope
 */
export async function getGraphToken(tenantId: string): Promise<string> {
  return fetchToken(
    tenantId,
    'https://graph.microsoft.com/.default',
    graphTokenCache
  );
}

/**
 * Get Bot Framework API token for a tenant
 * Uses client credentials flow with Bot Framework scope
 */
export async function getBotFrameworkToken(tenantId: string): Promise<string> {
  return fetchToken(
    tenantId,
    'https://api.botframework.com/.default',
    botFrameworkTokenCache
  );
}

/**
 * Clear all token caches
 * Useful for testing or when user logs out
 */
export function clearTokenCache(): void {
  graphTokenCache.clear();
  botFrameworkTokenCache.clear();
}
