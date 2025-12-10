import { Module } from '@nestjs/common';
import { GallopController } from './gallop.controller';
import { GallopService } from './gallop.service';
import { SharePointModule } from '../../integrations/sharepoint';

@Module({
  imports: [SharePointModule],
  controllers: [GallopController],
  providers: [GallopService],
  exports: [GallopService],
})
export class GallopModule {}
