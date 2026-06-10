import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateClientDto {
  @ApiProperty() @IsString() name: string;
  @ApiProperty() @IsString() company: string;
  @ApiProperty() @IsString() type: string;
  @ApiPropertyOptional() @IsOptional() @IsString() email?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() phone?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() gstin?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() pan?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() billingAddr?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() siteAddr?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() decisionMaker?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() rating?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() lifetimeValue?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() style?: string;
}

export class UpdateClientDto extends PartialType(CreateClientDto) {}
