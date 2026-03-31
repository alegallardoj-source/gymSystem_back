import { IsEmail, IsEnum, IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../../common/enums/role.enum';

export class CreateDto {
  @ApiProperty({ example: 'María' })
  @IsString() @MaxLength(100)
  name: string;

  @ApiProperty({ example: 'González' })
  @IsString() @MaxLength(100)
  lastname: string;

  @ApiProperty({ example: 'maria@gimnasio.com' })
  @IsEmail({}, { message: 'El email no tiene formato válido' })
  email: string;

  @ApiProperty({ example: 'MiPassword123' })
  @IsString()
  @MinLength(8, { message: 'Mínimo 8 caracteres' })
  password: string;

  @ApiProperty({ enum: Role })
  @IsEnum(Role)
  role: Role;
}