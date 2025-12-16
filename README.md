# Microsoft Teams Integration Demo with Novu

A React demo application showing how to implement Microsoft Teams integration in your product using Novu's notification platform.

> 📚 **For detailed setup instructions and Azure configuration, see the [official Novu MS Teams documentation](https://docs.novu.co/platform/integrations/chat/ms-teams)**

## Overview

This demo shows how to implement Microsoft Teams integration in your product. Your customers connect their Teams tenants and configure notification destinations. Novu sends notifications using **your bot identity** to Teams channels or users.

### Key Concepts

- **ChannelConnection**: Tenant-level Teams connection (created via admin consent)
- **ChannelEndpoint**: Specific notification destination:
  - `ms_teams_channel`: Send to Teams channels
  - `ms_teams_user`: Send direct messages (DMs)

## What This Demo Shows

- Generating admin consent URLs using Novu's API
- Discovering Teams channels via Microsoft Graph API
- Discovering Teams users via Bot Framework roster API
- Creating channel and user endpoints
- Managing connections and endpoints

## Prerequisites

- Node.js 20+
- Novu account with API key
- Microsoft Azure AD app registration (multi-tenant) with Graph API permissions
- Azure Bot resource configured
- Teams app created and published

See the [official documentation](https://docs.novu.co/platform/integrations/chat/ms-teams) for detailed Azure setup instructions.

## Environment Variables

Create a `.env.local` file:

```bash
VITE_NOVU_API_KEY=your_novu_api_key
VITE_NOVU_API_URL=https://api.novu.co  # or https://eu.api.novu.co for EU
VITE_INTEGRATION_IDENTIFIER=ms-teams-bot
VITE_AZURE_CLIENT_ID=your_azure_client_id
VITE_AZURE_CLIENT_SECRET=your_azure_client_secret
VITE_AZURE_TENANT_ID=your_azure_tenant_id
VITE_SUBSCRIBER_ID=your_subscriber_id
```

See `.env.local.example` for a template.

## Setup

```bash
npm install
cp .env.local.example .env.local
# Edit .env.local with your credentials
npm run dev
```

## Usage

1. **Connect Teams**: Click "Connect Teams" → Complete admin consent → Connection appears in list
2. **Create Channel Endpoint**: Select team/channel (or enter IDs manually) → Create endpoint
3. **Create User Endpoint**: Select team/user (or enter user ID manually) → Create endpoint
4. **Manage**: View and delete connections/endpoints in the "Novu Integration State" section

## APIs Used

- **Novu API** (`@novu/api` SDK): Generate OAuth URLs, manage connections/endpoints
- **Microsoft Graph API**: Discover teams and channels
- **Bot Framework API**: Discover team members for DMs

## Project Structure

- `src/api/` - API clients (Novu, Graph, Bot Framework)
- `src/components/` - React components (ConnectTeams, TeamsChannelPicker, TeamsUserPicker, etc.)
- `src/config.ts` - Configuration helpers

⚠️ **Important**: This demo uses a CORS proxy for API calls. **Do not use in production!** Implement a proper backend proxy.
