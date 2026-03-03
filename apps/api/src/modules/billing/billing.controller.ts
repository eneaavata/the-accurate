import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
} from '@nestjs/common';
import { SupabaseAuthGuard } from 'src/auth/guards/supabase-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { BillingService } from './billing.service';
import { CreateOrganisationDto } from './dtos/create-organisation.dto';
import type { User } from '@supabase/supabase-js';
import { PermissionGuard } from 'src/auth/guards/permission.guard';
import { RequiredPermission } from 'src/auth/decorators/require-permission.decorator';
import { UpdateSeatsDto } from './dtos/update-seats.dto';

@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Post()
  @UseGuards(SupabaseAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(@CurrentUser() user: User, @Body() dto: CreateOrganisationDto) {
    return this.billingService.createOrganisation(
      user,
      dto.name,
      dto.idempotencyKey,
    );
  }

  @Patch(':organisationId/seats')
  @UseGuards(SupabaseAuthGuard, PermissionGuard)
  @RequiredPermission('organisations.update')
  @HttpCode(HttpStatus.OK)
  async updateSeats(
    @Param('organisationId') organisationId: string,
    @Body() dto: UpdateSeatsDto,
  ) {
    return this.billingService.updateSeats(
      organisationId,
      dto.seats,
      dto.idempotencyKey,
    );
  }
}
