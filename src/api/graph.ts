import { getGraphToken } from './tokens';
import { CORS_PROXY, GRAPH_API_BASE } from './constants';
import type { Team, Channel, GraphApiResponse } from '../types';

/**
 * Make an authenticated request to Microsoft Graph API
 */
async function graphRequest<T>(
  endpoint: string,
  tenantId: string
): Promise<T> {
  const token = await getGraphToken(tenantId);
  const url = `${GRAPH_API_BASE}${endpoint}`;
  const proxyUrl = `${CORS_PROXY}${encodeURIComponent(url)}`;

  const response = await fetch(proxyUrl, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    let errorMessage = `Graph API request failed (${response.status})`;
    try {
      const errorText = await response.text();
      errorMessage += `: ${errorText}`;
    } catch {
      errorMessage += ': Unable to read error response';
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

/**
 * Get all teams for a tenant
 * @param tenantId - The Azure AD tenant ID
 * @returns Array of teams
 */
export async function getTeams(tenantId: string): Promise<Team[]> {
  const data: GraphApiResponse<Team> = await graphRequest('/teams', tenantId);
  return data.value;
}

/**
 * Get all channels for a team
 * Only returns standard channels (excludes private channels)
 * @param teamId - The Microsoft Teams team ID
 * @param tenantId - The Azure AD tenant ID
 * @returns Array of standard channels
 */
export async function getChannels(
  teamId: string,
  tenantId: string
): Promise<Channel[]> {
  const data: GraphApiResponse<Channel> = await graphRequest(
    `/teams/${teamId}/channels`,
    tenantId
  );
  // Filter to standard channels only (exclude private channels)
  return data.value.filter((channel) => channel.membershipType === 'standard');
}
