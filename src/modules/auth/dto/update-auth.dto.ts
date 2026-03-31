import { PartialType } from '@nestjs/swagger';
import { CreateDto } from './create-auth.dto';

export class UpdateAuthDto extends PartialType(CreateDto) {}
