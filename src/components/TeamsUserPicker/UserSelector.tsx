import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getChannels } from '../../api/graph';
import { getMembers } from '../../api/botFramework';
import type { GetChannelConnectionResponseDto } from '@novu/api/models/components';
import { Loading } from '../ui/Loading';
import { TeamSelector } from '../shared/TeamSelector';

interface UserSelectorProps {
  connection: GetChannelConnectionResponseDto;
  onSelect: (userId: string) => void;
}

export function UserSelector({ connection, onSelect }: UserSelectorProps) {
  const [teamId, setTeamId] = useState('');
  const [userId, setUserId] = useState('');

  const { data: channels } = useQuery({
    queryKey: ['channels', teamId, connection.workspace.id],
    queryFn: () => getChannels(teamId, connection.workspace.id),
    enabled: !!teamId,
  });

  // Use General channel (or first channel if General not found)
  const conversationId = channels?.find(ch => ch.displayName === 'General')?.id || channels?.[0]?.id;
  const { data: members, isLoading: membersLoading, error: membersError } = useQuery({
    queryKey: ['members', conversationId, connection.workspace.id],
    queryFn: () => getMembers(conversationId!, connection.workspace.id),
    enabled: !!conversationId,
  });

  const handleTeamChange = (newTeamId: string) => {
    setTeamId(newTeamId);
    setUserId('');
  };

  const handleUserChange = (newUserId: string) => {
    setUserId(newUserId);
    onSelect(newUserId);
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium mb-1">Team:</label>
        <TeamSelector connection={connection} value={teamId} onChange={handleTeamChange} />
      </div>

      {teamId && (
        <div>
          <label className="block text-sm font-medium mb-1">User:</label>
          {membersLoading ? (
            <Loading message="Loading..." />
          ) : membersError ? (
            <div className="text-red-600 text-sm">
              {membersError instanceof Error
                ? membersError.message
                : 'Failed to load members. Make sure the bot is installed in this team.'}
            </div>
          ) : members?.length ? (
            <select
              value={userId}
              onChange={(e) => handleUserChange(e.target.value)}
              className="w-full p-2 border rounded text-sm"
            >
              <option value="">-- Select user --</option>
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name} {member.email ? `(${member.email})` : ''}
                </option>
              ))}
            </select>
          ) : (
            <div className="text-gray-500 text-sm">No members found. Make sure the bot is installed in this team.</div>
          )}
        </div>
      )}
    </div>
  );
}
