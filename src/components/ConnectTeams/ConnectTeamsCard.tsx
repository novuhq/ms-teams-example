import { generateOAuthUrl } from '../../api/novu';
import { getTeamsContext, getIntegrationIdentifier } from '../../config';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

export function ConnectTeamsCard() {
  const integrationIdentifier = getIntegrationIdentifier();

  const handleConnect = async () => {
    try {
      const context = getTeamsContext();
      const oauthUrl = await generateOAuthUrl({
        integrationIdentifier,
        context: context as { [k: string]: string | import('@novu/api/models/components').GenerateChatOauthUrlRequestDtoContext2 } | undefined,
      });

      window.open(oauthUrl, '_blank');
    } catch (err) {
      console.error('Failed to connect Teams:', err);
    }
  };

  return (
    <Card className="h-full">
      <h3 className="text-lg font-semibold mb-4">Connect Teams</h3>
      <p className="text-sm text-gray-600 mb-4">
        Generate an admin consent URL using Novu's API. When your customers' tenant admins grant consent, 
        Novu creates a <strong>ChannelConnection</strong> (tenant-level connection).
      </p>
      <Button
        onClick={handleConnect}
        variant="primary"
        className="w-full"
      >
        Connect Teams
      </Button>
    </Card>
  );
}
