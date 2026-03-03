import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsUUID,
  IsOptional,
} from 'class-validator';

export class CreateOrganisationDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  name: string;

  @IsOptional()
  @IsUUID('4', { message: 'idempotencyKey must be a valid UUID v4' })
  idempotencyKey: string;
}
