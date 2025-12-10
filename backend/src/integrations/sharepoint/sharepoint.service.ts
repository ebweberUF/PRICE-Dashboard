import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';

interface SharePointToken {
  access_token: string;
  expires_in: number;
  expiresAt: number;
}

interface SharePointListItem {
  id: string;
  fields: Record<string, any>;
}

@Injectable()
export class SharePointService {
  private readonly logger = new Logger(SharePointService.name);
  private token: SharePointToken | null = null;
  private client: AxiosInstance;

  private readonly tenantId: string;
  private readonly clientId: string;
  private readonly clientSecret: string;

  constructor(private configService: ConfigService) {
    this.tenantId = this.configService.get<string>('SHAREPOINT_TENANT_ID') || '';
    this.clientId = this.configService.get<string>('SHAREPOINT_CLIENT_ID') || '';
    this.clientSecret = this.configService.get<string>('SHAREPOINT_CLIENT_SECRET') || '';

    this.client = axios.create({
      timeout: 30000,
    });
  }

  /**
   * Get access token using client credentials flow
   */
  private async getAccessToken(): Promise<string> {
    // Return cached token if still valid (with 5 min buffer)
    if (this.token && Date.now() < this.token.expiresAt - 300000) {
      return this.token.access_token;
    }

    const tokenUrl = `https://login.microsoftonline.com/${this.tenantId}/oauth2/v2.0/token`;

    const params = new URLSearchParams({
      client_id: this.clientId,
      client_secret: this.clientSecret,
      scope: 'https://graph.microsoft.com/.default',
      grant_type: 'client_credentials',
    });

    try {
      const response = await axios.post(tokenUrl, params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });

      this.token = {
        access_token: response.data.access_token,
        expires_in: response.data.expires_in,
        expiresAt: Date.now() + response.data.expires_in * 1000,
      };

      this.logger.log('SharePoint access token acquired');
      return this.token.access_token;
    } catch (error) {
      this.logger.error('Failed to get SharePoint access token', error.message);
      throw new Error('SharePoint authentication failed');
    }
  }

  /**
   * Get all items from a SharePoint list
   */
  async getListItems(siteId: string, listId: string): Promise<SharePointListItem[]> {
    const token = await this.getAccessToken();
    const url = `https://graph.microsoft.com/v1.0/sites/${siteId}/lists/${listId}/items?expand=fields`;

    try {
      const response = await this.client.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data.value || [];
    } catch (error) {
      this.logger.error(`Failed to fetch list items: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get SharePoint site ID by site URL
   */
  async getSiteId(siteUrl: string): Promise<string> {
    const token = await this.getAccessToken();

    // Extract hostname and site path from URL
    // e.g., https://uflorida.sharepoint.com/sites/PRICE-GALLOP
    const url = new URL(siteUrl);
    const hostname = url.hostname;
    const sitePath = url.pathname;

    const graphUrl = `https://graph.microsoft.com/v1.0/sites/${hostname}:${sitePath}`;

    try {
      const response = await this.client.get(graphUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data.id;
    } catch (error) {
      this.logger.error(`Failed to get site ID: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get list ID by list name
   */
  async getListId(siteId: string, listName: string): Promise<string> {
    const token = await this.getAccessToken();
    const url = `https://graph.microsoft.com/v1.0/sites/${siteId}/lists?$filter=displayName eq '${listName}'`;

    try {
      const response = await this.client.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.value && response.data.value.length > 0) {
        return response.data.value[0].id;
      }

      throw new Error(`List '${listName}' not found`);
    } catch (error) {
      this.logger.error(`Failed to get list ID: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get list columns/fields schema
   */
  async getListColumns(siteId: string, listId: string): Promise<any[]> {
    const token = await this.getAccessToken();
    const url = `https://graph.microsoft.com/v1.0/sites/${siteId}/lists/${listId}/columns`;

    try {
      const response = await this.client.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data.value || [];
    } catch (error) {
      this.logger.error(`Failed to get list columns: ${error.message}`);
      throw error;
    }
  }
}
