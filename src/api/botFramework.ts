import { getBotFrameworkToken } from './tokens';
import { CORS_PROXY, BOT_FRAMEWORK_API_BASE } from './constants';
import type { TeamMember } from '../types';

/**
 * Extract members array from various response formats
 */
function extractMembers(data: unknown): TeamMember[] {
  // Direct array response
  if (Array.isArray(data)) {
    return data;
  }

  // Object with members property
  if (data && typeof data === 'object' && 'members' in data) {
    const members = (data as { members: unknown }).members;
    if (Array.isArray(members)) {
      return members;
    }
  }

  // Object with value property (Graph API style)
  if (data && typeof data === 'object' && 'value' in data) {
    const value = (data as { value: unknown }).value;
    if (Array.isArray(value)) {
      return value;
    }
  }

  // No members found
  return [];
}

/**
 * Get team members for a conversation
 * Uses Bot Framework API to retrieve members of a Teams conversation
 * @param conversationId - The team conversation ID (format: 19:...@thread.tacv2)
 * @param tenantId - The Azure AD tenant ID for token acquisition
 * @returns Array of team members
 */
export async function getMembers(
  conversationId: string,
  tenantId: string
): Promise<TeamMember[]> {
  const token = await getBotFrameworkToken(tenantId);
  const membersUrl = `${BOT_FRAMEWORK_API_BASE}/conversations/${conversationId}/members`;
  const proxyUrl = `${CORS_PROXY}${encodeURIComponent(membersUrl)}`;

  const response = await fetch(proxyUrl, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    let errorMessage = `Bot Framework API request failed (${response.status})`;
    try {
      const errorText = await response.text();
      errorMessage += `: ${errorText}`;
    } catch {
      errorMessage += ': Unable to read error response';
    }
    throw new Error(errorMessage);
  }

  const data = await response.json();
  return extractMembers(data);
}
