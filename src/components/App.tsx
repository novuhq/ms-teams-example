import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { getConnections } from '../api/novu';
import { ConnectTeamsCard } from './ConnectTeams/ConnectTeamsCard';
import { TeamsChannelPickerCard } from './TeamsChannelPicker/TeamsChannelPickerCard';
import { TeamsUserPickerCard } from './TeamsUserPicker/TeamsUserPickerCard';
import { NovuSection } from './platform/NovuSection';
import type { GetChannelConnectionResponseDto } from '@novu/api/models/components';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function AppContent() {
  const { data: connections } = useQuery<GetChannelConnectionResponseDto[]>({
    queryKey: ['connections'],
    queryFn: getConnections,
  });

  // Use the first connection if available
  const selectedConnection = connections && connections.length > 0 ? connections[0] : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Top Section: Integration Demo */}
        <div className="mb-12">
          <h1 className="text-2xl font-bold mb-4">Microsoft Teams Integration Demo</h1>
          <div className="mb-6 max-w-4xl">
            <p className="text-gray-700 mb-3">
              This demo shows how to implement Microsoft Teams integration in your product. Your customers will connect their Teams tenants 
              and configure notification destinations. Novu sends notifications using <strong>your bot identity</strong> to Teams channels or users.
            </p>
            <p className="text-sm text-gray-600">
              <strong>What you need to build:</strong> You can either implement Teams UI pickers (like shown below) that use Microsoft Graph API 
              and Bot Framework APIs to discover channels/users, or provide a way for your customers to manually enter destination IDs 
              (team/channel IDs or user IDs). Either approach creates <strong>ChannelEndpoints</strong> in Novu that your workflows can target.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ConnectTeamsCard />
            <TeamsChannelPickerCard connection={selectedConnection} />
            <TeamsUserPickerCard connection={selectedConnection} />
          </div>
        </div>

        {/* Bottom Section: Novu */}
        <NovuSection />
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

export default App;
