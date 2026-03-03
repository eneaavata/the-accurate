import { IsUUID, IsOptional, Min, IsInt } from "class-validator";

export class UpdateSeatsDto {
    @IsInt()
    @Min(1)
    seats: number;

    @IsOptional()
    @IsUUID("4", { message: "idempotencyKey must be a valid UUID v4" })
    idempotencyKey: string;
}