import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getConnections, getEndpoints, deleteEndpoint, deleteConnection } from '../../api/novu';
import type { GetChannelConnectionResponseDto, GetChannelEndpointResponseDto } from '@novu/api/models/components';
import { EndpointTypeChannel, EndpointTypeUser } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Loading } from '../ui/Loading';

export function NovuSection() {
  const queryClient = useQueryClient();

  const { data: connections, isLoading: connectionsLoading, error: connectionsError } = useQuery<GetChannelConnectionResponseDto[]>({
    queryKey: ['connections'],
    queryFn: getConnections,
  });

  const { data: endpoints, isLoading: endpointsLoading, error: endpointsError } = useQuery<GetChannelEndpointResponseDto[]>({
    queryKey: ['endpoints'],
    queryFn: () => getEndpoints(),
  });

  const deleteEndpointMutation = useMutation({
    mutationFn: deleteEndpoint,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['endpoints'] });
      alert('Endpoint deleted successfully!');
    },
    onError: (error) => {
      alert(`Failed to delete endpoint: ${error instanceof Error ? error.message : 'Unknown error'}`);
    },
  });

  const deleteConnectionMutation = useMutation({
    mutationFn: deleteConnection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['connections'] });
      alert('Connection deleted successfully!');
    },
    onError: (error) => {
      alert(`Failed to delete connection: ${error instanceof Error ? error.message : 'Unknown error'}`);
    },
  });

  const handleDeleteEndpoint = (identifier: string) => {
    if (confirm(`Are you sure you want to delete endpoint "${identifier}"?`)) {
      deleteEndpointMutation.mutate(identifier);
    }
  };

  const handleDeleteConnection = (identifier: string) => {
    if (confirm(`Are you sure you want to delete connection "${identifier}"?`)) {
      deleteConnectionMutation.mutate(identifier);
    }
  };

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-2">Novu Integration State</h2>
      <p className="text-gray-600 mb-6 max-w-4xl">
        This section shows the current state in Novu for your customers: <strong>Channel Connections</strong> represent tenant-level Teams connections 
        (created when your customers' admins grant consent), and <strong>Channel Endpoints</strong> represent specific notification destinations 
        (channels or users) within those tenants that your customers have configured.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Channel Connections Column */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Channel Connections</h3>
          <p className="text-sm text-gray-500 mb-4">
            Tenant-level connections created when a customer's admin grants consent. Each connection represents one Microsoft 365 tenant 
            where your bot has app-only Graph permissions.
          </p>
          <Card>
            {connectionsLoading ? (
              <Loading />
            ) : connectionsError ? (
              <div className="text-red-600 text-sm">
                Error loading connections: {connectionsError instanceof Error ? connectionsError.message : 'Unknown error'}
              </div>
            ) : connections && connections.length > 0 ? (
              <div className="space-y-3">
                {connections.map((connection) => (
                  <div
                    key={connection.identifier}
                    className="border rounded p-3"
                  >
                    <div className="font-medium text-sm">{connection.identifier}</div>
                    <div className="text-xs text-gray-600 mt-1">
                      Type: {connection.channel || 'N/A'} / {connection.providerId || 'N/A'}
                    </div>
                    {connection.workspace.name && (
                      <div className="text-xs text-gray-500 mt-1">
                        Workspace: {connection.workspace.name}
                      </div>
                    )}
                    <div className="text-xs text-gray-500 mt-1">
                      Tenant ID: {connection.workspace.id}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Subscriber: {connection.subscriberId || 'N/A'}
                    </div>
                    {connection.contextKeys && connection.contextKeys.length > 0 && (
                      <div className="text-xs text-gray-500 mt-1">
                        Context: {connection.contextKeys.join(', ')}
                      </div>
                    )}
                    <div className="mt-2">
                      <Button
                        onClick={() => handleDeleteConnection(connection.identifier)}
                        variant="danger"
                        className="text-xs py-1 px-2"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 text-sm">No connections yet</div>
            )}
          </Card>
        </div>

        {/* Channel Endpoints Column */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Channel Endpoints</h3>
          <p className="text-sm text-gray-500 mb-4">
            Specific notification destinations within connected tenants. <strong>Channel</strong> endpoints send to Teams channels, 
            while <strong>User</strong> endpoints send direct messages (DMs) to individual users.
          </p>
          <Card>
            {endpointsLoading ? (
              <Loading />
            ) : endpointsError ? (
              <div className="text-red-600 text-sm">
                Error loading endpoints: {endpointsError instanceof Error ? endpointsError.message : 'Unknown error'}
              </div>
            ) : endpoints && endpoints.length > 0 ? (
              <div className="space-y-3">
                {endpoints.map((endpoint) => (
                  <div
                    key={endpoint.identifier}
                    className="border rounded p-3"
                  >
                    <div className="font-medium text-sm">{endpoint.identifier}</div>
                    <div className="text-xs text-gray-600 mt-1">
                      Type: {endpoint.type === EndpointTypeChannel ? 'Channel' : 'User'}
                    </div>
                    {endpoint.type === EndpointTypeChannel && (
                      <div className="text-xs text-gray-500 mt-1">
                        Team: {(endpoint.endpoint as any).teamId?.slice(0, 20)}... | Channel: {(endpoint.endpoint as any).channelId?.slice(0, 20)}...
                      </div>
                    )}
                    {endpoint.type === EndpointTypeUser && (
                      <div className="text-xs text-gray-500 mt-1">
                        User: {(endpoint.endpoint as any).userId?.slice(0, 20)}...
                      </div>
                    )}
                    {endpoint.subscriberId && (
                      <div className="text-xs text-gray-500 mt-1">
                        Subscriber: {endpoint.subscriberId}
                      </div>
                    )}
                    {endpoint.contextKeys && endpoint.contextKeys.length > 0 && (
                      <div className="text-xs text-gray-500 mt-1">
                        Context: {endpoint.contextKeys.join(', ')}
                      </div>
                    )}
                    <div className="mt-2">
                      <Button
                        onClick={() => handleDeleteEndpoint(endpoint.identifier)}
                        variant="danger"
                        className="text-xs py-1 px-2"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 text-sm">No endpoints yet</div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
