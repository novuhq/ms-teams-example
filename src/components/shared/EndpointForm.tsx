import { Button } from '../ui/Button';

interface EndpointFormProps {
  type: 'channel' | 'user';
  endpointId: string;
  onEndpointIdChange: (id: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  disabled?: boolean;
}

export function EndpointForm({
  type,
  endpointId,
  onEndpointIdChange,
  onSubmit,
  isLoading,
  disabled,
}: EndpointFormProps) {
  const isDisabled = disabled;

  return (
    <>
      <div>
        <label className="block text-sm font-medium mb-1">
          Endpoint ID (optional):
        </label>
        <input
          type="text"
          value={endpointId}
          onChange={(e) => onEndpointIdChange(e.target.value)}
          placeholder="Auto-generated if empty"
          className="w-full p-2 border rounded text-sm"
        />
      </div>
      <Button
        onClick={onSubmit}
        isLoading={isLoading}
        variant="primary"
        className="w-full"
        disabled={isDisabled}
      >
        Create {type === 'channel' ? 'Channel' : 'User'} Endpoint
      </Button>
    </>
  );
}
