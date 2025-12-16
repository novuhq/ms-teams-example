import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getChannels } from '../../api/graph';
import type { GetChannelConnectionResponseDto } from '@novu/api/models/components';
import { TeamSelector } from '../shared/TeamSelector';

interface ChannelSelectorProps {
  connection: GetChannelConnectionResponseDto;
  onSelect: (teamId: string, channelId: string) => void;
}

export function ChannelSelector({ connection, onSelect }: ChannelSelectorProps) {
  const [teamId, setTeamId] = useState('');
  const [channelId, setChannelId] = useState('');

  const { data: channels } = useQuery({
    queryKey: ['channels', teamId, connection.workspace.id],
    queryFn: () => getChannels(teamId, connection.workspace.id),
    enabled: !!teamId,
  });

  const handleTeamChange = (newTeamId: string) => {
    setTeamId(newTeamId);
    setChannelId('');
  };

  const handleChannelChange = (newChannelId: string) => {
    setChannelId(newChannelId);
    onSelect(teamId, newChannelId);
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium mb-1">Team:</label>
        <TeamSelector connection={connection} value={teamId} onChange={handleTeamChange} />
      </div>

      {teamId && (
        <div>
          <label className="block text-sm font-medium mb-1">Channel:</label>
          {channels?.length ? (
            <select
              value={channelId}
              onChange={(e) => handleChannelChange(e.target.value)}
              className="w-full p-2 border rounded text-sm"
            >
              <option value="">-- Select channel --</option>
              {channels.map((channel) => (
                <option key={channel.id} value={channel.id}>
                  {channel.displayName}
                </option>
              ))}
            </select>
          ) : (
            <div className="text-gray-500 text-sm">No channels found</div>
          )}
        </div>
      )}
    </div>
  );
}
