/**
 * Application configuration
 * All configuration values come from environment variables
 */

/**
 * Get Teams context object for API requests
 * Context can be simple string values or rich objects with id and data
 * Examples:
 * - { tenant: "org-acme" } - simple string value
 * - { tenant: { id: "org-acme", data: { name: "Acme Corp" } } } - rich object
 * @returns Context payload with tenant information
 */
export function getTeamsContext(): Record<string, unknown> {
  const tenantId = import.meta.env.VITE_TENANT_ID || 'demo';

  // Simple string value format: { tenant: "demo" }
  return {
    tenant: tenantId,
  };
}

/**
 * Get subscriber ID from environment
 */
export function getSubscriberId(): string | undefined {
  return import.meta.env.VITE_SUBSCRIBER_ID;
}

/**
 * Get integration identifier from environment
 */
export function getIntegrationIdentifier(): string {
  return import.meta.env.VITE_INTEGRATION_IDENTIFIER || 'msteams';
}
