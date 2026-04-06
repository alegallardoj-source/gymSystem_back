import { IsString, IsNotEmpty, IsNumber, IsUUID, IsDateString, IsOptional, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateStudentDto {
  @ApiProperty({ example: 'Juan' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Pérez' })
  @IsString()
  @IsNotEmpty()
  lastname: string;

  @ApiProperty({ example: '12345678' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9]{7,10}$/, { message: 'DNI debe contener solo números (7-10 dígitos)' })
  dni: string;

  @ApiProperty({ example: '1995-06-15' })
  @IsDateString()
  birthDate: string;

  @ApiPropertyOptional({ example: '+5493884123456' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ example: 'Calle Falsa 123' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ example: 'juan.perez@gmail.com' })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '2025-01-15' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  planId: string;
}
