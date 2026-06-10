import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { LeadStage } from '@prisma/client';

export class CreateLeadDto {
  @ApiProperty() @IsString() name: string;
  @ApiPropertyOptional() @IsOptional() @IsString() phone?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() email?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() location?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() budget?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() propertyType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() requirement?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() source?: string;
  @ApiPropertyOptional({ enum: LeadStage }) @IsOptional() @IsEnum(LeadStage) stage?: LeadStage;
  @ApiPropertyOptional() @IsOptional() @IsInt() score?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() value?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() ownerId?: string;
}

export class UpdateLeadDto extends PartialType(CreateLeadDto) {}
