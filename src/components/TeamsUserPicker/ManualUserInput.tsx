interface ManualUserInputProps {
  userId: string;
  onUserIdChange: (userId: string) => void;
}

export function ManualUserInput({ userId, onUserIdChange }: ManualUserInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">User ID:</label>
      <input
        type="text"
        value={userId}
        onChange={(e) => onUserIdChange(e.target.value)}
        placeholder="29:..."
        className="w-full p-2 border rounded text-sm"
      />
    </div>
  );
}
