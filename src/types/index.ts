import { GetChannelEndpointResponseDtoType } from '@novu/api/models/components';

// Export enum values as constants for easier use in components
export const EndpointTypeChannel = GetChannelEndpointResponseDtoType.MsTeamsChannel;
export const EndpointTypeUser = GetChannelEndpointResponseDtoType.MsTeamsUser;

// Microsoft Graph API Types
export interface Team {
  id: string; // Graph team GUID
  displayName: string;
  description?: string;
  webUrl?: string;
}

export interface Channel {
  id: string; // Format: 19:...@thread.tacv2
  displayName: string;
  description?: string;
  membershipType: 'standard' | 'private' | 'shared';
  webUrl?: string;
}

// Bot Framework API Types
export interface TeamMember {
  id: string; // Teams user ID format: 29:...
  name: string;
  email?: string;
  userPrincipalName?: string;
  aadObjectId?: string;
}


export interface GraphApiResponse<T> {
  value: T[];
  '@odata.context'?: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope?: string;
}
