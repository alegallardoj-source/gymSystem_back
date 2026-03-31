import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'admin@gimnasio.com' })
  @IsEmail({}, { message: 'El email no tiene formato válido' })
  email: string;

  @ApiProperty({ example: 'MiPassword123' })
  @IsString()
  @MinLength(6)
  password: string;
}