import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createEndpoint } from '../../api/novu';
import { getTeamsContext, getSubscriberId, getIntegrationIdentifier } from '../../config';
import type { GetChannelConnectionResponseDto, CreateMsTeamsChannelEndpointDto } from '@novu/api/models/components';
import { EndpointTypeChannel } from '../../types';
import { Card } from '../ui/Card';
import { ChannelSelector } from './ChannelSelector';
import { ManualChannelInput } from './ManualChannelInput';
import { EndpointForm } from '../shared/EndpointForm';

interface TeamsChannelPickerCardProps {
  connection: GetChannelConnectionResponseDto | null;
}

export function TeamsChannelPickerCard({ connection }: TeamsChannelPickerCardProps) {
  const [mode, setMode] = useState<'select' | 'manual'>('select');
  const [teamId, setTeamId] = useState('');
  const [channelId, setChannelId] = useState('');
  const [endpointId, setEndpointId] = useState('');

  const queryClient = useQueryClient();
  const integrationIdentifier = getIntegrationIdentifier();
  const context = getTeamsContext();
  const subscriberId = getSubscriberId();

  const resetForm = () => {
    setTeamId('');
    setChannelId('');
    setEndpointId('');
  };

  const createMutation = useMutation({
    mutationFn: createEndpoint,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['endpoints'] });
      resetForm();
    },
    onError: (error) => {
      console.error('Failed to create endpoint:', error);
    },
  });

  const handleSubmit = () => {
    if (!connection || !subscriberId || !teamId || !channelId) return;

    const endpointData: CreateMsTeamsChannelEndpointDto = {
      ...(endpointId.trim() && { identifier: endpointId.trim() }),
      integrationIdentifier,
      subscriberId,
      context: context as { [k: string]: string | import('@novu/api/models/components').CreateMsTeamsChannelEndpointDtoContext2 } | undefined,
      connectionIdentifier: connection.identifier,
      type: EndpointTypeChannel,
      endpoint: { teamId, channelId },
    };

    createMutation.mutate(endpointData);
  };

  if (!connection) {
    return (
      <Card className="h-full">
        <h3 className="text-lg font-semibold mb-4">Create Channel Endpoint</h3>
        <p className="text-sm text-gray-600 mb-4">
          Use Microsoft Graph API to discover channels, or let customers enter team/channel IDs manually. 
          Creates a <strong>ChannelEndpoint</strong> for channel notifications.
        </p>
        <div className="text-gray-500 text-sm">Connect Teams first</div>
      </Card>
    );
  }

  const canSubmit = teamId && channelId && subscriberId;

  return (
    <Card className="h-full">
      <h3 className="text-lg font-semibold mb-4">Create Channel Endpoint</h3>
      <p className="text-sm text-gray-600 mb-4">
        Use Microsoft Graph API to discover channels, or let customers enter team/channel IDs manually. 
        Creates a <strong>ChannelEndpoint</strong> for channel notifications.
      </p>
      
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-1">Mode:</label>
          <select
            value={mode}
            onChange={(e) => {
              setMode(e.target.value as 'select' | 'manual');
              resetForm();
            }}
            className="w-full p-2 border rounded text-sm"
          >
            <option value="select">Select from Teams</option>
            <option value="manual">Manual ID</option>
          </select>
        </div>

        {mode === 'select' && (
          <ChannelSelector
            connection={connection}
            onSelect={(tId, cId) => {
              setTeamId(tId);
              setChannelId(cId);
            }}
          />
        )}

        {mode === 'manual' && (
          <ManualChannelInput
            teamId={teamId}
            channelId={channelId}
            onTeamIdChange={setTeamId}
            onChannelIdChange={setChannelId}
          />
        )}

        {canSubmit && (
          <EndpointForm
            type="channel"
            endpointId={endpointId}
            onEndpointIdChange={setEndpointId}
            onSubmit={handleSubmit}
            isLoading={createMutation.isPending}
          />
        )}
      </div>
    </Card>
  );
}
