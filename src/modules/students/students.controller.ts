import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto, UpdateStudentProfileDto } from './dto/update-student.dto';
import { FindStudentsQueryDto } from './dto/find-students-query.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role } from '../../common/enums/role.enum';

@ApiTags('students')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Registrar nuevo alumno' })
  create(@Body() dto: CreateStudentDto) {
    return this.studentsService.create(dto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.OWNER)
  @ApiOperation({ summary: 'Listar alumnos (paginado)' })
  findAll(@Query() query: FindStudentsQueryDto) {
    return this.studentsService.findAll(query);
  }

  @Get('me')
  @ApiOperation({ summary: 'Obtener perfil de alumno actual' })
  findMe(@CurrentUser('id') userId: string) {
    return this.studentsService.findByUserId(userId);
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Ver perfil completo de alumno' })
  findOne(@Param('id') id: string) {
    return this.studentsService.findOne(id);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Actualizar propio perfil' })
  updateMe(
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateStudentProfileDto,
  ) {
    return this.studentsService.updateProfile(userId, dto);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Editar datos de alumno' })
  update(@Param('id') id: string, @Body() dto: UpdateStudentDto) {
    return this.studentsService.update(id, dto);
  }

  @Patch(':id/deactivate')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Dar de baja alumno' })
  deactivate(@Param('id') id: string) {
    return this.studentsService.deactivate(id);
  }

  @Patch(':id/reactivate')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Reactivar alumno' })
  reactivate(@Param('id') id: string) {
    return this.studentsService.reactivate(id);
  }
}
