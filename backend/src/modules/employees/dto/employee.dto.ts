import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsEmail, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateEmployeeDto {
  @ApiProperty() @IsString() name: string;
  @ApiProperty() @IsString() title: string;
  @ApiProperty() @IsString() department: string;
  @ApiProperty() @IsEmail() email: string;
  @ApiPropertyOptional() @IsOptional() @IsString() phone?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() salary?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() productivity?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() attendancePct?: number;
}

export class UpdateEmployeeDto extends PartialType(CreateEmployeeDto) {}
