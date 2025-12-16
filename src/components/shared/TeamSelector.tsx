import { useQuery } from '@tanstack/react-query';
import { getTeams } from '../../api/graph';
import type { GetChannelConnectionResponseDto } from '@novu/api/models/components';
import { Loading } from '../ui/Loading';

interface TeamSelectorProps {
  connection: GetChannelConnectionResponseDto;
  value: string;
  onChange: (teamId: string) => void;
}

export function TeamSelector({ connection, value, onChange }: TeamSelectorProps) {
  const { data: teams, isLoading } = useQuery({
    queryKey: ['teams', connection.workspace.id],
    queryFn: () => getTeams(connection.workspace.id),
  });

  if (isLoading) {
    return <Loading message="Loading..." />;
  }

  if (!teams?.length) {
    return <div className="text-gray-500 text-sm">No teams found</div>;
  }

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-2 border rounded text-sm"
    >
      <option value="">-- Select team --</option>
      {teams.map((team) => (
        <option key={team.id} value={team.id}>
          {team.displayName}
        </option>
      ))}
    </select>
  );
}
