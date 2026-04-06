import { IsString, IsNotEmpty, IsNumber, IsOptional, Min, Max, MinLength, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreatePlanDto {
  @ApiProperty({ example: 'Plan Libre', description: 'Nombre del plan' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({ example: 'Acceso ilimitado al gimnasio' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 15000 })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price: number;

  @ApiPropertyOptional({ example: 7, description: 'Días por semana (null = ilimitado)' })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(7)
  @Type(() => Number)
  daysPerWeek?: number;
}
