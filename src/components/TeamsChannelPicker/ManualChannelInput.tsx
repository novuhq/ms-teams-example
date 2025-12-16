interface ManualChannelInputProps {
  teamId: string;
  channelId: string;
  onTeamIdChange: (teamId: string) => void;
  onChannelIdChange: (channelId: string) => void;
}

export function ManualChannelInput({
  teamId,
  channelId,
  onTeamIdChange,
  onChannelIdChange,
}: ManualChannelInputProps) {
  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium mb-1">Team ID:</label>
        <input
          type="text"
          value={teamId}
          onChange={(e) => onTeamIdChange(e.target.value)}
          placeholder="Team GUID"
          className="w-full p-2 border rounded text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Channel ID:</label>
        <input
          type="text"
          value={channelId}
          onChange={(e) => onChannelIdChange(e.target.value)}
          placeholder="19:...@thread.tacv2"
          className="w-full p-2 border rounded text-sm"
        />
      </div>
    </div>
  );
}
