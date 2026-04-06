import { IsString, IsNumber, IsOptional, Min, Max } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class UpdatePlanDto {
  @ApiPropertyOptional({ example: 'Plan Libre Plus' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: 'Acceso total al gimnasio y clases' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 18000 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  price?: number;

  @ApiPropertyOptional({ example: 5 })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(7)
  @Type(() => Number)
  daysPerWeek?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @Type(() => Boolean)
  isActive?: boolean;
}
