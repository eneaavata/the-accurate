import { Module } from '@nestjs/common';
import { OrganisationsService } from './organisations.service';
import { OrganisationsRepository } from './organisations.repository';

@Module({
  providers: [OrganisationsService, OrganisationsRepository],
  exports: [OrganisationsService],
})
export class OrganisationsModule {}
