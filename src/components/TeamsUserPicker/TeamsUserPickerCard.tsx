import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createEndpoint } from '../../api/novu';
import { getTeamsContext, getSubscriberId, getIntegrationIdentifier } from '../../config';
import type { GetChannelConnectionResponseDto, CreateMsTeamsUserEndpointDto } from '@novu/api/models/components';
import { EndpointTypeUser } from '../../types';
import { Card } from '../ui/Card';
import { UserSelector } from './UserSelector';
import { ManualUserInput } from './ManualUserInput';
import { EndpointForm } from '../shared/EndpointForm';

interface TeamsUserPickerCardProps {
  connection: GetChannelConnectionResponseDto | null;
}

export function TeamsUserPickerCard({ connection }: TeamsUserPickerCardProps) {
  const [mode, setMode] = useState<'select' | 'manual'>('select');
  const [userId, setUserId] = useState('');
  const [endpointId, setEndpointId] = useState('');

  const queryClient = useQueryClient();
  const integrationIdentifier = getIntegrationIdentifier();
  const context = getTeamsContext();
  const subscriberId = getSubscriberId();

  const resetForm = () => {
    setUserId('');
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
    if (!connection || !subscriberId || !userId) return;

    const endpointData: CreateMsTeamsUserEndpointDto = {
      ...(endpointId.trim() && { identifier: endpointId.trim() }),
      integrationIdentifier,
      subscriberId,
      context: context as { [k: string]: string | import('@novu/api/models/components').CreateMsTeamsUserEndpointDtoContext2 } | undefined,
      connectionIdentifier: connection.identifier,
      type: EndpointTypeUser,
      endpoint: { userId },
    };

    createMutation.mutate(endpointData);
  };

  if (!connection) {
    return (
      <Card className="h-full">
        <h3 className="text-lg font-semibold mb-4">Create User Endpoint</h3>
        <p className="text-sm text-gray-600 mb-4">
          Use Bot Framework roster API to discover users, or let customers enter Teams user IDs manually. 
          Creates a <strong>ChannelEndpoint</strong> for direct messages (DMs).
        </p>
        <div className="text-gray-500 text-sm">Connect Teams first</div>
      </Card>
    );
  }

  const canSubmit = userId && subscriberId;

  return (
    <Card className="h-full">
      <h3 className="text-lg font-semibold mb-4">Create User Endpoint</h3>
      <p className="text-sm text-gray-600 mb-4">
        Use Bot Framework roster API to discover users, or let customers enter Teams user IDs manually. 
        Creates a <strong>ChannelEndpoint</strong> for direct messages (DMs).
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
          <UserSelector
            connection={connection}
            onSelect={(uId) => setUserId(uId)}
          />
        )}

        {mode === 'manual' && (
          <ManualUserInput
            userId={userId}
            onUserIdChange={setUserId}
          />
        )}

        {userId && (
          <EndpointForm
            type="user"
            endpointId={endpointId}
            onEndpointIdChange={setEndpointId}
            onSubmit={handleSubmit}
            isLoading={createMutation.isPending}
            disabled={!canSubmit}
          />
        )}
      </div>
    </Card>
  );
}
