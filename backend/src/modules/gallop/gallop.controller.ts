import { Controller, Get, Logger } from '@nestjs/common';
import { GallopService } from './gallop.service';

@Controller('api/studies/gallop')
export class GallopController {
  private readonly logger = new Logger(GallopController.name);

  constructor(private gallopService: GallopService) {}

  /**
   * GET /api/studies/gallop/visits
   * Fetch all visits from SharePoint VisitScheduler
   */
  @Get('visits')
  async getVisits() {
    this.logger.log('Fetching GALLOP visits from SharePoint');
    const visits = await this.gallopService.getVisits();
    const stats = await this.gallopService.getVisitStats();

    return {
      success: true,
      data: {
        visits,
        stats,
      },
    };
  }

  /**
   * GET /api/studies/gallop/visits/schema
   * Get the SharePoint list schema (for debugging field names)
   */
  @Get('visits/schema')
  async getVisitSchema() {
    this.logger.log('Fetching GALLOP VisitScheduler schema');
    const schema = await this.gallopService.getListSchema();

    return {
      success: true,
      data: schema.map((col) => ({
        name: col.name,
        displayName: col.displayName,
        type: col.type?.name || col.type,
        required: col.required,
      })),
    };
  }

  /**
   * GET /api/studies/gallop/stats
   * Get GALLOP study statistics
   */
  @Get('stats')
  async getStats() {
    const visitStats = await this.gallopService.getVisitStats();

    return {
      success: true,
      data: {
        visits: visitStats,
        // Add more stats as needed (participants, data quality, etc.)
      },
    };
  }
}
