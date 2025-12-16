import { Novu } from '@novu/api';
import {
  GetChannelEndpointResponseDtoType,
} from '@novu/api/models/components';
import type {
  CreateMsTeamsChannelEndpointDto,
  CreateMsTeamsUserEndpointDto,
  GenerateChatOauthUrlRequestDto,
  GetChannelConnectionResponseDto,
  GetChannelEndpointResponseDto,
} from '@novu/api/models/components';

/**
 * Novu API configuration
 */
const API_KEY = import.meta.env.VITE_NOVU_API_KEY;
const API_URL = import.meta.env.VITE_NOVU_API_URL;

if (!API_KEY) {
  console.warn('VITE_NOVU_API_KEY is not set. Novu API calls will fail.');
}

/**
 * Check if API key is configured
 */
function ensureApiKey(): void {
  if (!API_KEY) {
    throw new Error('Novu API key not configured. Set VITE_NOVU_API_KEY environment variable.');
  }
}

/**
 * Get or create Novu SDK client instance
 */
function getNovuClient(): Novu {
  ensureApiKey();

  if (!API_KEY) {
    throw new Error('API key is required');
  }

  const options: { secretKey: string; serverURL?: string } = {
    secretKey: API_KEY,
  };

  // In development, use the Vite proxy to avoid CORS issues
  // In production, use the actual API URL
  if (import.meta.env.DEV && typeof window !== 'undefined') {
    options.serverURL = `${window.location.origin}/api/novu`;
  } else if (API_URL) {
    options.serverURL = API_URL;
  }

  return new Novu(options);
}


/**
 * Generate OAuth URL for admin consent
 * @param params - OAuth URL generation parameters
 * @returns OAuth URL string
 */
export async function generateOAuthUrl(
  params: GenerateChatOauthUrlRequestDto
): Promise<string> {
  const novu = getNovuClient();
  const response = await novu.integrations.generateChatOAuthUrl(params);
  return response.result.url;
}

/**
 * Get all channel connections
 * @returns Array of channel connections
 */
export async function getConnections(): Promise<GetChannelConnectionResponseDto[]> {
  const novu = getNovuClient();
  const response = await novu.channelConnections.list({});
  return response.result.data;
}

/**
 * Get a specific channel connection by identifier
 * @param identifier - The connection identifier
 * @returns Channel connection details
 */
export async function getConnection(
  identifier: string
): Promise<GetChannelConnectionResponseDto> {
  const novu = getNovuClient();
  const response = await novu.channelConnections.retrieve(identifier);
  return response.result;
}

/**
 * Get all channel endpoints
 * @param params - Optional filters (connectionIdentifier, type)
 * @returns Array of channel endpoints
 */
export async function getEndpoints(params?: {
  connectionIdentifier?: string;
  type?: typeof GetChannelEndpointResponseDtoType.MsTeamsChannel | typeof GetChannelEndpointResponseDtoType.MsTeamsUser;
}): Promise<GetChannelEndpointResponseDto[]> {
  const novu = getNovuClient();
  const response = await novu.channelEndpoints.list({
    connectionIdentifier: params?.connectionIdentifier,
  });

  let endpoints = response.result.data;

  // Filter by type if specified
  if (params?.type) {
    endpoints = endpoints.filter((ep) => ep.type === params.type);
  }

  return endpoints;
}

/**
 * Create a channel endpoint
 * @param endpointData - Endpoint creation data
 * @returns Created channel endpoint
 */
export async function createEndpoint(
  endpointData: CreateMsTeamsChannelEndpointDto | CreateMsTeamsUserEndpointDto
): Promise<GetChannelEndpointResponseDto> {
  const novu = getNovuClient();
  const response = await novu.channelEndpoints.create(endpointData);
  return response.result;
}

/**
 * Delete a channel endpoint
 * @param identifier - The endpoint identifier
 */
export async function deleteEndpoint(identifier: string): Promise<void> {
  const novu = getNovuClient();

  await novu.channelEndpoints.delete(identifier);
}

/**
 * Delete a channel connection
 * @param identifier - The connection identifier
 */
export async function deleteConnection(identifier: string): Promise<void> {
  const novu = getNovuClient();

  await novu.channelConnections.delete(identifier);
}
