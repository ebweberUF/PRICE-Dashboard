import { Injectable, Logger } from '@nestjs/common';
import { SharePointService } from '../../integrations/sharepoint';

// SharePoint site configuration for GALLOP
const GALLOP_SHAREPOINT = {
  siteUrl: 'https://uflorida.sharepoint.com/sites/PRICE-GALLOP',
  listName: 'VisitScheduler',
};

export interface GallopVisit {
  id: string;
  title: string;
  subjectId: string;
  visitType: string;
  startDate: string;
  endDate: string;
  status: string;
  location: string;
  notes: string;
}

@Injectable()
export class GallopService {
  private readonly logger = new Logger(GallopService.name);
  private siteId: string | null = null;
  private listId: string | null = null;

  constructor(private sharePointService: SharePointService) {}

  /**
   * Initialize SharePoint IDs (cached after first call)
   */
  private async initializeSharePoint(): Promise<void> {
    if (!this.siteId) {
      this.siteId = await this.sharePointService.getSiteId(GALLOP_SHAREPOINT.siteUrl);
      this.logger.log(`GALLOP SharePoint Site ID: ${this.siteId}`);
    }

    if (!this.listId) {
      this.listId = await this.sharePointService.getListId(this.siteId, GALLOP_SHAREPOINT.listName);
      this.logger.log(`GALLOP VisitScheduler List ID: ${this.listId}`);
    }
  }

  /**
   * Get the list schema to understand available fields
   */
  async getListSchema(): Promise<any[]> {
    await this.initializeSharePoint();
    return this.sharePointService.getListColumns(this.siteId!, this.listId!);
  }

  /**
   * Fetch all visits from SharePoint VisitScheduler list
   */
  async getVisits(): Promise<GallopVisit[]> {
    await this.initializeSharePoint();

    const items = await this.sharePointService.getListItems(this.siteId!, this.listId!);

    // Map SharePoint list items to our visit structure
    // Note: Field names may need adjustment based on actual SharePoint list schema
    return items.map((item) => {
      const fields = item.fields;

      return {
        id: item.id,
        title: fields.Title || '',
        subjectId: fields.SubjectID || fields.Subject_x0020_ID || fields.ParticipantID || '',
        visitType: fields.VisitType || fields.Visit_x0020_Type || fields.Category || '',
        startDate: fields.EventDate || fields.StartDate || fields.Start || '',
        endDate: fields.EndDate || fields.End || '',
        status: fields.Status || 'scheduled',
        location: fields.Location || '',
        notes: fields.Description || fields.Notes || '',
      };
    });
  }

  /**
   * Get visit statistics
   */
  async getVisitStats(): Promise<{
    total: number;
    scheduled: number;
    completed: number;
    missed: number;
  }> {
    const visits = await this.getVisits();

    const stats = {
      total: visits.length,
      scheduled: 0,
      completed: 0,
      missed: 0,
    };

    visits.forEach((visit) => {
      const status = visit.status?.toLowerCase() || '';
      if (status.includes('complete')) {
        stats.completed++;
      } else if (status.includes('miss') || status.includes('cancel')) {
        stats.missed++;
      } else {
        stats.scheduled++;
      }
    });

    return stats;
  }
}
