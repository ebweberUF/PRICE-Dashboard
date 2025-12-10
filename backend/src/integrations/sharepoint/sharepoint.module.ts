import { Module } from '@nestjs/common';
import { SharePointService } from './sharepoint.service';

@Module({
  providers: [SharePointService],
  exports: [SharePointService],
})
export class SharePointModule {}
